import { Image, View, Text } from "react-native";

const SortButton = () => {
  return (
    <View className="flex bg-tertiary-400 p-2 rounded-xl w-36">
      <Text className="font-pmedium text-white text-md text-center">Sort (coming soon)</Text>
    </View>
  );
};

const FilterButton = () => {
  return (
    <View className="flex bg-tertiary-400 p-2 rounded-xl w-36">
      <Text className="font-pmedium text-white text-md text-center">
        Filter (coming soon)
      </Text>
    </View>
  );
};

const SortAndFilter = () => {
  return (
    <View className="flex flex-row gap-2">
      <SortButton />
      <FilterButton />
    </View>
  );
};

export default SortAndFilter;
