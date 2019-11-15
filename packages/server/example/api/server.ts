import { config, logger } from '../config';
import { controllers } from './controllers';
import { RequestComponent, RouterComponent, Server, ServerOptions } from './lib';

export class ExampleServer extends Server {
  public children = [new RequestComponent({ logger }), new RouterComponent({ logger, controllers })];

  constructor(options?: ServerOptions) {
    super({ logger, ...config.server, ...options });
  }
}
