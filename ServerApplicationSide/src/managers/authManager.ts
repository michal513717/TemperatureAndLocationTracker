import { Timestamp } from "firebase-admin/firestore";
import { Manager } from "../common/common.manager.config";
import { LoginCredentials, UserCredentials } from "../models/auth.models";
import { UsersDatabaseType } from "../models/database.models";
import { UserExistError, WrongPasswordError } from "../utils/errors/errors";
import { AuthHelper } from "../utils/helpers/AuthHelper";
import { DatabaseManager } from "./databaseManager";
import { FirebaseHelper } from "../utils/firebase/FirebaseHelper";

//TODO implement
export class AuthManager {

    protected static instance: AuthManager;
    private databaseManager!: DatabaseManager;
    static databaseManager: DatabaseManager;

    constructor() {

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

    public async isUserExist(userName: string): Promise<boolean> {
        try {
            await this.getUser(userName);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async addUser({ userName, password }: UserCredentials): Promise<void> {

        if (await this.isUserExist(userName)) {
            throw new UserExistError();
        }

        const payload = {
            userName: userName,
            password: password,
            accountType: "USER",
            createdAt: FirebaseHelper.getServerTimeStamp()
        }

        this.databaseManager.addRecord("USERS_COLLECTION", payload);
    }

    public async login({ userName, password }: LoginCredentials): Promise<{ token: string }> {

        const user = await this.getUser(userName);

        if (user.password !== password) {
            throw new WrongPasswordError();
        }

        const token = AuthHelper.generateToken(user);

        return token;
    }
};