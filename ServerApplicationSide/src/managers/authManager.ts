import { Timestamp } from "firebase-admin/firestore";
import { Manager } from "../common/common.manager.config";
import { LoginCredentials, UserCredentials } from "../models/auth.models";
import { UsersDatabaseType } from "../models/database.models";
import { UserExistError, WrongPasswordError } from "../utils/errors/errors";
import { AuthHelper } from "../utils/helpers/AuthHelper";
import databaseManager from "./databaseManager";
import { FirebaseHelper } from "../utils/firebase/FirebaseHelper";

export class AuthManager {

    protected static instance: AuthManager;

    public static async getUser(userName: string) {
        const user = await databaseManager.getRecordById<UsersDatabaseType>("USERS_COLLECTION", "userName", userName);

        if (user === null) {
            throw new Error("User Not Found");
        }

        return user;
    }

    public static async isUserExist(userName: string): Promise<boolean> {
        try {
            await AuthManager.getUser(userName);
            return true;
        } catch (error) {
            return false;
        }
    }

    public static async addUser({ userName, password }: UserCredentials): Promise<void> {

        if (await AuthManager.isUserExist(userName)) {
            throw new UserExistError();
        }

        const payload = {
            userName: userName,
            password: password,
            accountType: "USER",
            createdAt: FirebaseHelper.getServerTimeStamp()
        }

        databaseManager.addRecord("USERS_COLLECTION", payload);
    }

    public static async login({ userName, password }: LoginCredentials): Promise<{ token: string }> {

        const user = await AuthManager.getUser(userName);

        if (user.password !== password) {
            throw new WrongPasswordError();
        }

        const token = AuthHelper.generateToken(user);

        return token;
    }
};