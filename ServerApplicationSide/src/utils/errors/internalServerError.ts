import type { Response } from "express";
import { ERROR_CODES } from "./errorCodes";
import { CommonRoutesConfig } from "../../common/common.routes.config";

export function internalServerErrorResponse(res: Response) {
    return res.status(500).json({
        status: CommonRoutesConfig.statusMessage.FAILED,
        code: ERROR_CODES.INTERNAL_SERVER_ERROR,
        message: "Internal Server Error, please try again later"
    })
}