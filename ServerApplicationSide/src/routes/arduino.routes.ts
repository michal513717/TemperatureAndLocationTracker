import type { Application } from "express";
import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { measurementController } from "../controllers/arduinoRouter.controllers";

export class ArduinoRoute extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, "Arduino", "0.0.1")
    }

    configureRoute(): Application {
        
        const arduinoRouter = express.Router();

        arduinoRouter.get('/measurement', measurementController);

        this.app.use('/arduino', arduinoRouter);

        return this.getApp();
    }
}