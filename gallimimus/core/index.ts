export interface IGlobalObject {
  actions: IAction[];
  params: any[];
  controllers: any[];
  services: { type: string; target: unknown }[];
}

export interface IAction {
  requestMethod: "GET" | "POST" | "OPTIONS" | "PATCH" | "PUT" | "DELETE";
  route: string;
  target: object;
  method: string;
}

const GLOBAL: IGlobalObject = {
  actions: [],
  params: [],
  controllers: [],
  services: [],
};

export function getMetadata() {
  return GLOBAL;
}
