import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import MessagePage from "@/components/ChatWithUser";

const ChatWithUser = () => {
  const { chatId } = useLocalSearchParams();
  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="flex items-center justify-center h-full p-16">
        <MessagePage otherUser={chatId as string} />
      </View>
    </SafeAreaView>
  );
};

export default ChatWithUser;
