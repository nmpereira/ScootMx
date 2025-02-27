import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import AvatarComponent from "./AvatarComponent";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";

interface HeaderProps {
  title: string;
  username: string;
  avatar: string;
  isLogged: boolean;
}

const Header = ({ title, username, avatar, isLogged }: HeaderProps) => {
  const navigateToSettings = () => {
    router.navigate("/settings");
  };
  return (
    <SafeAreaView className="bg-tertiary-500">
      {/* <StatusBar style="auto" /> */}
      <View className="flex flex-row justify-between items-center p-4 bg-tertiary-500">
        <Text className="text-2xl font-semibold">{title}</Text>
        {isLogged ? (
          <View className="flex flex-col items-center justify-center">
            <TouchableOpacity onPress={navigateToSettings}>
              <AvatarComponent name={username} imageUrl={avatar} size="sm" />
            </TouchableOpacity>

            <Text className="text-sm pr-4">Welcome, {username}</Text>
          </View>
        ) : (
          <TouchableOpacity onPress={() => router.navigate("/(auth)/signIn")}>
            <Text className="text-white text-sm bg-primary-500 p-2 rounded-md">
              Login
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export const HeaderWithoutUser = ({
  title,
  backButtonFn,
  userBubble,
}: {
  title: string;
  backButtonFn: () => void;
  userBubble?: React.ReactNode;
}) => {
  return (
    <SafeAreaView className="bg-tertiary-500">
      <View className="flex flex-row items-center p-4 bg-tertiary-500 gap-4">
        <TouchableOpacity onPress={backButtonFn}>
          {/* <Text className="text-blue-500 text-lg font-bold">Back</Text> */}
          <Ionicons name="arrow-back" size={24} color="#7B7B8B" />
        </TouchableOpacity>
        {userBubble}
        <Text className="text-2xl font-semibold">{title}</Text>
      </View>
    </SafeAreaView>
  );
};

export default Header;
