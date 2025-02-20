import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import ChatPage from "@/components/ChatPage";

const messages = () => {
  return (
    <SafeAreaView className="bg-background-950 h-full pt-16">
      <View className="flex items-center justify-center h-full">
        <ChatPage />
      </View>
    </SafeAreaView>
  );
};

export default messages;
