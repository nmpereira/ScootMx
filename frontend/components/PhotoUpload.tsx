import React, { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity } from "react-native";
import { deleteFile, getFilePreview, pickImage } from "@/lib/imageUpload";
import CustomButton from "@/components/CustomButton";
import { icons } from "@/constants";

interface PhotoUploadProps {
  photoIds: Record<string, string>;
  setPhotoIds: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const PhotoUpload = ({ photoIds, setPhotoIds }: PhotoUploadProps) => {
  const handlePress = async () => {
    const imageId = await pickImage();
    if (!imageId) return;

    const filePreviewUrl = await getFilePreview(imageId);
    setPhotoIds({ ...photoIds, [imageId]: filePreviewUrl });
   
  };

  const handleDelete = (photoId: string) => {
    deleteFile(photoId);
    // update the state
    const updatedPhotoIds = { ...photoIds };
    delete updatedPhotoIds[photoId];
    setPhotoIds(updatedPhotoIds);
  };

  const renderItem = ({
    fileId,
    fileUrl,
  }: {
    fileId: string;
    fileUrl: string;
  }) => (
    <View className="m-1 border border-primary-500 rounded-xl">
      <Image
        source={{ uri: fileUrl }}
        className={`w-[100px] h-[100px] rounded-xl`}
      />

      {/* delete icon */}
      <View className="absolute top-0 right-0">
        <TouchableOpacity
          onPress={() => {
            handleDelete(fileId);
          }}
          className="w-8 h-8 mt-2 bg-primary-50 rounded-full flex items-center justify-center"
        >
          <Image source={icons.bin} resizeMode={"contain"} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const getGridHeight = () => {
    const rows = Math.ceil(Object.keys(photoIds).length / 3);
    return rows * 110 + 35 + 25;
  };

  return (
    <View className="flex items-center">
      {Object.keys(photoIds).length > 0 && (
        <View
          className={`mb-7 border border-primary-500 p-4 rounded-xl`}
          style={{ height: getGridHeight(), width: 360 }}
        >
          <FlatList
            data={Object.keys(photoIds)}
            renderItem={({ item }) => {
              return renderItem({
                fileId: item,
                fileUrl: photoIds[item],
              });
            }}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            ListHeaderComponent={
              <Text className="text-primary-200 text-xl font-semibold text-center">
                Photos
              </Text>
            }
          />
        </View>
      )}
      <CustomButton
        title={"Upload Photo"}
        handlePress={handlePress}
        containerStyles={"bg-primary-500 w-64"}
        textStyles={"text-white"}
        isLoading={false}
      />
    </View>
  );
};

export default PhotoUpload;
