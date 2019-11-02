import { Component, ComponentOptions } from '@nano/app';
import { LoggerInstance } from '@nano/errors';
import { Server } from '../server';
import { registerRoutes } from '../route';

export interface RouterComponentOptions extends ComponentOptions {
  controllers: (new () => any)[];
}

export class RouterComponent implements Component {
  public logger: LoggerInstance;

  public constructor(public options: RouterComponentOptions) {}

  public onMount(server: Server) {
    registerRoutes(server.express, this.options.controllers);
  }
}
