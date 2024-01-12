import cors from "cors";
import express from "express";
import * as http from "http";
import { APPLICATION_CONFIG } from "./src/configs";
import initFireBaseApp from "./src/database/firebase";
import { CommonRoutesConfig } from "./src/common/common.routes.config";
import { NotValidRoutes } from "./src/routes/notValid.routes";
import { BasicRoute } from "./src/routes/basic.routes";
import { debugRequest } from "./src/utils/debugRequest";
import { DatabaseRoutes } from "./src/routes/database.routes";
import { AuthRoutes } from "./src/routes/auth.routes";

const application = express();

const port = APPLICATION_CONFIG.PORT;

application.use(cors());
application.use(express.json());

const server = http.createServer(application);

const routes = [] as Array<CommonRoutesConfig>;

initFireBaseApp();

if (APPLICATION_CONFIG.DEBUG_REQUEST === true) {
  debugRequest(application);
}

routes.push(new BasicRoute(application));
routes.push(new DatabaseRoutes(application));
routes.push(new AuthRoutes(application));
routes.push(new NotValidRoutes(application));

const runningMessage = `Server running at http://localhost:${port}`;

server.listen(port, () => {
  routes.forEach((route) => {
    console.log(
      `Routes configured for ${route.getVersion()} - ${route.getName()}`
    );
  });

  console.log(runningMessage);
});