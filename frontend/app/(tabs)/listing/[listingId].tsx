import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const ListingPage = () => {
  const { listingId } = useLocalSearchParams();
  return (
    <View>
      <Text>Detailed view of listing {listingId}</Text>
    </View>
  );
};

export default ListingPage;
