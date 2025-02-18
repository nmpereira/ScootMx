import { View, Text, SafeAreaView } from "react-native";
import React from "react";

const Listings = () => {
  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="flex items-center justify-center h-full">
        <Text className="text-2xl font-semibold text-tertiary-500">
          listing
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Listings;
