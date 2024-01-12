import { Manager } from "../common/common.manager.config";
import { UsersDatabaseType } from "../models/database.models";
import { databaseManager } from "./databaseManager";

//TODO implement
export class AuthManager extends Manager {


  public static async getUser(userName: string) {
    const user = await databaseManager.getRecordById<UsersDatabaseType>("USERS_COLLECTION", "userName", userName);

    if (user === null) {
      throw new Error("User Not Found");
    }

    return user;
  }
};