import { View, Text, SafeAreaView, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/components/CustomButton";
import FormField from "@/components/FormField";
import { createListing } from "@/lib/appwrite";
import AlertMessage from "@/components/Alert";
import PhotoUpload from "@/components/PhotoUpload";
import DropDownSelector, {
  Currency,
  City,
  VehicleType,
  SelectOptionTypes,
  DropDownSelectorType,
} from "@/components/DropDownSelector";
import { router } from "expo-router";

export interface FormFieldProps {
  title: string;
  price: number | undefined;
  currency: Currency;
  city: City | undefined;
  pickupLocation: string;
  enginePower: number;
  vehicleType: VehicleType;
}

const CreateListing = () => {
  const [formFields, setFormFields] = useState<FormFieldProps>({
    title: "",
    price: undefined,
    currency: Currency.MXN,
    city: undefined,
    pickupLocation: "",
    enginePower: 0,
    vehicleType: VehicleType.SCOOTER,
  });
  const [photoIds, setPhotoIds] = useState<Record<string, string>>({}); // { fileId: fileUrl }
  const submitListing = async () => {
    if (!isSubmitEnabled) {
      throw new Error("Cannot submit listing with invalid data");
    }

    try {
      const newListing = await createListing({
        title: formFields.title,
        price: formFields.price!,
        images: Object.keys(photoIds),
        currency: formFields.currency,
        city: formFields.city!,
        pickupLocation: formFields.pickupLocation,
        enginePower: formFields.enginePower,
        vehicleType: formFields.vehicleType,
      });

      router.navigate(`/listing/${newListing.$id}`);

      AlertMessage({ message: "Listing created successfully" });
    } catch (error) {
      console.error(error);
      AlertMessage({ error: error as Error });
    }
  };

  const isSubmitEnabled =
    formFields.title.length > 0 &&
    formFields.price !== undefined &&
    formFields.city !== undefined &&
    formFields.enginePower !== undefined;

  useEffect(() => {
    console.log("[formFields] ==>", `${JSON.stringify(formFields)}`);
  }, [formFields]);

  return (
    <SafeAreaView className="bg-background-900 h-full ">
      <View className="flex items-center h-full p-4">
        {/* Input Fields */}
        <ScrollView className="h-full ">
          <View className="mt-7 w-full">
            {/* Header */}
            <Text className="text-2xl font-semibold text-tertiary-500 my-7 text-center">
              Create Listing
            </Text>
            <FormField
              title={"Title"}
              placeholder={"Enter title for vehicle"}
              value={formFields.title}
              handleChangeText={(text: string) =>
                setFormFields({ ...formFields, title: text })
              }
            />
          </View>

          <View className="flex flex-row mt-7 gap-2">
            <View className="w-4/6">
              <FormField
                title={"Price"}
                placeholder={"Enter price for vehicle"}
                value={
                  formFields.price !== undefined
                    ? formFields.price.toString()
                    : ""
                }
                handleChangeText={(text: string) => {
                  const numericValue = Number(text);
                  setFormFields({
                    ...formFields,
                    price: isNaN(numericValue) ? undefined : numericValue,
                  });
                }}
              />
            </View>

            <View className="w-1/4">
              <Text className="text-white mb-4">Currency</Text>
              <DropDownSelector
                dropDownSelectorType={DropDownSelectorType.CURRENCY}
                selectedOption={formFields.currency}
                setSelectedOption={(option: SelectOptionTypes) => {
                  if (Object.values(Currency).includes(option as Currency)) {
                    setFormFields({
                      ...formFields,
                      currency: option as Currency,
                    });
                  }
                }}
              />
            </View>
          </View>

          <View className="mt-7 w-full">
            <Text className="text-white mb-4">City</Text>
            <DropDownSelector
              dropDownSelectorType={DropDownSelectorType.CITY}
              selectedOption={formFields.city as City}
              setSelectedOption={(option: SelectOptionTypes) => {
                if (Object.keys(City).includes(option)) {
                  setFormFields({ ...formFields, city: option as City });
                }
              }}
            />
          </View>

          <View className="mt-7 w-full">
            <FormField
              title={"Pickup Location / Address"}
              placeholder={"Enter pickup location / address for vehicle"}
              value={formFields.pickupLocation}
              handleChangeText={(text: string) =>
                setFormFields({ ...formFields, pickupLocation: text })
              }
            />
          </View>

          <View className="mt-7 flex flex-row gap-4 w-full">
            <View className="flex flex-row items-center w-1/2">
              <FormField
                title={"Engine Power (CC)"}
                placeholder={"Enter engine power for vehicle"}
                value={formFields.enginePower.toString()}
                handleChangeText={(text: string) => {
                  const numericValue = Number(text);
                  setFormFields({
                    ...formFields,
                    enginePower: isNaN(numericValue) ? 0 : numericValue,
                  });
                }}
                otherStyles={"w-3/5"}
                keyboardType={"numeric"}
              />
              <Text className="text-white mt-6 w-1/5 text-center font-semibold text-2xl">
                CC
              </Text>
            </View>

            <View className="w-2/5">
              <Text className="text-white mb-4">Vehicle Type</Text>
              <DropDownSelector
                dropDownSelectorType={DropDownSelectorType.VEHICLE_TYPE}
                selectedOption={formFields.vehicleType as VehicleType}
                setSelectedOption={(option: SelectOptionTypes) => {
                  if (
                    Object.values(VehicleType).includes(option as VehicleType)
                  ) {
                    setFormFields({
                      ...formFields,
                      vehicleType: option as VehicleType,
                    });
                  }
                }}
              />
            </View>
          </View>
        </ScrollView>

        {/* Photo Grid and Upload Button */}
        <View className="my-7">
          <PhotoUpload photoIds={photoIds} setPhotoIds={setPhotoIds} />
        </View>

        {/* Submit */}
        <CustomButton
          title={"Submit"}
          handlePress={submitListing}
          containerStyles={"mt-7 bg-tertiary-500 w-64"}
          textStyles={"text-white font-semibold"}
          isLoading={false}
          isEnabled={isSubmitEnabled}
        />
      </View>
    </SafeAreaView>
  );
};

export default CreateListing;
