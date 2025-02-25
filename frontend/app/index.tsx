import { View, Text, ScrollView, Image, Platform } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "@/constants";
import { Redirect, router, SplashScreen } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import Loader from "@/components/Loader";

const Welcome = () => {
  const { loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/(tabs)" />;

  return (
    <SafeAreaView className="bg-background-dark h-full">
      <Loader isLoading={loading} />
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full">
          <Image
            source={images.scooterIconText}
            resizeMode="contain"
            className="max-w-[75px] max-h-[75px] mt-8"
          />
          <Image
            source={images.SplashScooters}
            className="max-w-[380px] max-h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Scooters, ATVs, E-Bikes{"\n"} Rentals & More with{" "}
              <Text className="text-secondary-200">ScootMx</Text>
            </Text>

            <Image
              source={images.path}
              //   check if web or mobile
              className={`${
                Platform.OS === "web"
                  ? //   ? "w-[90px] h-[8px] absolute -bottom-8 -right-8"
                    "absolute -bottom-3 -right-8 max-w-[180px] max-h-[20px]"
                  : "w-[136px] h-[15px] absolute -bottom-2 -right-8"
              }`}
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Rent a scooter, ATV, or e-bike from a local owner in your city.
            {"\n"}
            ScootMx is the best way to rent scooters, ATVs, and e-bikes in
            {"\n"}
            your city. We offer a wide range of vehicles to choose from.
          </Text>

          <CustomButton
            title="Sign In"
            handlePress={() => router.push("/signIn")}
            containerStyles="w-full mt-7 h-12 rounded-xl min-h-[12] max-w-[380px] bg-tertiary-500"
            textStyles={"typography"}
            isLoading={false}
          />

          <CustomButton
            title="Continue as Guest"
            handlePress={() => router.push("/(tabs)")}
            containerStyles="w-full mt-3 h-12 rounded-xl min-h-[12] max-w-[380px] bg-background-400"
            textStyles={"typography"}
            isLoading={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Welcome;
