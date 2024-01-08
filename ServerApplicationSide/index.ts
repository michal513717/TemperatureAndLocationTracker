import cors from "cors";
import express from "express";
import * as http from "http";
import { APPLICAITON_CONFIG } from "./src/configs";

import { CommonRoutesConfig } from "./src/common/common.routes.config";
import { NotValidRoutes } from "./src/routes/notValid.routes";
import { BasicRoute } from "./src/routes/basic.routes";
import { debugRequest } from "./src/utils/debugRequest";

const application = express();

const port = 8080;

application.use(cors());
application.use(express.json());

const server = http.createServer(application);

const routes = [] as Array<CommonRoutesConfig>;

if(APPLICAITON_CONFIG.DEBUG_REQUEST === true){
    debugRequest(application);
}

routes.push(new BasicRoute(application));
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