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

export enum Currency {
  MXN = "MXN",
  USD = "USD",
}

export enum City {
  TULUM = "Tulum",
  CANCUN = "Cancun",
  PLAYA_DEL_CARMEN = "Playa del Carmen",
}

export enum VehicleType {
  SCOOTER = "Scooter",
  ATV = "ATV",
  UTV = "UTV",
}

export enum DropDownSelectorType {
  CURRENCY = "CURRENCY",
  CITY = "CITY",
  VEHICLE_TYPE = "VEHICLE_TYPE",
}

export type SelectOptionTypes = Currency | City | VehicleType;

interface SelectOptionProps {
  // can be currency or city
  selectedOption: SelectOptionTypes;
  setSelectedOption: (option: SelectOptionTypes) => void;
  dropDownSelectorType: DropDownSelectorType;
}

const DropDownSelector = ({
  selectedOption,
  setSelectedOption,
  dropDownSelectorType,
}: SelectOptionProps) => {
  const onSelectOption = (option: SelectOptionTypes) => {
    setSelectedOption(option);
  };
  return (
    <Select
      onValueChange={(value) => onSelectOption(value as SelectOptionTypes)}
      selectedValue={selectedOption}
    >
      <SelectTrigger variant="outline" size="xl">
        <SelectInput placeholder="Select option" className="text-white" />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
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
  );
};

export default DropDownSelector;
