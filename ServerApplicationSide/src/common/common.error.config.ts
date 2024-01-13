import { CommonRoutesConfig } from "./common.routes.config";
import { ERROR_CODES } from "../utils/errors/errorCodes";

type ErrorCodes = typeof ERROR_CODES;
type ErrorCodesKeys = keyof ErrorCodes

export abstract class ErrorWithCode extends Error {
    constructor(message: string, public status: number, public code: ErrorCodesKeys){
        super(message);
    }

    public toJSON() {
        return {
            status: CommonRoutesConfig.statusMessage.FAILED,
            message: this.message,
            code: this.code
        }
    }
}