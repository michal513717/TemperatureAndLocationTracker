import cors from "cors";
import express, { Application } from "express";
import * as http from "http";
import { debugRequest } from "./utils/debugRequest";
import { APPLICATION_CONFIG } from "./configs";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { BasicRoute } from "./routes/basic.routes";
import { DatabaseRoutes } from "./routes/database.routes";
import { ArduinoRoute } from "./routes/arduino.routes";
import { NotValidRoutes } from "./routes/notValid.routes";
import { AuthRoutes } from "./routes/auth.routes";
import * as log4js from "log4js";

export class MainApp {

    private application!: Application;
    private server!: http.Server;
    private config!: typeof APPLICATION_CONFIG;
    private routes!: Array<CommonRoutesConfig>;
    private logger!: any;

    constructor() {

        this.init();
    }

    private init(): void {

        this.initLogger();
        this.initApplcationConfig();
        this.initApplicationAndServer();
        this.initBasicDebug();
        this.initRoutes();
    
        this.startSever();
    }

    private initLogger(): void {

        log4js.configure({
            appenders: {
                out: { type: "stdout" },
                app: { type: "file", filename: "application.log" },
            },
            categories: {
                default: { appenders: ["out", "app"], level: "debug" },
            },
        });

        this.logger = log4js.getLogger("Main App");
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

        this.routes.push(new ArduinoRoute(application));
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