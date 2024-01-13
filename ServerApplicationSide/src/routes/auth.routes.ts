import { Application } from "express";
import { CommonRoutesConfig } from "../common/common.routes.config";
import express from 'express';
import { loginController, registerController } from "../controllers/authRouter.controllers";

export class AuthRoutes extends CommonRoutesConfig {

  constructor(app: Application) {
    super(app, "AuthRoutes", "0.0.1");
  }

  configureRoute(): Application {

    const authRouter = express.Router();

    authRouter.post("/login", loginController);
    authRouter.post("/register", registerController);

    this.app.use("/auth", authRouter);

    return this.getApp();
  }
}