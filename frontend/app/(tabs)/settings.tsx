import { View, Text, SafeAreaView } from "react-native";
import React from "react";
import { useGlobalContext } from "@/context/GlobalProvider";
import { signOut } from "@/lib/appwrite";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";

const settings = () => {
  const { user, setUser, setIsLogged, isLogged } = useGlobalContext();
  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLogged(false);
    router.replace("/signIn");
  };

  const redirectToSignIn = () => {
    router.replace("/signIn");
  };
  return (
    <SafeAreaView className="bg-background-950 h-full">
      <View className="flex items-center justify-center h-full">
        <Text className="text-2xl font-semibold text-tertiary-500">
          Settings
        </Text>
        <CustomButton
          handlePress={isLogged ? logout : redirectToSignIn}
          title={isLogged ? "Logout" : "Sign In"}
          containerStyles={"mt-7 bg-tertiary-500 w-64"}
          textStyles={""}
          isLoading={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default settings;
