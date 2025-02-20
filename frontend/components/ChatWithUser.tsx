import AvatarComponent from "@/components/AvatarComponent";
import { useGlobalContext } from "@/context/GlobalProvider";
import {
  appwriteConfig,
  client,
  getMessages,
  getUser,
  sendMessage,
} from "@/lib/appwrite";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Models } from "react-native-appwrite";
import MessageBubble from "./MessageBubble";

const MessagePage = ({ otherUser }: { otherUser: string }) => {
  const { user } = useGlobalContext();
  const [nonCurrentUser, setNonCurrentUser] = useState<Models.Document | null>(
    null
  );
  const [messages, setMessages] = useState<Models.Document[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const fetchMessages = useCallback(async () => {
    const response = await getMessages(otherUser);
    setMessages(response?.documents || []);
  }, []);

  const fetchNonCurrentUser = async () => {
    const response = await getUser(otherUser);
    setNonCurrentUser(response);
  };

  useEffect(() => {
    fetchNonCurrentUser();
    fetchMessages();
  }, []);

  useEffect(() => {
    console.log("subscribing to channel, messages");
    const unsubscribe = client.subscribe(
      `databases.${appwriteConfig.databaseId}.collections.${appwriteConfig.messagesCollectionId}.documents`,
      ({
        events,
        payload,
        channels,
      }: {
        events: string[];
        payload: Models.Document;
        channels: string[];
      }) => {
        if (events.includes("databases.*.collections.*.documents.*.create")) {
          console.log("A MESSAGE WAS CREATED", payload);
          setMessages((prevState) => [...prevState, payload]);
        }
      }
    );

    return () => {
      console.log("unsubscribing from channel, messages");
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const userTo = otherUser;
    if (!userTo) return;

    const messageData = {
      message: newMessage,
      userTo: userTo,
    };

    await sendMessage(messageData);
    setNewMessage("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 p-4 w-full max-w-[414px]"
    >
      {/* Chat Header */}
      <View className="flex flex-row items-center gap-4 p-4 border border-tertiary-500 rounded-lg">
        <TouchableOpacity onPress={() => router.navigate("/messages")}>
          <Text className="text-blue-500 font-bold">Back</Text>
        </TouchableOpacity>
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
          <MessageBubble
            message={item}
            sentByCurrentUser={user?.$id === item.userFrom.$id}
          />
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
        className="mb-14 border border-tertiary-500 rounded-lg p-4"
        // onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        onContentSizeChange={
          (width, height) =>
            flatListRef.current?.scrollToOffset({
              offset: height,
              animated: false,
            })

          // setTimeout(() => {
          //   flatListRef.current?.scrollToOffset({ offset: height, animated: false })
          // }, 100)
        }
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

export default MessagePage;
