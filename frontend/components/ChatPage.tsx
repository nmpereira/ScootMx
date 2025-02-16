import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { getMessages } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import { useGlobalContext } from "@/context/GlobalProvider";

const Message = ({
  message,
  sentByCurrentUser,
}: {
  message: Models.Document;
  sentByCurrentUser: boolean;
}) => {
  return (
<View className={`flex ${sentByCurrentUser ? 'justify-end' : 'justify-start'}`}>
  <View>
    <Text className={`text-md font-semibold ${sentByCurrentUser ? 'text-blue-500' : 'text-primary-500'}`}>
      From: {message.userFrom.username}
      To: {message.userTo.username}
    </Text>
    <Text className="text-xs font-semibold text-tertiary-500">
      {new Date(message.timeSent).toLocaleString("en-US")}
    </Text>
    <View className={`p-2 rounded-lg ${sentByCurrentUser ? 'bg-blue-500' : 'bg-primary-500'}`}>
      <Text className="text-md font-semibold text-white">
        {message.messagebody}
      </Text>
    </View>
  </View>
</View>
  );
};

const ChatPage = () => {
  const { user } = useGlobalContext();
  const [messages, setMessages] =
    useState<Models.DocumentList<Models.Document>>();

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getMessages();
      console.log("[messages]", messages);
      setMessages(messages);
    };
    fetchMessages();
  }, []);
  return (
    <View className="flex flex-col border-2 border-primary-500 p-2 rounded-lg w-96 h-full">
      {messages?.documents.map((message) => (
        <View key={message.$id}  className="">
          <Message
            message={message}
            sentByCurrentUser={user?.$id === message.userFrom.$id}
          />
        </View>
      ))}
    </View>
  );
};

export default ChatPage;
