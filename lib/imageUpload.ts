import * as ImagePicker from "expo-image-picker";
import { appwriteConfig, storage } from "@/lib/appwrite";
import { ID } from "react-native-appwrite";
import { Platform } from "react-native";
import AlertMessage from "@/components/Alert";

const prepareNativeFile = async (
  asset: ImagePicker.ImagePickerAsset
): Promise<{ name: string; type: string; size: number; uri: string }> => {
  try {
    const url = new URL(asset.uri);

    // Handle native file preparation
    return {
      name: url.pathname.split("/").pop()!,
      size: asset.fileSize!,
      type: asset.mimeType!,
      uri: url.href,
    } as any;
  } catch (error) {
    console.error("[prepareNativeFile] error ==>", error);
    return Promise.reject(error);
  }
};

/**
 * Uploads an image to Appwrite storage
 */
const uploadImageAsync = async (asset: ImagePicker.ImagePickerAsset) => {
  try {
    const response = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      // @ts-ignore
      Platform.OS === "web" ? asset.file! : await prepareNativeFile(asset)
    );

    const fileId = response.$id;
    return fileId;
  } catch (error) {
    console.error("[uploadImageAsync] error ==>", error);
    return Promise.reject(error);
  }
};

/**
 * Launches the device image picker
 */
export const pickImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      AlertMessage({ message: "Camera roll permissions needed!" });
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.6,
    });

    const result = await handleImagePicked(pickerResult);
    return result;
  } catch (error) {
    console.error("[pickImage] error ==>", error);
    return Promise.reject(error);
  }
};

/**
 * Handles the image picked from the device
 */
const handleImagePicked = async (
  pickerResult: ImagePicker.ImagePickerResult
) => {
  try {
    if (!pickerResult.canceled) {
      const result = await uploadImageAsync(pickerResult.assets[0]);
      return result;
    }
    return null;
  } catch (e) {
    console.error("[handleImagePicked] error ==>", e);
    alert(`Upload failed, sorry :( ${e}`);
  } finally {
  }
};

export const getFilePreview = async (fileId: string) => {
  const fileUrl = storage.getFilePreview(appwriteConfig.storageId, fileId);
  return fileUrl as string;
};

export const getFileView = async (fileId: string) => {
  const fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
  return fileUrl as string;
};

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
  } catch (error) {
    console.error("[deleteFile] error ==>", error);
    return Promise.reject(error);
  }
};
