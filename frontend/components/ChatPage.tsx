import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import { getLatestMessages } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import AvatarComponent from "@/components/AvatarComponent";
import { router } from "expo-router";
import { GlobalContext, useGlobalContext } from "@/context/GlobalProvider";

const ChatPage = () => {
  const { user } = useGlobalContext();
  const [chatList, setChatList] = useState<Models.Document[]>([]);

  const fetchChatList = async () => {
    const response = await getLatestMessages();
    console.log(`[ChatPage] response`, response);
    setChatList(response?.documents || []);
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const getOtherUser = (chat: Models.Document) => {
    return chat.userTo.userId === user?.$id ? chat.userFrom : chat.userTo;
  };

  const goToUserChat = (item: Models.Document) => {
    const otherUser = getOtherUser(item);

    if (!otherUser) {
      return;
    }
    router.navigate(`/chats/${otherUser.$id}`);
  };

  return (
    <View className="flex-1 bg-background-950 w-full max-w-[414px] border border-primary-500 h-full">
      <FlatList
        data={chatList}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToUserChat(item)}
            className="flex flex-row items-center p-4 border border-tertiary-500"
          >
            <AvatarComponent
              name={item.userTo.username}
              imageUrl={item.userTo.avatar}
            />
            <Text className="ml-4 text-lg font-semibold text-tertiary-500">
              {item.userTo.username}
            </Text>
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
