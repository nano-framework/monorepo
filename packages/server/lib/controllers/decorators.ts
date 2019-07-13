import { BaseError } from '@nano/errors';
import { BaseMiddleware } from '../Server';
import { BaseController } from './BaseController';

type ControllerDecoratorMethods = 'get' | 'post' | 'put' | 'options' | 'delete';

const ControllerDecoratorFactory = (method: ControllerDecoratorMethods) =>
  function ControllerDecorator(route: string, middlewares: BaseMiddleware[] = []): any {
    return function getDecorator(target: typeof BaseController, key: string, descriptor: PropertyDescriptor) {
      // Ensure the decorated map is available for registration
      if (!(target as any).decorated) {
        throw new BaseError(
          `${method.toUpperCase()} decorator for ${target.name}.${key}() found no way to map instance` +
            'to the target controller, ensure it extends BaseController.',
        );
      }

      // Register route in base controller decorated map
      const { decorated } = target as any;
      decorated[method] = decorated[method] || {};
      decorated[method][route] = {
        middlewares,
        controller: { target, key },
      };
      return descriptor;
    };
  };

/**
 * Decorates a controller method for binding to HTTP requests with the GET method.
 *
 * Usage: `@Get(route: string, middlewares?: BaseMiddleware[])`.
 */
export const Get = ControllerDecoratorFactory('get');

/**
 * Decorates a controller method for binding to HTTP requests with the POST method.
 *
 * Usage: `@Post(route: string, middlewares?: BaseMiddleware[])`.
 */
export const Post = ControllerDecoratorFactory('post');

/**
 * Decorates a controller method for binding to HTTP requests with the PUT method.
 *
 * Usage: `@Put(route: string, middlewares?: BaseMiddleware[])`.
 */
export const Put = ControllerDecoratorFactory('put');

/**
 * Decorates a controller method for binding to HTTP requests with the OPTIONS method.
 *
 * Usage: `@Options(route: string, middlewares?: BaseMiddleware[])`.
 */
export const Options = ControllerDecoratorFactory('options');

/**
 * Decorates a controller method for binding to HTTP requests with the DELETE method.
 *
 * Usage: `@Delete(route: string, middlewares?: BaseMiddleware[])`.
 */
export const Delete = ControllerDecoratorFactory('delete');
