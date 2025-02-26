import { useGlobalContext } from "@/context/GlobalProvider";
import { getMessages } from "@/lib/appwrite";
import { MessageDocumentDB, UserDocumentDB } from "@/types/dbTypes";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useCallback, useEffect } from "react";
import { Models } from "react-native-appwrite";
import { GiftedChat, QuickReplies, User } from "react-native-gifted-chat";

export interface IMessage {
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

const parseMessages = ({
  messages,
  otherUser,
}: {
  messages: MessageDocumentDB[];
  otherUser: string;
}): {
  messages: IMessage[];
  currentUser: UserDocumentDB;
  nonCurrentUser: UserDocumentDB;
} => {
  let currentUser: UserDocumentDB | null = null;
  let nonCurrentUser: UserDocumentDB | null = null;
  return {
    messages: messages.map((message) => {
      const isCurrentUser = message.userFrom.$id === otherUser;

      if(!currentUser || !nonCurrentUser) {
        currentUser = isCurrentUser ? message.userFrom : message.userTo;
        nonCurrentUser = isCurrentUser ? message.userTo : message.userFrom;
      }
      const user: User = {
        _id: isCurrentUser ? message.userFrom.$id : message.userTo.$id,
        name: isCurrentUser
          ? message.userFrom.username
          : message.userTo.username,
        avatar: isCurrentUser ? message.userFrom.avatar : message.userTo.avatar,
      };

      return {
        _id: message.$id,
        text: message.messagebody,
        createdAt: new Date(message.timeSent),
        user,
      };
    }),
    currentUser: currentUser!,
    nonCurrentUser: nonCurrentUser!,
  };
};

const ChatWithUser = () => {
  const { chatId: otherUser }: { chatId: string } = useLocalSearchParams();
  const { user } = useGlobalContext();
  const [messages, setMessages] = useState<IMessage[]>([]);


  const fetchMessages = useCallback(async () => {
    const { documents, total } = await getMessages(otherUser);

    const {
      messages: parsedMessages,
      currentUser,
      nonCurrentUser,
    } = parseMessages({
      messages: documents as Models.Document[] as MessageDocumentDB[],

      otherUser,
    });
    setMessages(parsedMessages);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, []);

  const onSend = useCallback((messages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: user!.$id,
        name: user!.username,
        avatar: user!.avatar,
      }}
    />
  );
};

export default ChatWithUser;
