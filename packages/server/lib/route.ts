import { NextFunction } from 'connect';
import * as express from 'express';
import { isFunction } from 'util';
import { BaseError } from '@nano/errors';
import {
  CONSTRUCTOR_PARAMTYPES_KEY,
  CONTROLLER_ROUTE_METADATA_STORAGE,
  METHOD_ROUTE_METADATA_STORAGE,
  ROUTE_HANDLER_PARAMTYPES_KEY,
} from './constants';
import {
  ControllerRouteMetadata,
  ProviderIntf,
  MethodRouteMetadata,
  RequestMethod,
  RequestParam,
  RouteHandlerParamTypesMetadata,
} from './decorators';
import { BaseRequest, BaseResponse } from './server';
import { joinPaths } from './utils';

export type ControllerClass<T = any> = new (...args: any[]) => T;

export class RouterError extends BaseError {}

export interface RouteData {
  method: RequestMethod;
  fnName: string;
  path: string;
  middlewares: Function[];
}

function buildRouteData(controller: ControllerClass): RouteData[] {
  const metadata = Reflect.getMetadata(CONTROLLER_ROUTE_METADATA_STORAGE, controller) || ({} as any);
  const { basePath, middlewares: baseMiddlewares = [] }: ControllerRouteMetadata = metadata;
  const routesMetadata: MethodRouteMetadata = Reflect.getMetadata(METHOD_ROUTE_METADATA_STORAGE, controller);

  return Object.entries(routesMetadata).map(([fnName, { method, path, middlewares }]) => ({
    method,
    fnName,
    path: joinPaths(basePath, path),
    middlewares: baseMiddlewares.concat(middlewares),
  }));
}

function matchRequestTypeToMethod(
  app: express.Application,
  method: RequestMethod,
): express.IRouterMatcher<express.Application> {
  switch (method) {
    case 'get':
      return app.get.bind(app);
    case 'put':
      return app.put.bind(app);
    case 'patch':
      return app.patch.bind(app);
    case 'post':
      return app.post.bind(app);
    case 'delete':
      return app.delete.bind(app);
    case 'all':
      return app.use.bind(app);
    default:
      throw new RouterError(`Could not determine method type from "${method}"`);
  }
}

function matchParamTypeToValue(
  type: RequestParam,
  req: express.Request,
  res: express.Response,
  data?: string,
): object | string {
  switch (type) {
    case 'body':
      return data ? req.body[data] : req.body;
    case 'headers':
      return data ? (req.headers[data] as object) : req.headers;
    case 'params':
      return data ? req.params[data] : req.params;
    case 'query':
      return data ? req.query[data] : req.query;
    case 'request':
      return req;
    case 'response':
      return res;
    default:
      throw new RouterError(`Could not determine param type from "${type}"`);
  }
}

function buildHandlerParameters(
  controller: ControllerClass,
  fnName: string,
  req: express.Request,
  res: express.Response,
) {
  const handlerParamMetadata: RouteHandlerParamTypesMetadata[] = Reflect.getMetadata(
    ROUTE_HANDLER_PARAMTYPES_KEY,
    controller,
    fnName,
  );
  return handlerParamMetadata
    .sort((a, b) => {
      const sort = a.index > b.index ? 1 : -1;
      return a.index === b.index ? 0 : sort;
    })
    .map(metadata => matchParamTypeToValue(metadata.type, req, res, metadata.data));
}

function createRouteHandlerWrapper(instance: Record<string, any>, fnName: string) {
  return async (req: BaseRequest, res: BaseResponse, next: NextFunction) => {
    const params = buildHandlerParameters(instance.constructor as ControllerClass, fnName, req, res);

    try {
      const controllerMethodFn = (instance[fnName] as Function).bind(instance);
      const controllerHandlerResponse = await controllerMethodFn(...params);

      // If no value was provided maybe the response was sent inside the controller
      // We should handle this explicitely
      if (controllerHandlerResponse) {
        res
          .status(200)
          .set('Content-Type', 'application/json')
          .send(controllerHandlerResponse);
      }
    } catch (err) {
      next(err);
    }
  };
}

export function registerRoutes(app: express.Application, controllers: ControllerClass[]) {
  controllers.forEach(ControllerClassItem => {
    const controllerRouteData = buildRouteData(ControllerClassItem);
    const controllerParamTypes: ProviderIntf[] =
      Reflect.getMetadata(CONSTRUCTOR_PARAMTYPES_KEY, ControllerClassItem) || [];
    const controllerArgs = controllerParamTypes.map(dep => {
      if (!(dep && dep.getInstance && isFunction(dep.getInstance))) {
        throw new Error(
          `${dep.constructor.name} of ${ControllerClassItem.name} does not implement a static method getInstance`,
        );
      }

      return dep.getInstance();
    });

    const instance = new ControllerClassItem(...controllerArgs);

    controllerRouteData.forEach(({ method, path, fnName, middlewares }) => {
      const registrationMethod = matchRequestTypeToMethod(app, method);

      const middlewareChain: express.RequestHandler[] = [
        ...(middlewares as express.RequestHandler[]),
        createRouteHandlerWrapper(instance, fnName),
      ];

      console.log(`Registering route ${method.toUpperCase()} ${path}`);
      registrationMethod(path, middlewareChain);
    });
  });
}
