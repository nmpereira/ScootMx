import { useGlobalContext } from "@/context/GlobalProvider";
import { getMessages, sendMessage } from "@/lib/appwrite";
import { MessageDocumentDB, UserDocumentDB } from "@/types/dbTypes";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { Models } from "react-native-appwrite";
import { GiftedChat, QuickReplies, User } from "react-native-gifted-chat";
import {
  Platform,
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
} from "react-native";

export interface IGiftedMessage {
  _id: string | number;
  text: string;
  createdAt: Date | number;
  user: User;
  image?: string;
  video?: string;
  audio?: string;
  system?: boolean;
  sent?: boolean;
  received?: boolean;
  pending?: boolean;
  quickReplies?: QuickReplies;
}

// Helper function to parse Appwrite messages into Gifted Chat format
const parseMessages = ({
  messages,
  currentUserId,
}: {
  messages: MessageDocumentDB[];
  currentUserId: string;
}): IGiftedMessage[] => {
  return messages
    .map((message): IGiftedMessage | null => {
      if (!message.userFrom || !message.userTo) {
        console.error("Invalid message format:", message);
        return null;
      }
      try {
        const isCurrentUser = message.userFrom.$id === currentUserId;

        const user: User = {
          _id: isCurrentUser ? message.userFrom.$id : message.userTo.$id,
          name: isCurrentUser
            ? message.userFrom.username
            : message.userTo.username,
          avatar: isCurrentUser
            ? message.userFrom.avatar
            : message.userTo.avatar,
        };

        return {
          _id: message.$id,
          text: message.messagebody,
          createdAt: new Date(message.timeSent),
          user,
        } as IGiftedMessage;
      } catch (error) {
        return null;
      }
    })
    .filter((message): message is IGiftedMessage => message !== null);
  // .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const ChatWithUser = () => {
  const { chatId: otherUser } = useLocalSearchParams<{ chatId: string }>();
  const { user } = useGlobalContext();
  const [messages, setMessages] = useState<IGiftedMessage[]>([]);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);

  const fetchMessages = useCallback(async () => {
    if (!user) return; // Don't fetch if user is null
    try {
      const { documents, total } = await getMessages(otherUser);

      const parsedMessages = parseMessages({
        messages: documents as Models.Document[] as MessageDocumentDB[],
        currentUserId: user!.$id,
      });

      setMessages(parsedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      // Handle error (e.g., show an error message)
    }
  }, [otherUser, user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, user]); // user is now a dependency.

  const onSend = useCallback(
    async (newMessages: IGiftedMessage[] = []) => {
      if (!user) return; //don't send if the user is null
      try {
        const newMessage = newMessages[0];
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, [newMessage])
        );

        await sendMessage({
          message: newMessage.text,
          userTo: otherUser,
        });
      } catch (error) {
        console.error("Error sending message:", error);
        // Optionally, revert the UI to the previous state if sending fails
        setMessages((previousMessages) =>
          previousMessages.filter((m) => m._id !== newMessages[0]._id)
        );
        // Handle error (e.g., show an error message)
      }
    },
    [otherUser, user]
  );

  // Show a loading indicator while user is null
  if (!user) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: user!.$id,
          name: user!.username,
          avatar: user!.avatar,
        }}
        isLoadingEarlier={isLoadingEarlier}
      />
    </KeyboardAvoidingView>
  );
};

export default ChatWithUser;
