import { CONTROLLER_ROUTE_METADATA_STORAGE } from '../constants';

export interface ControllerRouteMetadata {
  basePath: string;
  middlewares: Function[];
}

export function Controller(basePath: string = '/', middlewares: Function[] = []): ClassDecorator {
  return <T extends Function>(target: T) => {
    const previousMetadata: ControllerRouteMetadata | undefined = Reflect.getMetadata(
      CONTROLLER_ROUTE_METADATA_STORAGE,
      target,
    );

    const metadata = (previousMetadata || {}) as any;
    const previousMiddlewares = metadata.middlewares || [];

    Reflect.defineMetadata(
      CONTROLLER_ROUTE_METADATA_STORAGE,
      { basePath, middlewares: previousMiddlewares.concat(middlewares) },
      target,
    );
  };
}
