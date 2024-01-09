import { getAllDataController, getDataByUserController, getOnlyPositionsController } from "../controllers/databaseRouter.controllers";
import express, { Application } from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";

export class DatabaseRoutes extends CommonRoutesConfig {

  constructor(app: Application) {
    super(app, "DatabaseRouter", "0.0.1");
  }

  configureRoute(): Application {

    const databaseRouter = express.Router();

    databaseRouter.get("/allInformation", getAllDataController);
    databaseRouter.get("/onlyPositions", getOnlyPositionsController);
    databaseRouter.get("/pointsByUser", getDataByUserController);

    this.app.use('/database', databaseRouter);

    return this.getApp();
  }
}