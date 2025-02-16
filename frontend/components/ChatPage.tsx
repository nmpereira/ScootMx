import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, FlatList } from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getMessages } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import AvatarComponent from "@/components/AvatarComponent";

const Message = ({
  message,
  sentByCurrentUser,
}: {
  message: Models.Document;
  sentByCurrentUser: boolean;
}) => {
  return (
    <View
      className={`w-full flex ${
        sentByCurrentUser ? "items-end" : "items-start"
      }`}
    >
      <View
        className={`max-w-[75%] p-3 rounded-lg shadow-md ${
          sentByCurrentUser ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <Text
          className={`text-sm font-semibold ${
            sentByCurrentUser ? "text-gray-700" : "text-black"
          }`}
        >
          {sentByCurrentUser ? "You" : message.userFrom.username}
        </Text>
        <Text
          className={`text-md ${
            sentByCurrentUser ? "text-white" : "text-black"
          }`}
        >
          {message.messagebody}
        </Text>
        <Text className="text-xs text-gray-500 text-right">
          {new Intl.DateTimeFormat("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }).format(new Date(message.timeSent))}
        </Text>
      </View>
    </View>
  );
};

const ChatPage = () => {
  const { user } = useGlobalContext();
  const [messages, setMessages] = useState<Models.Document[]>([]);

  const fetchMessages = useCallback(async () => {
    const response = await getMessages();
    console.log("[messages]", response);
    setMessages(response?.documents || []);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const nonCurrentUser = messages.find(
    (message) => message.userFrom.$id !== user?.$id
  )?.userFrom;

  return (
    <View className="flex-1 w-96 p-4 bg-background-950">
        <View className="flex flex-row items-center gap-4">
      <AvatarComponent
        name={nonCurrentUser?.username}
        imageUrl={nonCurrentUser?.avatar}
      />
      <Text className="text-2xl font-semibold text-tertiary-500">{nonCurrentUser?.username}</Text>
    </View>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Message
            message={item}
            sentByCurrentUser={user?.$id === item.userFrom.$id}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        inverted // Keeps the latest messages at the bottom
      />
    </View>
  );
};

export default ChatPage;
