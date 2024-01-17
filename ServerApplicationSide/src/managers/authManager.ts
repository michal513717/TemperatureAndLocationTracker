import { Timestamp } from "firebase-admin/firestore";
import { Manager } from "../common/common.manager.config";
import { LoginCredentials, UserCredentials } from "../models/auth.models";
import { UsersDatabaseType } from "../models/database.models";
import { UserExistError, UserNotFound, WrongPasswordError } from "../utils/errors/errors";
import { AuthHelper } from "../utils/helpers/AuthHelper";
import databaseManager from "./databaseManager";
import { FirebaseHelper } from "../utils/firebase/FirebaseHelper";
import { getLogger } from "log4js";

const logger = getLogger("Auth Manager");

export class AuthManager {

    protected static instance: AuthManager;

    public static async getUser(userName: string) {
        const user = await databaseManager.getRecordById<UsersDatabaseType>("USERS_COLLECTION", "userName", userName);

        if (user === null) {
            logger.warn("User not found");
            throw new UserNotFound();
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
            logger.warn("User already exist");
            throw new UserExistError();
        }

        const payload = {
            userName: userName,
            password: password,
            accountType: "USER",
            createdAt: await FirebaseHelper.getServerTimeStamp()
        }

        databaseManager.addRecord("USERS_COLLECTION", payload);
    }

    public static async login({ userName, password }: LoginCredentials): Promise<{ token: string }> {

        const user = await AuthManager.getUser(userName);

        if (user.password !== password) {
            logger.warn("Wrong Password");
            throw new WrongPasswordError();
        }

        const token = AuthHelper.generateToken(user);

        return token;
    }
};