import { getFirestore } from "firebase-admin/firestore";
import { Manager } from "../common/common.manager.config";
import { Collections, RecordValue } from "../models/database.models";
import { FirebaseHelper } from "../utils/firebase/FirebaseHelper";
import initFireBaseApp from "../database/firebase";
import { getLogger } from "log4js";

const logger = getLogger("Database Manager");

class DatabaseManager {

    private db!: FirebaseFirestore.Firestore;
    private collections!: Collections;

    constructor() {

        this.initFirebaseApp();
        this.init();
    };

    private initFirebaseApp(): void {

        initFireBaseApp();
    }

    private async init(): Promise<void> {

        this.db = getFirestore();
        this.db.settings({
            ignoreUndefinedProperties: true,
        });

        this.collections = {    
            TEMPERATURE_AND_LOCATION_COLLECTION: this.db.collection("TemperatureAndLocationTrackerCollection"),  
            USERS_COLLECTION: this.db.collection("UsersCollection")
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
            logger.error(error);
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
            logger.error(error);
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
            logger.error(error);
            return null;
        }
    }

    public async getAllDataFromCollection(
        collectionName: keyof Collections,
    ) {
        try {
            
            const data = await this.collections[collectionName].get();

            const parsedData = data.docs.map((item) =>
                Object.assign({ id: item.id }, item.data())
            );

            return parsedData;
        } catch (error) {
            logger.error(error);
            return null;
        }
    }
}

var instance = new DatabaseManager();

export default instance;