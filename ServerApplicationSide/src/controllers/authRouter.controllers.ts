import type { Request, Response } from "express"
import { AuthManager } from "../managers/authManager"
import { loginUserSchema, registerUserSchema } from "../utils/schemas/authSchemas";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { getLogger } from "log4js";
import { z } from "zod";
import { validationErrorResponse } from "../utils/errors/validationErrorResponse";
import { ErrorWithCode } from "../common/common.error.config";
import { internalServerErrorResponse } from "../utils/errors/internalServerError";

const logger = getLogger();

export const loginController = async (req: Request, res: Response) => {
  try {
    const credentials = await loginUserSchema.parseAsync(req.body);

    const result = await AuthManager.login(credentials);

    return res.status(200).json({
        status: CommonRoutesConfig.statusMessage.SUCCESS,
        message: "Login success",
        result: { accessToken: result.token }
    })
  } catch (error) {
    logger.warn(error);
    
    if(error instanceof z.ZodError){
        return validationErrorResponse(res, error);
    }

    if(error instanceof ErrorWithCode){
        return res.status(error.status).json(error.toJSON());
    }

    return internalServerErrorResponse(res);
  }
}

export const registerController = async (req: Request, res: Response) => {
  try {

    const credentials = await registerUserSchema.parseAsync(req.body);

    await AuthManager.addUser(credentials);

    return res.status(200).json({
        status: CommonRoutesConfig.statusMessage.SUCCESS,
        message: "Register success"
    });
  } catch (error) {
    logger.warn(error);

    if(error instanceof z.ZodError){
        return validationErrorResponse(res, error);
    }

    if(error instanceof ErrorWithCode){
        return res.status(error.status).json(error.toJSON());
    }

    return internalServerErrorResponse(res);
  }
}
