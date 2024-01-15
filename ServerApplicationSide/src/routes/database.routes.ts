import { getAllDataController } from "../controllers/databaseRouter.controllers";
import express, { Application } from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import { verifyUserMiddleware } from "../middlewares/auth.middleware";

export class DatabaseRoutes extends CommonRoutesConfig {

  constructor(app: Application) {
    super(app, "DatabaseRouter", "0.0.1");
  }

  configureRoute(): Application {

    const databaseRouter = express.Router();

    databaseRouter.post("/allInformation", getAllDataController);
    // databaseRouter.get("/onlyPositions", getOnlyPositionsController);
    // databaseRouter.get("/pointsByUser", getDataByUserController);

    this.app.use('/database', databaseRouter);

    return this.getApp();
  }
}