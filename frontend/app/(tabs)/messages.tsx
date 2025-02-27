import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import ChatPage from "@/components/ChatPage";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Redirect } from "expo-router";
import Loader from "@/components/Loader";

const messages = () => {
  const { loading, isLogged } = useGlobalContext();

  if (loading) return <Loader isLoading={loading} />

  if (!loading && !isLogged) return <Redirect href="/(tabs)" />;
  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="flex items-center justify-center h-full">
        <ChatPage />
      </View>
    </SafeAreaView>
  );
};

export default messages;
