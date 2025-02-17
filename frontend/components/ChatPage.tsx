import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";

import { getChatPreviews } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";
import AvatarComponent from "@/components/AvatarComponent";
import { router } from "expo-router";
import { GlobalContext, useGlobalContext } from "@/context/GlobalProvider";

interface ChatPreview {
  user: Models.Document;
  latestMessage: Models.Document;
}

const ChatPage = () => {
  const [chatList, setChatList] = useState<ChatPreview[]>([]);

  const fetchChatList = async () => {
    const response = await getChatPreviews();
    console.log(`[ChatPage] response`, response);
    setChatList(response);
  };

  useEffect(() => {
    fetchChatList();
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
            <Text className="ml-4 text-lg font-semibold text-tertiary-500">
              {item.user.username}
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
