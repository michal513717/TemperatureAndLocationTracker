import type { Request, Response } from "express";
import databaseManager from "./../managers/databaseManager"
import { internalServerErrorResponse } from "../utils/errors/internalServerError";
import { CommonRoutesConfig } from "../common/common.routes.config";

export const getAllDataController = async(
  req: Request,
  res: Response
) => {
  try {

    const data = await databaseManager.getAllDataFromCollection("TEMPERATURE_AND_LOCATION_COLLECTION");

    return res.status(200).json({
      status: CommonRoutesConfig.statusMessage.SUCCESS,
      message: "Readed success",
      result: { data }
    })
  } catch (error) {
    internalServerErrorResponse(res);
  }
}