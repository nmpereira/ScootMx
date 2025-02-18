import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Text } from "react-native";
import { View } from "react-native";
import ScooterCard, { ScooterCardProps } from "@/components/ScooterCard";
import EmptyState from "@/components/EmptyState";
import { appwriteConfig, client, getVehicleListings } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import { getFileView } from "@/lib/imageUpload";
import { parseVehicleData } from "@/utils/utls";

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


        const unsubscribe = client.subscribe(
          `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
          (response) => {
            // Callback will be executed on all account events.
            console.log("REALTIME", response);
          }
        );
        console.log("UNSUBSCRIBE", unsubscribe);
    
        return () => {
          unsubscribe();
        };
  }, []);

  return (
    <SafeAreaView className="bg-background-950 h-full">
      {/* <ScrollView
        contentContainerStyle={{
          height: "80%",
        }}
      > */}
      <View className="w-full flex justify-center items-center h-full px-4">
        <Text className="text-3xl text-white font-bold text-center">
          Scooters, ATVs, E-Bikes{"\n"} Rentals & More with{" "}
        </Text>
        <FlatList
          data={vehicleListings}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <ScooterCard {...item} />}
          ListHeaderComponent={() => (
            <>
              <View className="flex my-6 px-4">
                <Text className="font-pmedium text-gray-100 text-sm">
                  Search Results
                </Text>
                <Text className="text-2xl font-psemibold text-white mt-1">
                  Scooters, ATVs, E-Bikes Rentals & More
                </Text>

                <View className="mt-6 mb-8">
                  {/* <SearchInput initialQuery={query} refetch={refetch} /> */}
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

