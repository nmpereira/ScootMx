import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  Image,
  Platform,
} from "react-native";

import { images } from "../../constants";
import { createUser } from "../../lib/appwrite";

import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from "@/components/FormField";
import CustomButton from "@/components/CustomButton";
import AlertMessage from "@/components/Alert";

const SignUp = () => {
  const { setUser, setIsLogged } = useGlobalContext();

  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      AlertMessage({ message: "Please fill in all fields" });
    }

    setSubmitting(true);
    try {
      const result = await createUser({
        email: form.email,
        password: form.password,
        username: form.username,
      });

      setUser(result);
      setIsLogged(true);

      router.replace("/(tabs)");
    } catch (error) {
      return AlertMessage({ error: error as Error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background-dark h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="w-full flex justify-center items-center">
            <Image
              source={images.scooterIconText}
              resizeMode="contain"
              className="w-[115px] h-[34px]"
            />

            <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
              Sign Up to ScootMx
            </Text>
            <View className="w-full flex flex-col items-center">
              <FormField
                title="Username"
                value={form.username}
                handleChangeText={(e: string) =>
                  setForm({ ...form, username: e })
                }
                otherStyles="mt-10 w-96"
                placeholder={""}
              />

              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e: string) => setForm({ ...form, email: e })}
                otherStyles="mt-7 w-96"
                keyboardType="email-address"
                placeholder={""}
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e: string) =>
                  setForm({ ...form, password: e })
                }
                otherStyles="mt-7 w-96"
                placeholder={""}
              />
            </View>

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7 bg-tertiary-500 w-64"
              isLoading={isSubmitting}
              textStyles={""}
            />
          </View>
          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/signIn"
              className="text-lg font-bold text-tertiary-500"
            >
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
