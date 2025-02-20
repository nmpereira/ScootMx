import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";

import AvatarComponent from "@/components/AvatarComponent";
import { useGlobalContext } from "@/context/GlobalProvider";
import { appwriteConfig, client, getChatPreviews } from "@/lib/appwrite";
import TimeAgo from "@andordavoti/react-native-timeago";
import { router } from "expo-router";
import { Models } from "react-native-appwrite";

export interface ChatPreview {
  user: Models.Document;
  latestMessage: Models.Document;
}

const ChatPage = () => {
  const { user } = useGlobalContext();
  const [chatList, setChatList] = useState<ChatPreview[]>([]);

  const fetchChatList = async () => {
    const response = await getChatPreviews();
    console.log(`[ChatPage] response`, response);
    setChatList(response);
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  useEffect(() => {
    console.log("subscribing to channel, chatList");
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
          setChatList((prevState) => {
            const newChatList = prevState.map((chat) => {
              //   get non-current user from payload, its either userFrom or userTo
              const otherUser =
                payload.userFrom.$id === user!.$id
                  ? payload.userTo
                  : payload.userFrom;

              // update the chat for the other user
              if (chat.user.$id === otherUser.$id) {
                return {
                  ...chat,
                  latestMessage: payload,
                };
              }
              return chat;
            });
            return newChatList;
          });
        }
      }
    );

    return () => {
      console.log("unsubscribing from channel, chatList");
      unsubscribe();
    };
  }, []);

  const goToUserChat = (item: Models.Document) => {
    const otherUser = item.$id;

    if (!otherUser) {
      return;
    }
    router.navigate(`/chats/${otherUser}`);
  };

  return (
    <View className="flex-1 bg-background-950 w-full max-w-[414px] border border-primary-500 h-full">
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.user.$id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToUserChat(item.user)}
            className="flex flex-row items-center p-4 border border-tertiary-500"
          >
            <AvatarComponent
              name={item.user.username}
              imageUrl={item.user.avatar}
            />
            <View className="flex flex-col">
              <Text className="ml-4 text-lg font-semibold text-tertiary-500">
                {item.user.username}
              </Text>

              <Text className="text-white ml-4 text-lg">
                {item.latestMessage?.messagebody}
              </Text>

              <Text className="ml-4 text-sm text-tertiary-500">
                <TimeAgo dateTo={new Date(item.latestMessage?.$createdAt)} />
              </Text>
            </View>
          </TouchableOpacity>
        )}
        className="w-full"
        ListHeaderComponent={
          <View className="p-4 border-b border-tertiary-500">
            <Text className="text-2xl font-semibold text-tertiary-500">
              Chats
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default ChatPage;
