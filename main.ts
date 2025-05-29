import { HelloController } from "./src/controllers/hello.controller.ts";
import { Gallimimus } from "./gallimimus/app.ts";
import { ByeController } from "./src/controllers/bye.controller.ts";

new Gallimimus({
  services: [],
  controllers: [HelloController, ByeController],
}).listen(9000);
