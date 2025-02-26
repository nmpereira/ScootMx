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

export interface MessageDocumentDB {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $updatedAt: string;
  messagebody: string;
  timeSent: string;
  userFrom: UserDocumentDB;
  userTo: UserDocumentDB;
}

export interface UserDocumentDB {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $updatedAt: string;
  accountId: string;
  avatar: string;
  email: string;
  hasChatsWith: string[];
  username: string;
}

export interface VehicleDocumentDB {
  $collectionId: string;
  $createdAt: string;
  $databaseId: string;
  $id: string;
  $permissions: string[];
  $updatedAt: string;
  city: City;
  currency: Currency;
  enginePower: number;
  images: string[];
  pickupLocation: string;
  price: number;
  seller: UserDocumentDB;
  title: string;
  vehicleType: VehicleType;
}
