import { forwardRef, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";

interface FormFieldProps {
  title: string;
  value: string | number;
  placeholder: string;
  handleChangeText: (text: string) => void;
  otherStyles?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  suffix?: string;
  validationText?: string;
  onSubmitEditing?: () => void;
  returnKeyType?: "next" | "done";
}

// Use forwardRef to pass down the ref to the TextInput
const FormField = forwardRef<TextInput, FormFieldProps>(
  (
    {
      title,
      value,
      placeholder,
      handleChangeText,
      otherStyles,
      suffix,
      validationText,
      onSubmitEditing,
      returnKeyType = "next",
      ...props
    },
    ref // Receive ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <View className={`space-y-2 ${otherStyles}`}>
        <Text className="text-base text-gray-100 font-bold">{title}</Text>

        <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-tertiary-400 focus:border-secondary flex flex-row items-center">
          <TextInput
            ref={ref} // Apply the ref here
            className="flex-1 text-white font-psemibold text-base p-4 w-full focus:outline-none"
            value={value as string}
            placeholder={placeholder}
            placeholderTextColor="#7B7B8B"
            onChangeText={handleChangeText}
            onSubmitEditing={onSubmitEditing} // Move to next field or submit form
            returnKeyType={returnKeyType} // Next for all except last field
            secureTextEntry={title === "Password" && !showPassword}
            {...props}
          />

          {title === "Password" && (
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={!showPassword ? "eye" : "eye-off"}
                size={24}
                color="#7B7B8B"
              />
            </TouchableOpacity>
          )}

          {suffix && (
            <Text className="text-white text-2xl font-psemibold absolute top-1/2 right-2 -translate-y-1/2">
              {suffix}
            </Text>
          )}
        </View>

        {validationText && (
          <View className="flex flex-row items-center pl-2 gap-1">
            <AntDesign name="exclamationcircle" size={16} color="#FF0000" />
            <Text className="text-xs text-red-500 font-psemibold">
              {validationText}
            </Text>
          </View>
        )}
      </View>
    );
  }
);

export default FormField;
