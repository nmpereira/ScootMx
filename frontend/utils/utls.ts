import { getFileView } from "@/lib/imageUpload";
import { Models } from "react-native-appwrite";

export async function parseVehicleData(data: Models.Document) {
  const headerImage = await getImages([data?.images[0]]);

  return {
    title: data?.title,
    listingId: data?.$id,
    images: headerImage,
    price: data?.price,
    currency: data?.currency,
    city: data?.city,
    pickupLocation: data?.pickupLocation,
    enginePower: data?.enginePower,
    vehicleType: data?.vehicleType,
    seller: {
      name: data?.seller.username,
      profilePicture: data?.seller.avatar,
      id: data?.seller.$id,
      rating: 4.5,
      ratingCount: 5,
    },
  };
}

export async function getImages(images: string[]) {
  
  return await Promise.all(
    images.map(async (image) => {
      const url = await getFileView(image);
      return url;
    })
  );
}
