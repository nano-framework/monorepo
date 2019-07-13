import { BaseMiddleware } from '../Server';
import { BaseController } from './BaseController';

export interface BaseControllerMap {
  [method: string]: {
    [route: string]: {
      middlewares: BaseMiddleware[];
      controller?: {
        target: typeof BaseController;
        key: string;
      };
    };
  };
}
