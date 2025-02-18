import { View, Text, ScrollView, SafeAreaView, Image } from "react-native";
import React from "react";
import { ScooterCardProps } from "@/components/ScooterCard";

const VehiclePage = (props: ScooterCardProps) => {
  const {
    listingId,
    images,
    seller,
    title,
    price,
    currency,
    city,
    pickupLocation,
    enginePower,
    vehicleType,
  } = props;
  return (
    <SafeAreaView className="bg-background-950 h-full">
      {/* Title */}

     
        <View className="w-80 flex flex-row  items-center justify-between">
          <Text className="text-3xl font-bold text-center text-tertiary-500 my-6">
            Rentals
          </Text>
        </View>


      {/* Image */}
      <View className="">
        <Image
          source={{ uri: images[0] }}
          style={{ width: 400, height: 400 }}
          className="rounded-xl"
        />
      </View>

      {/* Price */}

      {/* Location */}

      {/* Engine Power */}

      {/* Vehicle Type */}
    </SafeAreaView>
  );
};

export default VehiclePage;
