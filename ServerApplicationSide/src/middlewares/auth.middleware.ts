import type { NextFunction, Request, Response } from "express";

export const verifyArduinoClient = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    return res.status(200).json({ hello: 'World!' });


    next();
};