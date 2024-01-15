import type { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../models/requests.models";
import log4js from "log4js";
import { FirebaseHelper } from "../utils/firebase/FirebaseHelper";
import { AuthHelper } from "../utils/helpers/AuthHelper";
import { AuthManager } from "../managers/authManager";
import { ErrorWithCode } from "../common/common.error.config";
import { internalServerErrorResponse } from "../utils/errors/internalServerError";
import { InvalidTokenError } from "../utils/errors/errors";

const logger = log4js.getLogger();

export const verifyUserMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if(!token) {
            logger.warn("Invalid Token Error");
            throw new InvalidTokenError();
        }

        const decodeToken = AuthHelper.getDataFromToken(token);
        const user = await AuthManager.getUser(decodeToken.userName);

        if(user.accountType !== decodeToken.accountType){
            logger.warn("Invalid Token Error");
            throw new InvalidTokenError();
        }

        req.user = decodeToken;
        next();
    } catch (error) {
        if(error instanceof ErrorWithCode){
            return res.status(error.status).json(error.toJSON());
        }

        logger.fatal("Internal Server Error at middleware!");

        return internalServerErrorResponse(res);
    }
}