import { useRef, useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { images } from "../../constants";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import Ionicons from "@expo/vector-icons/Ionicons";
import AlertMessage from "@/components/Alert";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // Refs for focusing fields
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      AlertMessage({ message: "Please fill in all fields" });
      return;
    }

    setSubmitting(true);
    try {
      await signIn({
        email: form.email,
        password: form.password,
      });

      const result = await getCurrentUser();
      setUser(result);
      setIsLogged(true);

      router.replace("/");
    } catch (error) {
      AlertMessage({ error: error as Error });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-background-dark h-full">
      <ScrollView>
        <View className="w-full flex justify-center ">
          <View className="w-full flex justify-center items-center ">
            <Image
              source={images.scooterIconText}
              resizeMode="contain"
              className="max-w-[125px] max-h-[125px] mt-8"
            />

            <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
              Log in to ScootMx
            </Text>

            <View className="w-full flex flex-col items-center">
              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e: string) => setForm({ ...form, email: e })}
                otherStyles="mt-7 w-96"
                keyboardType="email-address"
                placeholder=""
                ref={emailRef}
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()} // Move to password
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
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-7 bg-tertiary-500 w-64"
              isLoading={isSubmitting}
              textStyles={""}
            />
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/signUp"
              className="text-lg font-bold text-tertiary-500"
            >
              Signup
            </Link>
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            {/* <Link href="/" className="text-lg font-bold text-tertiary-500">
              Back
            </Link> */}

            <TouchableOpacity onPress={() => router.replace("/")}>
              <Ionicons name="arrow-back" size={48} color="#7B7B8B" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
