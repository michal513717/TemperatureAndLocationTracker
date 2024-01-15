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
import { ArduinoManager } from "../managers/arudinoManager";
import { AuthRequest } from "../models/requests.models";

const logger = getLogger();

export const measurementController = async (
    req: AuthRequest,
    res: Response
) => {
    try {
        const data = await FetchManager.fetchDataFromArduino(APPLICATION_CONFIG.ARDUINO_SERVER_ADDRESS);

        await measurementSchema.parseAsync(data);

        data.author = req.user!.userName;

        const record = await ArduinoManager.createObjectToSave(data);
        console.log(record)
        await databaseManager.addRecord("TEMPERATURE_AND_LOCATION_COLLECTION", record);

        return res.status(200).json({
            status: CommonRoutesConfig.statusMessage.SUCCESS,
            message: "Point successfully saved",
            result: { newPoint: data }
        });
    } catch (error) {

        if (error instanceof ZodError) {
            logger.error("Validation is wrong");
            return validationErrorResponse(res, error);
        }

        logger.error("Arduino server is offline or Arduino server error");
        return internalServerErrorResponse(res);
    }
};