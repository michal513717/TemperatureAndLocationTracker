import type { Request, Response } from "express";

export const helloController = async (
    req: Request,
    res: Response
) => {
    return res.status(200).json({ hello: 'World!' });
}