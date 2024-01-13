import type { Response } from "express";
import { z } from "zod";
import { CommonRoutesConfig } from "../../common/common.routes.config";
import { ERROR_CODES } from "./errorCodes";

export function validationErrorResponse(res: Response, error: z.ZodError) {
    return res.status(400).json({
        status: CommonRoutesConfig.statusMessage.FAILED,
        code: ERROR_CODES.VALIDAITON_ERROR,
        message: error.format()
    })
}