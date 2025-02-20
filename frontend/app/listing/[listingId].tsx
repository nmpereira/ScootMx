import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getVehicleListingById } from "@/lib/appwrite";
import { ScooterCardProps } from "@/components/ScooterCard";
import { parseVehicleData } from "@/utils/utls";
import { Avatar } from "@/components/ui/avatar";
import AvatarComponent from "@/components/AvatarComponent";

const DisplayDetail = ({ title, value }: { title: string; value: string }) => {
  return (
    <View className="flex flex-col items-start w-80 my-2">
      <View className="flex flex-row items-center gap-4">
        <Text className="text-white text-lg my-2">{title}: </Text>
        <Text className="text-tertiary-500 text-lg">{value}</Text>
      </View>
    </View>
  );
};

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

  const navigateToRenals = () => {
    router.navigate("/");
  };

  return (
    <SafeAreaView className="bg-background-950 h-full">
      <ScrollView className="h-full">

      <View className="flex items-center h-full p-4 border border-tertiary-500 rounded-lg max-w-[414px] mx-auto ">
        {/* Back */}
        <View className="w-80 flex flex-row  items-center justify-between">
          <TouchableOpacity onPress={navigateToRenals}>
            <Text className="text-blue-500 text-lg font-bold">Back</Text>
          </TouchableOpacity>

          {/* Title */}

          <Text className="text-3xl font-bold text-tertiary-500 my-6">
            {listing?.title}
          </Text>

          {/* Empty container */}
          <View></View>
        </View>

        {/* Image */}
        <View className="w-80 h-80 bg-primary-500 rounded-lg">
          <Image
            source={{ uri: listing?.images[0] }}
            className="w-full h-full rounded-xl"
          />
        </View>

        {/* Seller */}
        <View className="flex flex-col items-end my-8 justify-end w-80 border">
          <AvatarComponent
            name={listing?.seller.name || ""}
            imageUrl={listing?.seller?.profilePicture || ""}
          />
          <Text className="text-white text-lg font-bold">
            {listing?.seller.name}
          </Text>
          <View className="flex flex-row items-center">
            <Text className="text-white text-lg">Rating: </Text>
            <Text className="text-tertiary-500 text-lg">
              {listing?.seller.rating}/5 ({listing?.seller.ratingCount})
            </Text>
          </View>
        </View>

        <DisplayDetail
          title={"Price per day $"}
          value={`${listing?.currency} ${listing?.price}`}
        />
        <DisplayDetail title={"Location"} value={`${listing?.city}`} />
        <DisplayDetail title={"Pickup"} value={`${listing?.pickupLocation}`} />

        <DisplayDetail
          title={"Engine Power (CC)"}
          value={`${listing?.enginePower}`}
        />

        <DisplayDetail
          title={"Vehicle Type"}
          value={`${listing?.vehicleType}`}
        />
      </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default ListingPage;
