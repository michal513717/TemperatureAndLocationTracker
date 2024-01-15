import type { Request, Response } from "express";
import { internalServerErrorResponse } from "../utils/errors/internalServerError";
import { getLogger } from "log4js";
import { FetchManager } from "../managers/fetchManager";
import { APPLICATION_CONFIG } from "../configs";
import { measurementSchema } from "../utils/schemas/measurementSchema";
import { ZodError } from "zod";
import { validationErrorResponse } from "../utils/errors/validationErrorResponse";
import databaseManager from "../managers/databaseManager";
import { CommonRoutesConfig } from "../common/common.routes.config";

const logger = getLogger();

export const measurementController = async (
    req: Request,
    res: Response
) => {
    try {
     
        const data = await FetchManager.fetchDataFromArduino(APPLICATION_CONFIG.ARDUINO_SERVER_ADDRESS);
        
        measurementSchema.parse(data);

        await databaseManager.addRecord("TEMPERATURE_AND_LOCATION_COLLECTION", data);

        return res.status(200).json({
            status: CommonRoutesConfig.statusMessage.SUCCESS,
            message: "Point successfully saved",
            result: { newPoint: data }
        });
    } catch (error) {

        if(error instanceof ZodError){
            logger.error("Validation is wrong");
            return validationErrorResponse(res, error);
        }

        logger.error("Arduino server is offline or Arduino server error");
        return internalServerErrorResponse(res);
    }
};