import cors from "cors";
import express, { Application } from "express";
import * as http from "http";
import { debugRequest } from "./utils/debugRequest";
import { APPLICATION_CONFIG } from "./configs";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { BasicRoute } from "./routes/basic.routes";
import { DatabaseRoutes } from "./routes/database.routes";
import { NotValidRoutes } from "./routes/notValid.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { AuthManager } from "./managers/authManager";
import { DatabaseManager } from "./managers/databaseManager";
import { Logger, getLogger } from "log4js";

export class MainApp {

    private databaseManager!: DatabaseManager;
    private authManager!: AuthManager;
    private application!: Application;
    private server!: http.Server;
    private config!: typeof APPLICATION_CONFIG;
    private routes!: Array<CommonRoutesConfig>;
    private logger!: Logger;

    constructor() {

        this.init();
    }

    private init(): void {

        this.initLogger();
        this.initApplcationConfig();
        this.initApplicationAndServer();
        this.initBasicDebug();
        this.initRoutes();
        this.initInstacesOfManagers();
    
        this.startSever();
    }

    private initLogger(): void {

        this.logger = getLogger();
    }

    private initInstacesOfManagers(): void {

        this.databaseManager = DatabaseManager.getInstance();
        this.authManager = AuthManager.getInstance();
    }

    private initApplicationAndServer(): void {

        this.application = express();
        this.application.use(cors());
        this.application.use(express.json());

        this.server = http.createServer(this.application);
    }

    private initApplcationConfig(): void {

        this.config = APPLICATION_CONFIG;
    }

    private initRoutes(): void {

        const application = this.application;

        this.routes = [] as Array<CommonRoutesConfig>;

        this.routes.push(new BasicRoute(application));
        this.routes.push(new DatabaseRoutes(application));
        this.routes.push(new AuthRoutes(application));
        this.routes.push(new NotValidRoutes(application));
    }

    private initBasicDebug(): void {
        if (APPLICATION_CONFIG.DEBUG_REQUEST === true) {
            debugRequest(this.application);
        }
    }

    private startSever(): void {

        const port = this.config.PORT;

        const runningMessage = `Server running at http://localhost:${port}`;

        this.server.listen(port, () => {
            this.routes.forEach((route) => {
                this.logger.info(
                    `Routes configured for ${route.getVersion()} - ${route.getName()}`
                );
            });

            this.logger.info(runningMessage);
        });
    }
}