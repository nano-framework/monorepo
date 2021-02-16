import { METHOD_ROUTE_METADATA_STORAGE } from '../constants';

export type RouteDecorator = (path?: string, middlewares?: Function[]) => MethodDecorator;

export type RequestMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'all';

export interface MethodRouteMetadata {
  [s: string]: {
    path: string;
    method: RequestMethod;
    middlewares: Function[];
  };
}

function RouteDecoratorFactory(method: RequestMethod): RouteDecorator {
  return (path: string = '/', middlewares: Function[] = []): MethodDecorator => (
    target: Record<string, any>,
    propertyKey: string,
    descriptor?: TypedPropertyDescriptor<any>,
  ) => {
    const methodMetadata: MethodRouteMetadata | undefined = Reflect.getMetadata(
      METHOD_ROUTE_METADATA_STORAGE,
      target.constructor,
    );
    Reflect.defineMetadata(
      METHOD_ROUTE_METADATA_STORAGE,
      { ...methodMetadata, [propertyKey]: { path, method, middlewares } },
      target.constructor,
    );
  };
}

export const Get = RouteDecoratorFactory('get');
export const Post = RouteDecoratorFactory('post');
export const Put = RouteDecoratorFactory('put');
export const Patch = RouteDecoratorFactory('patch');
export const Delete = RouteDecoratorFactory('delete');
export const All = RouteDecoratorFactory('all');
