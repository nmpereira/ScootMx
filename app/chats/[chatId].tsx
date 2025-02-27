import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import MessagePage from "@/components/ChatWithUser";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Spinner } from "@/components/ui/spinner";
import Loader from "@/components/Loader";
import { HeaderWithoutUser } from "@/components/Header";
import AvatarComponent from "@/components/AvatarComponent";

const ChatWithUser = () => {
  const { chatId } = useLocalSearchParams();

  const { loading, isLogged } = useGlobalContext();

  if (loading) return <Loader isLoading={loading} />;

  if (!loading && !isLogged) return <Redirect href="/(tabs)" />;
  return (
    // <SafeAreaView className="bg-background-950 h-full w-full">
        <MessagePage otherUser={chatId as string} />
    // </SafeAreaView>
  );
};

export default ChatWithUser;
