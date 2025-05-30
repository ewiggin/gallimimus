import { Container } from "./core/container.ts";
import { getMetadata } from "./core/index.ts";

export class Gallimimus {
  private routes: any[] = [];

  constructor() {
    console.clear();
    console.log("".padEnd(80, "="));
    console.log(`Building server and register controllers and routes`);
    console.log("".padEnd(80, "="));
    this.registerControllers();
  }

  /**
   * @deprecated gallimimus skills is run not listen
   * @param port
   */
  listen(port = 8080) {
    this.run(port);
  }

  /**
   * Start the server and listen on the specified port.
   * @param port Default port is 8080
   */
  run(port = 8080) {
    try {
      console.log(`===================================================`);
      console.log(`Gallimimus server ready and listen port: ${port}`);
      Deno.serve({ port }, async (request) => {
        try {
          const reqMethod = request.method;
          const inRoute = request.url;

          let pattern: URLPattern | undefined;
          const action = this.routes.find((item) => {
            pattern = new URLPattern({ pathname: item.route });
            return pattern.test(inRoute) &&
              item.actionMetadata?.requestMethod === reqMethod;
          });

          if (!action || !pattern) {
            // Not found!
            return new Response(`Page not found`, { status: 404 });
          } else {
            // Get the path prams
            const params: any[] = this.getUrlParams(
              pattern.exec(inRoute),
              action,
            );

            // Adds body JSON from request
            if (this.actionHasBodyPram(action)) {
              const data = await request.json();
              params.push(
                this.actionHasBodyTransform(action)
                  ? this.transformBody(action, data)
                  : data,
              );
            }

            if (!params.length) {
              params.push({ req: request, res: new Response() });
            }

            try {
              const ctrlResponse = await this.execControllerAction(
                action,
                params,
              );
              const response = ctrlResponse instanceof Response
                ? ctrlResponse
                : new Response(this.transformResultType(ctrlResponse));

              response.headers.append("status", "200");

              return response;
            } catch (error) {
              console.error(error);
              return new Response(`Internal server error # ${error}`, {
                status: 500,
              });
            }
          }
        } catch (error) {
          console.error("errro", error);
          return new Response(`Internal server error # ${error}`, {
            status: 500,
          });
        }
      });
    } catch (err) {
      console.error("Panic!", err);
    }
  }

  private transformResultType(result: any) {
    if (typeof result === "string") {
      return result;
    }

    return JSON.stringify(result);
  }

  private execControllerAction(action: any, params: any[]): any {
    const controller = action.actionMetadata?.target;
    // TODO: esto deberia estar instanciado previament
    const controllerInstance = Container.resolve(controller) as any;
    return controllerInstance[action.action].apply(controllerInstance, params);
  }

  private getUrlParams(
    pattern: URLPatternResult | null,
    action: any,
  ): string[] {
    if (!pattern) {
      return [];
    }

    const urlPrams: Record<string, string | undefined> = pattern.pathname
      ?.groups;
    return action.params
      .filter((p: any) => urlPrams[p.name])
      .map((i: any) => urlPrams[i.name]);
  }

  private actionHasBodyPram(action: any): boolean {
    return action.params.find((param: { paramType: string }) =>
      param.paramType === "body"
    ) !== undefined;
  }

  private actionHasBodyTransform(action: any): boolean {
    return action.params.find(
      (param: { paramType: string; transformTo: any }) => {
        return param.paramType === "body" && param.transformTo;
      },
    );
  }

  private transformBody(action: any, data: any): any {
    const param = action.params.find(
      (param: { paramType: string; transformTo: any }) => {
        return param.paramType === "body" && param.transformTo;
      },
    );

    return Object.assign({}, param.transformTo.apply(data));
  }

  private registerControllers() {
    if (!getMetadata().controllers?.length) {
      console.log("No controllers found".padEnd(80));
    }
    // register controllers
    getMetadata().controllers.forEach((controller: any) => {
      const actions = getMetadata().actions.filter((action: any) =>
        action.target === controller.target
      );
      const params = getMetadata().params.filter((param: any) =>
        param.target === controller.target
      );

      controller.actions = actions;

      console.log("");
      console.debug(
        `☉ "${
          controller.target.name ||
          controller.target.constructor.name
        }" controller has been registered`,
      );

      actions.forEach((action: any) => {
        action.controller = controller;

        let route = controller.path + (action.route || "");
        if (route.length === 0) {
          route = "/";
        }

        const metaRoute = {
          baseRoute: controller.path,
          route,
          actionObject: action.object,
          controllerObject: controller.target,
          actionMetadata: action,
          action: action.method,
          method: action.requestMethod,
          params: params.filter((param: any) => param.method === action.method),
        };

        console.debug(
          `    ✔ "${metaRoute.method} ${metaRoute.route}" has been registered`,
        );
        this.routes.push(metaRoute);
      });
    });
  }
}
