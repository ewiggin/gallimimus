import { Controller, Get } from "../../gallimimus/decorators/index.ts";

@Controller("/bye")
export class ByeController {
  @Get()
  async sayGoodBye(): Promise<string> {
    return "bye bye";
  }
}
