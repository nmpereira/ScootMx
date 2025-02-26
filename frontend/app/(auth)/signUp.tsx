import { useRef, useState } from "react";
import { TextInput } from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Image } from "react-native";

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

  // Create refs for each input field
  const usernameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const submit = async () => {
    if (form.username === "" || form.email === "" || form.password === "") {
      AlertMessage({ message: "Please fill in all fields" });
      return;
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
      AlertMessage({ error: error as Error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background-dark h-full">
      <ScrollView>
        <View className="w-full h-full flex justify-center h-full px-4 mb-10">
          <View className="w-full flex justify-center items-center">
            <Image
              source={images.scooterIconText}
              resizeMode="contain"
              className="max-w-[125px] max-h-[125px] mt-4"
            />

            <Text className="text-2xl font-semibold text-white mt-4 font-psemibold">
              Sign Up to ScootMx
            </Text>

            <View className="w-full flex flex-col items-center">
              <FormField
                title="Username"
                value={form.username}
                handleChangeText={(e: string) =>
                  setForm({ ...form, username: e })
                }
                otherStyles="mt-7 w-96"
                placeholder=""
                ref={usernameRef}
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()} // Move to Email
              />

              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e: string) => setForm({ ...form, email: e })}
                otherStyles="mt-7 w-96"
                keyboardType="email-address"
                placeholder=""
                ref={emailRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()} // Move to Password
              />

              <FormField
                title="Password"
                value={form.password}
                handleChangeText={(e: string) =>
                  setForm({ ...form, password: e })
                }
                otherStyles="mt-7 w-96"
                placeholder=""
                ref={passwordRef}
                returnKeyType="done"
                onSubmitEditing={submit} // Submit form on Enter
              />
            </View>

            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7 bg-tertiary-500 w-64"
              isLoading={isSubmitting}
              textStyles=""
            />
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link href="/signIn" className="text-lg font-bold text-tertiary-500">
              Login
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
