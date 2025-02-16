import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import ChatPage from "@/components/ChatPage";

const messages = () => {
  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="flex items-center justify-center h-[90vh] w-full">
        <ChatPage />
      </View>
    </SafeAreaView>
  );
};

export default messages;
