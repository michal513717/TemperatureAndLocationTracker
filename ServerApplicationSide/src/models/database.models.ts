import type { Timestamp, GeoPoint } from "firebase-admin/firestore";

type Author = string;

type Temperature = number;

export type AccountType = "ROOT" | "USER";

export type Collections = {
  TEMPERATURE_AND_LOCATION_COLLECTION: FirebaseFirestore.CollectionReference;
  USERS_COLLECTION: FirebaseFirestore.CollectionReference;
};

export type TemperatureAndLocationRecord = {
  author: Author,
  createdAt: Timestamp;
  position: GeoPoint;
  temperature: Temperature;
};

export type RecordValue = string | boolean | Timestamp | number | GeoPoint;

export type UsersDatabaseType = {
  password: string;
  registerData: Timestamp;
  accountType: AccountType;
  userName: string;
};