import { Server } from "@hapi/hapi";
import createShiftRoutes from "./shifts";
import createPublishRoutes from "./publish";

export default function (server: Server, basePath: string) {
  // shifts route
  createShiftRoutes(server, basePath + "/shifts");
  // publish route
  createPublishRoutes(server, basePath + "/publish");
}
