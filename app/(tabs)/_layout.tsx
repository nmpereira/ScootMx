import { router, Tabs } from "expo-router";
import React from "react";

import { View, Image, Text, TouchableOpacity } from "react-native";

import { icons } from "../../constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import AvatarComponent from "@/components/AvatarComponent";
import Header from "@/components/Header";

const TabIcon = ({
  icon,
  color,
  name,
  focused,
}: {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}) => {
  return (
    <View className="flex items-center justify-center mt-2 min-w-[80px]">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6 max-w-[24px] max-h-[24px]"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function TabLayout() {
  const { isLogged, user } = useGlobalContext();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFA001",
        tabBarInactiveTintColor: "#CDCDE0",
        headerShown: true,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#161622",
          borderTopWidth: 0,
          height: 50,
        },
        header: (data) => (
          <Header
            title={data.options.title || "Scooter Rental"}
            username={user?.username}
            avatar={user?.avatar}
            isLogged={isLogged}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Rentals",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.home}
              color={color}
              name="Rentals"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="create"
        redirect={!isLogged}
        options={{
          title: "Post an Ad",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.plus}
              color={color}
              name="create"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        redirect={!isLogged}
        options={{
          title: "Chat",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.play}
              color={color}
              name="messages"
              focused={focused}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={icons.menu}
              color={color}
              name="Settings"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
