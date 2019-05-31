import { Component, ComponentOptions } from "@nano/app";
import { Logger, LoggerInstance } from "@nano/errors";
import * as Express from 'express';
import { BaseMiddleware, Server } from '../Server';

export type BaseControllerMap = {
  [method: string]: {
    [route: string]: {
      middlewares: BaseMiddleware[],
      handler: Function | BaseMiddleware,
    }
  }
};

export interface BaseControllerOptions extends ComponentOptions {

}

export abstract class BaseController implements Component<Server> {
  public logger: LoggerInstance;
  private static decorated: BaseControllerMap = {};

  constructor(public options: BaseControllerOptions = {}, public express = Express()) {
    this.constructor['instance'] = this;
    this.logger = this.options.logger || Logger.getInstance();
  }

  /**
   * Register all controllers routes into the bound express server instance.
   * 
   * @param server The bound server instance
   */
  public onMount(server: Server) {
    const { decorated } = (this.constructor as typeof BaseController);

    for (const method in decorated) {
      const routes = decorated[method];

      for (const route in routes) {
        this.logger.silly(`${this.options.name} registering route: ${method.toUpperCase()} ${route}`);
        server.express[method](route, [...routes[route].middlewares, routes[route].handler]);
      }
    }
  }
}