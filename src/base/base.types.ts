import { Service } from "./base.service";

export type Constructor<T> = new (...args: any[]) => T
export type AbstractConstructor<T> = abstract new (...args: any[]) => T

export abstract class BaseResolver<T> {
  abstract readonly service: Service<T>
}