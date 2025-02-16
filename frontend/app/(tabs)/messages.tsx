import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import ChatPage from "@/components/ChatPage";

const messages = () => {
  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="flex items-center justify-center h-full">
        <Text className="text-2xl font-semibold text-tertiary-500 ">
          Messages
        </Text>

        <View className="flex items-center justify-center h-[90vh] w-full">
          <ChatPage />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default messages;
