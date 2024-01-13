import { Manager } from "../common/common.manager.config";
import { UsersDatabaseType } from "../models/database.models";
import { DatabaseManager } from "./databaseManager";

//TODO implement
export class AuthManager {

    protected static instance: AuthManager;
    private databaseManager!: DatabaseManager;
    static databaseManager: DatabaseManager;

    constructor(){

        this.init();
    }

    private init(): void {

        this.setupManagers();
    }

    private setupManagers(): void {

        this.databaseManager = DatabaseManager.getInstance();
    }

    public static getInstance(): AuthManager {
        if (!AuthManager.instance) {
            AuthManager.instance = new AuthManager();
        }

        return AuthManager.instance;
    };

    public async getUser(userName: string) {
        const user = await this.databaseManager.getRecordById<UsersDatabaseType>("USERS_COLLECTION", "userName", userName);

        if (user === null) {
            throw new Error("User Not Found");
        }

        return user;
    }
};