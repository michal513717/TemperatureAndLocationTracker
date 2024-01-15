import type { Application } from "express";
import express from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { helloController } from "../controllers/basicRouter.controllers";
import { verifyUserMiddleware } from "../middlewares/auth.middleware";

export class BasicRoute extends CommonRoutesConfig {

    constructor(app: Application) {
        super(app, "Basic", "0.0.1")
    }

    configureRoute(): Application {
        
        const basicRouter = express.Router();

        basicRouter.post('/ping', verifyUserMiddleware, helloController);

        this.app.use('/basic', basicRouter);

        return this.getApp();
    }
}