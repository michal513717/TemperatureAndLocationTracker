
import axios from "axios";
import type { AxiosRequestConfig, Method } from "axios";
import { ArduinoServerError } from "../utils/errors/errors";

export class FetchManager {


    public static async fetchDataFromArduino(url: string){

        const req = await axios.get(url);

        if(req.status === 200) {
            return req.data;
        }

        throw new ArduinoServerError();
    }
}