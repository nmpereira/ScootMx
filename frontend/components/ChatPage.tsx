import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useGlobalContext } from "@/context/GlobalProvider";
import { getMessages, sendMessage } from "@/lib/appwrite";
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

const ChatPage = () => {
  const { user } = useGlobalContext();
  const [messages, setMessages] = useState<Models.Document[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(async () => {
    const response = await getMessages();
    console.log("[messages]", response);
    setMessages(response?.documents || []);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userTo = messages.find(
      (msg) => msg.userFrom.$id !== user?.$id
    )?.userFrom;
    if (!userTo) return;

    const messageData = {
      message: newMessage,
      userTo: userTo.$id,
    };

    await sendMessage(messageData);
    setNewMessage("");
    fetchMessages(); // Refresh messages after sending

    // Auto-scroll to the latest message
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 200);
  };

  const nonCurrentUser = messages.find(
    (message) => message.userFrom.$id !== user?.$id
  )?.userFrom;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 p-4 w-full max-w-[414px]"
    >
      {/* Chat Header */}
      <View className="flex flex-row items-center gap-4 p-4 border border-tertiary-500 rounded-lg">
        <AvatarComponent
          name={nonCurrentUser?.username}
          imageUrl={nonCurrentUser?.avatar}
        />
        <Text className="text-2xl font-semibold text-tertiary-500">
          {nonCurrentUser?.username || "Chat"}
        </Text>
      </View>

      {/* Chat Messages */}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Message
            message={item}
            sentByCurrentUser={user?.$id === item.userFrom.$id}
          />
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
        className="mb-14 border border-tertiary-500 rounded-lg p-4"
      />

      {/* Message Input */}
      <View className="absolute bottom-0 left-0 w-full flex flex-row items-center p-3">
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg bg-gray-100"
          multiline
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          className="ml-3 p-3 bg-blue-500 rounded-lg"
        >
          <Text className="text-white font-semibold">Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatPage;
