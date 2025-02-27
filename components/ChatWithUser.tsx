import AvatarComponent from "@/components/AvatarComponent";
import {
  appwriteConfig,
  client,
  getMessages,
  sendMessage,
} from "@/lib/appwrite";
import { MessageDocumentDB, UserDocumentDB } from "@/types/dbTypes";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Models } from "react-native-appwrite";
import { GiftedChat, QuickReplies, User } from "react-native-gifted-chat";
import { HeaderWithoutUser } from "@/components/Header";

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

const parseMessage = (
  message: MessageDocumentDB,
  currentUser: UserDocumentDB,
  nonCurrentUser: UserDocumentDB
): IGiftedMessage => {
  const isCurrentUser = message.userFrom.$id === currentUser?.$id;

  console.log({ message, currentUser, nonCurrentUser });

  return {
    _id: message.$id,
    text: message.messagebody,
    createdAt: new Date(message.$createdAt),
    user: {
      _id: isCurrentUser ? currentUser.$id : nonCurrentUser.$id,
      name: isCurrentUser ? currentUser.username : nonCurrentUser.username,
      avatar: isCurrentUser ? currentUser.avatar : nonCurrentUser.avatar,
    },
  };
};

const parseMessages = ({
  messages,
  currentUser,
  nonCurrentUser,
}: {
  messages: MessageDocumentDB[];
  currentUser: UserDocumentDB;
  nonCurrentUser: UserDocumentDB;
}): IGiftedMessage[] => {
  return messages.map((message) =>
    parseMessage(message, currentUser, nonCurrentUser)
  );
};

const MessagePage = ({ otherUser }: { otherUser: string }) => {
  const [usersInChat, setUsersInChat] = useState<{
    currentUser: UserDocumentDB | null;
    nonCurrentUser: UserDocumentDB | null;
  }>({
    currentUser: null,
    nonCurrentUser: null,
  });
  const usersInChatRef = useRef(usersInChat);
  const [messages, setMessages] = useState<IGiftedMessage[]>([]);
  const [text, setText] = useState<string>("");

  const fetchMessages = useCallback(async () => {
    const { documents, currentUser, nonCurrentUser } = await getMessages(
      otherUser
    );
    const parsedMessages = parseMessages({
      messages: documents,
      currentUser,
      nonCurrentUser,
    });
    setUsersInChat({ currentUser, nonCurrentUser });
    usersInChatRef.current = { currentUser, nonCurrentUser };
    setMessages(parsedMessages);
  }, [otherUser]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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
        payload: MessageDocumentDB;
        channels: string[];
      }) => {
        if (events.includes("databases.*.collections.*.documents.*.create")) {
          console.log("A MESSAGE WAS CREATED", payload, {
            usersInChat: usersInChatRef.current,
          });

          const newMessage = parseMessage(
            payload,
            usersInChatRef.current.currentUser!,
            usersInChatRef.current.nonCurrentUser!
          );
          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, [newMessage])
          );
        }
      }
    );

    return () => {
      console.log("unsubscribing from channel, messages");
      unsubscribe();
    };
  }, []);

  const handleSendMessage = async (messages: IGiftedMessage[]) => {
    const newMessage = messages[0].text;

    const userTo = otherUser;
    if (!userTo) return;

    const messageData = {
      message: newMessage,
      userTo: userTo,
    };

    await sendMessage(messageData);
  };

  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="bg-background-light flex-1 w-full max-w-[414px] rounded-lg">
        <HeaderWithoutUser
          title={usersInChat.nonCurrentUser?.username || "Chat"}
          backButtonFn={() => router.navigate("/(tabs)/messages")}
          userBubble={<AvatarComponent name={
            usersInChat.nonCurrentUser?.username || "Chat"
          } imageUrl={
            usersInChat.nonCurrentUser?.avatar || ""
          } />}
        />
        {/* <View className="flex flex-row items-center gap-4 p-4 border border-tertiary-500 rounded-lg">
          <TouchableOpacity onPress={() => router.navigate("/messages")}>
            <Text className="text-blue-500 font-bold">Back</Text>
          </TouchableOpacity>
          <AvatarComponent
            name={usersInChat.nonCurrentUser?.username || "Chat"}
            imageUrl={usersInChat.nonCurrentUser?.avatar || ""}
          />
          <Text className="text-2xl font-semibold text-tertiary-500">
            {usersInChat.nonCurrentUser?.username || "Chat"}
          </Text>
        </View> */}

        <GiftedChat
          messages={messages}
          onSend={(messages) => handleSendMessage(messages)}
          text={text}
          user={{
            _id: usersInChat.currentUser?.$id as string,
            name: usersInChat.currentUser?.username,
            avatar: usersInChat.currentUser?.avatar,
          }}
          renderUsernameOnMessage
          onInputTextChanged={setText}
          alwaysShowSend
          textInputProps={{
            multiline: true,

            onKeyPress: (
              event:
                | React.KeyboardEvent<HTMLInputElement>
                | React.KeyboardEvent<HTMLTextAreaElement>
            ) => {
              if (
                Platform.OS === "web" &&
                event.nativeEvent.key === "Enter" &&
                !event.nativeEvent.shiftKey
              ) {
                if (text.trim() !== "") {
                  handleSendMessage([
                    {
                      text,
                      user: { _id: usersInChat.currentUser?.$id as string },
                      _id: Math.random().toString(),
                      createdAt: new Date(),
                    },
                  ]);

                  setTimeout(() => {
                    setText("");
                  }, 200);
                }
                // event.preventDefault();
              }
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MessagePage;
