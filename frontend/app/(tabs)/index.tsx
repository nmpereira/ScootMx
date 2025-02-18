import EmptyState from "@/components/EmptyState";
import ScooterCard, { ScooterCardProps } from "@/components/ScooterCard";
import SortAndFilter from "@/components/SortAndFilter";
import { appwriteConfig, client, getVehicleListings } from "@/lib/appwrite";
import { parseVehicleData } from "@/utils/utls";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const home = () => {
  const [vehicleListings, setVehicleListings] = useState<
    ScooterCardProps[] | null
  >(null);

  useEffect(() => {
    const fetchListings = async () => {
      const listings = await getVehicleListings();

      const vehicleListings = await Promise.all(
        listings?.documents.map(async (doc) => {
          return parseVehicleData(doc);
        })
      );
      console.log("[vehicleListings]", vehicleListings);
      setVehicleListings(vehicleListings);
    };

    fetchListings();
  }, []);

  return (
    <SafeAreaView className="bg-background-950 h-full">
      {/* <ScrollView
        contentContainerStyle={{
          height: "80%",
        }}
      > */}
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-3xl font-bold text-center text-tertiary-500 my-6">
          Rentals
        </Text>
        <FlatList
          data={vehicleListings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ScooterCard {...item} />}
          ListHeaderComponent={() => (
            <>
              <View className="flex my-6 px-4">
                {/* <Text className="font-pmedium text-gray-100 text-sm">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white mt-1">
                  Scooters, ATVs, E-Bikes Rentals & More
                </Text> */}

                <View className="">
                  {/* <SearchInput initialQuery={query} refetch={refetch} /> */}
                  {/* button for filter and sort */}
                  <SortAndFilter />
                </View>
              </View>
            </>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="No Rentals Found"
              subtitle="No rentals found for the selected dates."
            />
          )}
        />
      </View>
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

export default home;
