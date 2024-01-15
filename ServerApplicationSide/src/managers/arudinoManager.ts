import { FirebaseHelper } from "../utils/firebase/FirebaseHelper";


export class ArduinoManager {

  public static async createObjectToSave(data: Record<string, any>) {

    const timeStamp = await FirebaseHelper.getServerTimeStamp();

    return {
      timeStamp,
      ...data
    }
  }
}