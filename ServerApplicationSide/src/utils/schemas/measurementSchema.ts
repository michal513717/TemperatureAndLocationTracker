import { z } from "zod";

export const measurementSchema = z.object({
    temperature: z.number(),
    humidity: z.number(),
    locatlization: z.object({
        latitude: z.number(),
        longitude: z.number()
    })
})