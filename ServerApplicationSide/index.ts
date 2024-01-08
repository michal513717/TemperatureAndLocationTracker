import cors from "cors";
import express from "express";
import * as http from "http";

import { CommonRoutesConfig } from "./src/common/common.routes.config";
import { NotValidRoutes } from "./src/routes/notValid.routes";

const app = express();

const port = 8080;

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const routes = [] as Array<CommonRoutesConfig>;

routes.push(new NotValidRoutes(app));

const runningMessage = `Server running at http://10.0.2.2:${port}`;

server.listen(port, () => {
  routes.forEach((route) => {
    console.log(
      `Routes configured for ${route.getVersion()} - ${route.getName()}`
    );
  });

  console.log(runningMessage);
});