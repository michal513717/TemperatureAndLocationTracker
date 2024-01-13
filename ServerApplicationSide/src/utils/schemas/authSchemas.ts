import { z } from "zod"


export const loginUserSchema = z.object({
    userName: z.string(),
    password: z.string()
});

export const registerUserSchema = z.object({
    userName: z.string().min(5),
    password: z.string().min(8)
});