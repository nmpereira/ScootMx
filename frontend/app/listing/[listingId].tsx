import { View, Text, SafeAreaView } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { getVehicleListingById } from "@/lib/appwrite";
import ScooterCard, { ScooterCardProps } from "@/components/ScooterCard";
import { parseVehicleData } from "@/utils/utls";

const ListingPage = () => {
  const { listingId } = useLocalSearchParams();
  const [listing, setListing] = useState<ScooterCardProps>();

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    if (!listingId) {
      return;
    }

    const id = listingId as string;
    const results = await getVehicleListingById(id);
    const listingData = await parseVehicleData(results);

    setListing(listingData);
  };

  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="flex items-center h-full p-4">
        <Text className="text-2xl font-semibold text-tertiary-500 my-7 text-center">
          Listing Page
        </Text>
        <Text className="text-2xl font-semibold text-tertiary-500 my-7 text-center">
          Listing ID: {listingId}
        </Text>

        <View className="w-full flex justify-center items-center">
          {listing ? <ScooterCard {...listing} /> : <Text>Loading...</Text>}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ListingPage;
