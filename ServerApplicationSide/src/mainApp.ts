import cors from "cors";
import express, { Application } from "express";
import * as http from "http";
import { debugRequest } from "./utils/debugRequest";
import initFireBaseApp from "./database/firebase";
import { APPLICATION_CONFIG } from "./configs";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { BasicRoute } from "./routes/basic.routes";
import { DatabaseRoutes } from "./routes/database.routes";
import { NotValidRoutes } from "./routes/notValid.routes";
import { AuthRoutes } from "./routes/auth.routes";
import { AuthManager } from "./managers/authManager";
import { DatabaseManager } from "./managers/databaseManager";

export class MainApp {

    private databaseManager!: DatabaseManager;
    private authManager!: AuthManager;
    private application!: Application;
    private server!: http.Server;
    private config!: typeof APPLICATION_CONFIG;
    private routes!: Array<CommonRoutesConfig>;

    constructor() {

        this.init();
    }

    private init(): void {

        this.initFireBase();
        this.initApplcationConfig();
        this.initApplicationAndServer();
        this.initBasicDebug();
        this.initRoutes();
        this.initInstacesOfManagers();

        this.startSever();
    }

    private initInstacesOfManagers(): void {

        this.databaseManager = DatabaseManager.getInstance();
        this.authManager = AuthManager.getInstance();
    }

    private initFireBase(): void {

        initFireBaseApp();
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
                console.log(
                    `Routes configured for ${route.getVersion()} - ${route.getName()}`
                );
            });

            console.log(runningMessage);
        });
    }
}