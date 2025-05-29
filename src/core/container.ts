import "npm:reflect-metadata@0.2.2";

export type ClassConstructor<T = any> = new (...args: any[]) => T;

export class Container {
  private static providers = new Map<ClassConstructor, any>();

  static register<T>(token: ClassConstructor<T>, implementation?: T) {
    this.providers.set(token, implementation ?? token);
  }

  static resolve<T>(token: ClassConstructor<T>): T {
    const target = this.providers.get(token);
    if (!target) {
      throw new Error(`No provider found for ${token.name}`);
    }

    // Si ya es una instancia, la devolvemos directamente
    if (typeof target !== "function") {
      return target;
    }

    const paramTypes: ClassConstructor[] =
      Reflect.getMetadata("design:paramtypes", target) || [];
    const dependencies = paramTypes.map((dep) => this.resolve(dep));
    const instance = new target(...dependencies);
    this.providers.set(token, instance); // guardamos la instancia

    return instance;
  }
}
