import { Application, ApplicationOptions, Component } from '@nano/app';
import * as Express from 'express';
import * as http from 'http';
import { RequestComponent, RequestComponentOptions } from './components';

export type BaseRequest = Express.Request;
export type BaseResponse = Express.Response;
export type BaseMiddleware = (req: BaseRequest, res: BaseResponse, next: (error?: Error) => void) => void;

// TODO: Move this to a nano/config pkg
const DEFAULT_PORT = 3000;

export interface ServerOptions extends ApplicationOptions {
  port?: number;
  request?: false | RequestComponentOptions;
}

export class Server extends Application {
  /** The server instance options */
  public readonly options: ServerOptions;

  /** The server express instance */
  public readonly express: Express.Application;

  /** The server HTTP instance */
  public http: http.Server;

  /** The server children components  */
  public children: Component<Server>[];

  /**
   * Initializes a new Server instance bound to an Express application.
   *
   * @param options The readonly server options.
   * @param express The readonly express instance, if not provided will be auto-initialized.
   */
  public constructor(options: ServerOptions = {}, express = Express()) {
    super({ name: new.target.name, ...options });

    // Add default server children
    if (options.request !== false) {
      this.children.push(new RequestComponent(options.request));
    }

    // Bind the express instance to our server wrapper
    this.express = express;

    // Ensure server will have a port to bind to
    this.options.port = options.port || DEFAULT_PORT;
  }

  /**
   * Adds raw request handlers to the current Express server instance.
   * <br />
   * Use with caution, Component registration is always preferred.
   *
   * @param handlers The request handlers to be bound to the server.
   */
  public use(...handlers: Express.RequestHandler[]): this {
    this.express.use(...handlers);
    return this;
  }

  public async onInit(): Promise<void> {
    await super.onInit();

    // Wrap express startup in a single promise
    return new Promise((resolve, reject) => {
      this.http = this.express
        .listen(this.options.port || DEFAULT_PORT, () => resolve())
        .on('error', (error: Error) => reject(error));
    });
  }

  public async onReady() {
    await super.onReady();
    this.logger.debug(`${this.options.name} started listening on the specified port`, { port: this.options.port });
  }
}
