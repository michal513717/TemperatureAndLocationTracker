import { ErrorWithCode } from "../../common/common.error.config";

export class InvalidTokenError extends ErrorWithCode {
    constructor(){
        super("Invalid Token", 403, "INVALID_TOKEN");
    }
}

export class TokenExpiredError extends ErrorWithCode {
    constructor(){
        super("Token Expired", 403, "TOKEN_EXPIRED");
    }
}

export class WrongPasswordError extends ErrorWithCode {
    constructor(){
        super("Wrong password", 403, "WRONG_PASSWORD");
    }
}

export class UserExistError extends ErrorWithCode {
    constructor(){
        super("User name already exist", 403, "USER_EXIST");
    }
}