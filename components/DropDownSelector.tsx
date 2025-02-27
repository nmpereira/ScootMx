import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import React from "react";
import { View, Text } from "react-native";
import {
  SelectOptionTypes,
  DropDownSelectorType,
  Currency,
  City,
  VehicleType,
} from "@/types/dbTypes";

interface SelectOptionProps {
  // can be currency or city
  selectedOption: SelectOptionTypes;
  setSelectedOption: (option: SelectOptionTypes) => void;
  dropDownSelectorType: DropDownSelectorType;
  title: string;
}

const DropDownSelector = ({
  selectedOption,
  setSelectedOption,
  dropDownSelectorType,
  title,
}: SelectOptionProps) => {
  const onSelectOption = (option: SelectOptionTypes) => {
    setSelectedOption(option);
  };
  return (
    <View>
      <Text className="text-base text-gray-100 font-bold mb-2">{title}</Text>

      <Select
        onValueChange={(value) => onSelectOption(value as SelectOptionTypes)}
        selectedValue={selectedOption}
        className="border-tertiary-400 focus:border-none"
      >
        <SelectTrigger
          variant="outline"
          size="xl"
          className="border-tertiary-400 focus:border-tertiary-400"
        >
          <SelectInput placeholder="Select option" className="text-white" />
          <SelectIcon className="mr-3" as={ChevronDownIcon} />
        </SelectTrigger>
        <SelectPortal>
          <SelectBackdrop />
          <SelectContent className="border-tertiary-400">
            <SelectDragIndicatorWrapper>
              <SelectDragIndicator />
            </SelectDragIndicatorWrapper>

            {dropDownSelectorType === DropDownSelectorType.CURRENCY
              ? Object.values(Currency).map((option) => (
                  <SelectItem
                    key={option}
                    label={option}
                    value={option}
                    className="text-white"
                  />
                ))
              : dropDownSelectorType === DropDownSelectorType.CITY
              ? Object.entries(City).map(([key, value]) => (
                  <SelectItem
                    key={key}
                    label={value}
                    value={key}
                    className="text-white"
                  />
                ))
              : dropDownSelectorType === DropDownSelectorType.VEHICLE_TYPE
              ? Object.values(VehicleType).map((option) => (
                  <SelectItem
                    key={option}
                    label={option}
                    value={option}
                    className="text-white"
                  />
                ))
              : null}
          </SelectContent>
        </SelectPortal>
      </Select>
    </View>
  );
};

export default DropDownSelector;
