import { Manager } from "../common/common.manager.config";
import { Collections, RecordValue } from "../models/database.models";
import { FirebaseHelper } from "../utils/firebase/FirebaseHelper";

class DatabaseManager extends Manager {
  //TODO implement class 

  protected static instance: DatabaseManager;
  private db!: FirebaseFirestore.Firestore;
  private collections!: Collections;

  public static COLLECTION_NAMES: Record<string, keyof Collections> = {
    TEMPERATURE_AND_LOCATION_COLLECTION: "TEMPERATURE_AND_LOCATION_COLLECTION",
    USERS_COLLECTION: "USERS_COLLECTION"
  };

  constructor() {

    super();

    this.init();
  };

  private async init(): Promise<void> {

    this.collections = {
      TEMPERATURE_AND_LOCATION_COLLECTION: await this.getCollection("TEMPERATURE_AND_LOCATION_COLLECTION"),
      USERS_COLLECTION: await this.getCollection("USERS_COLLECTION")
    };
  };

  public async getCollection(
    collectionName: keyof Collections
  ): Promise<FirebaseFirestore.CollectionReference> {
    return this.db.collection(collectionName);
  };

  public async getRecordsById<T extends object>(
    collectionName: keyof Collections,
    recordID: string,
    recordValue: RecordValue
  ): Promise<Array<T> | []> {
    try {
      const data = await this.collections[collectionName]
        .where(recordID, "==", recordValue)
        .withConverter(FirebaseHelper.converterAssignTypes<T>())
        .get();

      const parsedData = data.docs.map((item) =>
        Object.assign({ id: item.id }, item.data())
      );

      return parsedData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  public async addRecord(
    collectionName: keyof Collections,
    data: Record<string, any>
  ): Promise<void> {
    try {
      await this.collections[collectionName].add(data);
    } catch (error) {
      console.log(error);
    }
  };

  public async getRecordById<T extends object>(
    collectionName: keyof Collections,
    recordID: string,
    recordValue: RecordValue
  ): Promise<T | null> {
    try {
      const record = await this.collections[collectionName]
        .where(recordID, "==", recordValue)
        .limit(1)
        .withConverter(FirebaseHelper.converterAssignTypes<T>())
        .get();

      return record.docs[0] !== undefined ? record.docs[0].data() : null;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}

export const databaseManager = new DatabaseManager();