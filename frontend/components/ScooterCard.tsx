import React from "react";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { TouchableOpacity, View } from "react-native";
import { HStack } from "@/components/ui/hstack";
import { router } from "expo-router";
import { FormFieldProps } from "@/app/(tabs)/create";

interface SellerProps {
  name: string;
  profilePicture: string;
  rating: number;
  ratingCount: number;
}

export interface ScooterCardProps extends FormFieldProps {
  listingId: string;
  images: string[];
  seller: SellerProps;
}

const SellerCard = ({
  name,
  profilePicture,
  rating,
  ratingCount,
}: SellerProps) => {
  return (
    <View className="flex items-center">
      <Image
        source={{
          uri: profilePicture,
        }}
        className="w-10 h-10 rounded-full"
        alt="profile picture"
      />
      <View className="ml-4">
        <Text className="text-sm font-normal">{name}</Text>
        <Text className="text-xs font-normal">
          {rating}/5 ({ratingCount})
        </Text>
      </View>
    </View>
  );
};

const ScooterCard = ({
  title,
  images,
  // datefrom,
  // dateto,
  price,
  currency,
  // vehicleType,
  // vehicleRating,
  // vehicleRatingCount,
  pickupLocation,
  listingId,
  seller,
}: ScooterCardProps) => {
  const handleViewListing = () => {
    router.navigate(`/listing/${listingId}`);
  };

  return (
    <Card className="p-5 rounded-lg max-w-[360px] m-3">
      <View className="flex justify-center items-center">
        <Image
          source={{
            uri: images[0],
          }}
          className="mb-6 h-[240px] w-[240px] rounded-md object-contain aspect-[4/3]"
          alt="image"
        />
      </View>
      <HStack className="">
        <VStack className="w-2/3 ">
          <Heading size="md" className="">
            {title}
          </Heading>
        </VStack>
        <View className="w-1/3 ">
          <SellerCard {...seller} />
        </View>
      </HStack>

      <VStack className="mb-6 w-full ">
        <Text size="sm" className="mb-4 text-typography-700  w-full">
          Availibility:{" "}
          <Text size="sm" className="font-bold">
            {/* {datefrom} - {dateto} */}
            31/12/2022 - 1/12/2023
          </Text>
        </Text>

        <Text size="sm">
          Price:{" "}
          <Text size="sm" className="font-bold">
            {price}
            {currency}
            {"/"} day
          </Text>
        </Text>

        <Text size="sm">
          Pick up location:{" "}
          <Text size="sm" className="font-bold">
            {pickupLocation ? pickupLocation : "N/A"}
          </Text>
        </Text>
      </VStack>
      {/* View listing */}
      <View className="flex justify-center items-center">
        <TouchableOpacity onPress={handleViewListing}>
          <Text size="sm" className="text-primary-500 font-bold">
            View Listing
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
};

export default ScooterCard;
