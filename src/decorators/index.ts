import { Container } from "../core/container.ts";
import { getMetadata } from "../core/index.ts";

/**
 * Decorator for marking a class as a controller.
 */
export function Controller(path = ""): ClassDecorator {
  return function (
    target: object,
    _propertyKey?: string,
    _descriptor?: PropertyDescriptor,
  ) {
    Container.register(target as any);

    getMetadata().controllers.push({
      type: "default",
      path: path,
      target: target,
    });
  };
}

/**
 * Decorator for marking a class as a service.
 */
export function Injectable(): ClassDecorator {
  return (target) => {
    Container.register(target as any);
  };
}

/**
 * Decorator for marking a method as a GET route.
 * @param url The URL path for the route.
 */
export const Get = (url = ""): MethodDecorator => {
  return (
    target: object,
    propertyKey: string | symbol,
    _descriptor: PropertyDescriptor,
  ) => {
    getMetadata().actions.push({
      requestMethod: "GET",
      route: url,
      target: target.constructor,
      method: String(propertyKey),
    });
  };
};

export const Post = function (url: string) {
  return function (
    target: object,
    propertyKey: string,
    _descriptor: PropertyDescriptor,
  ) {
    getMetadata().actions.push({
      requestMethod: "POST",
      route: url,
      target: target.constructor,
      method: propertyKey,
    });
  };
};

export const Delete = function (url: string) {
  return function (
    target: object,
    propertyKey: string,
    _descriptor: PropertyDescriptor,
  ) {
    getMetadata().actions.push({
      requestMethod: "DELETE",
      route: url,
      target: target.constructor,
      method: propertyKey,
    });
  };
};

export const Put = function (url: string) {
  return function (
    target: object,
    propertyKey: string,
    _descriptor: PropertyDescriptor,
  ) {
    getMetadata().actions.push({
      requestMethod: "PUT",
      route: url,
      target: target.constructor,
      method: propertyKey,
    });
  };
};

export const Param = function (name: string) {
  return function (target: object, propertyKey: string, paramIndex: number) {
    getMetadata().params.push({
      paramType: "param",
      name,
      method: propertyKey,
      paramIndex,
      target: target.constructor,
    });
  };
};

export const Body = function (clazz?: any) {
  return function (target: object, propertyKey: string, paramIndex: number) {
    getMetadata().params.push({
      paramType: "body",
      method: propertyKey,
      paramIndex,
      target: target.constructor,
      transformTo: clazz?.constructor, // TODO
    });
  };
};
