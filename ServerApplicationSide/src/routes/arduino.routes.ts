import type { Application } from "express";
import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { measurementController } from "../controllers/arduinoRouter.controllers";
import { verifyUserMiddleware } from "../middlewares/auth.middleware";

export class ArduinoRoute extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, "Arduino", "0.0.1")
    }

    configureRoute(): Application {
        
        const arduinoRouter = express.Router();

        arduinoRouter.post('/measurement', verifyUserMiddleware,  measurementController);

        this.app.use('/arduino', arduinoRouter);

        return this.getApp();
    }
}