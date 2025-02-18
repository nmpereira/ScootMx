import AvatarComponent from "@/components/AvatarComponent";
import React from "react";
import {
    Text,
    View
} from "react-native";
import { Models } from "react-native-appwrite";


const MessageBubble = ({
  message,
  sentByCurrentUser,
}: {
  message: Models.Document;
  sentByCurrentUser: boolean;
}) => {
  return (
    <View
      className={`flex flex-row w-full items-end ${
        sentByCurrentUser ? "justify-end" : "justify-start"
      } mb-4`}
    >
      {!sentByCurrentUser && (
        <AvatarComponent
          name={message.userFrom.username}
          imageUrl={message.userFrom.avatar}
        />
      )}
      <View
        className={`max-w-[75%] p-3 rounded-lg shadow-md mx-2 ${
          sentByCurrentUser ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <Text
          className={`text-xs font-semibold ${
            sentByCurrentUser ? "text-white" : "text-black"
          }`}
        >
          {sentByCurrentUser ? "You" : message.userFrom.username}
        </Text>
        <Text
          className={`text-lg ${
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
      {sentByCurrentUser && (
        <AvatarComponent
          name={message.userFrom.username}
          imageUrl={message.userFrom.avatar}
        />
      )}
    </View>
  );
};

export default MessageBubble;
