import { Component, ComponentOptions } from '@nano/app';
import { Logger, LoggerInstance } from '@nano/errors';
import * as Express from 'express';
import { Server } from '../Server';
import { BaseControllerMap } from './BaseControllerMap';

export interface BaseControllerOptions extends ComponentOptions {}

export abstract class BaseController implements Component<Server> {
  public logger: LoggerInstance;

  private static decorated: BaseControllerMap = {};

  public constructor(public options: BaseControllerOptions = {}, public express = Express()) {
    this.logger = this.options.logger || Logger.getInstance();
    this.options.name = options.name || this.constructor.name;
  }

  /**
   * Register all controllers routes into the bound express server instance.
   *
   * @param server The bound server instance
   */
  public onMount(server: Server) {
    const { decorated } = this.constructor as typeof BaseController;

    Object.keys(decorated).map(method => {
      const routes = decorated[method];

      Object.keys(routes).map(route => {
        this.logger.silly(`${this.options.name} registering route`, {
          method: method.toUpperCase(),
          path: route,
        });

        // Create a safe wrapper with function binding
        const targetClass = routes[route].controller.target;
        const targetMethod = routes[route].controller.key;
        const wrapper = targetClass[targetMethod].bind(targetClass);

        // Register the bound wrapper as an express server route
        server.express[method](route, [...routes[route].middlewares, wrapper]);
      });
    });
  }
}
