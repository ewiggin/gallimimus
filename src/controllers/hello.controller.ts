import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from "../../gallimimus/decorators/index.ts";
import { AuthService } from "../services/auth.service.ts";
import * as path from "https://deno.land/std@0.102.0/path/mod.ts";
import { User } from "../domain/person.ts";
import { EventService } from "../services/event.service.ts";

@Controller()
export class HelloController {
  constructor(private auth: AuthService, private sse: EventService) {
  }

  @Get("/hello")
  sayHello() {
    console.log("auth dep on method");
    return `Go to ${this.auth.getLoginUrl()}`;
  }

  @Get("/hello/:name")
  sayHelloWithName(@Param("name") name: string) {
    return { msg: "hello " + name };
  }

  @Post("/hello/:name")
  saveMyNameAndMyBody(
    @Param("name") name: string,
    @Body() userDto: User,
  ) {
    return "hello " + name + " you have " + userDto.age + " years old";
  }

  @Get("/html")
  showHTML() {
    const templatePath = path.resolve("src", "views", "template.html");
    const template = Deno.readFileSync(templatePath);
    return new Response(template.buffer);
  }

  @Get("/html-defer")
  hydrateHtml(
    { req, res }: { req: Request; res: (res: Response) => Promise<void> },
  ) {
    let timerId: number | undefined;

    const encoder = new TextEncoder();
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(
          encoder.encode("data: conexión establecida\r\n\r\n"),
        );

        timerId = setInterval(() => {
          const message = `data: ${new Date().toISOString()}\r\n\r\n`;
          controller.enqueue(encoder.encode(message));
        }, 1000);
      },
      cancel() {
        if (typeof timerId === "number") {
          clearInterval(timerId);
        }
      },
    });

    // TODO: Utilizar el EventService para registrar el evento

    const response = new Response(body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });

    return response;
  }
}
