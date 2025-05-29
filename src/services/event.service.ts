import { Injectable } from "../../gallimimus/decorators/index.ts";

@Injectable()
export class EventService {
  private events: Map<string, ReadableStreamDefaultController<unknown>> =
    new Map();

  constructor() {}

  add(controller: ReadableStreamDefaultController<unknown>): string {
    const id = crypto.randomUUID();
    this.events.set(id, controller);

    return id;
  }

  send(id: string, message: string) {
    const controller = this.events.get(id);
    if (!controller) {
      console.warn("event controller not found");
      return;
    }

    controller.enqueue(new TextEncoder().encode(message));
  }
}
