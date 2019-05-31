
import { Application, ApplicationOptions } from '@nano/app';
import * as Express from 'express';
import * as http from 'http';

// TODO: Move this to a nano/config pkg
const DEFAULT_PORT = 3000;

export interface ServerOptions extends ApplicationOptions {
  port?: number;
}

export class Server extends Application {
  public http: http.Server;
  public options: ServerOptions;

  constructor(options: ServerOptions = {}, public express = Express()) {
    super({
      name: 'Server',
      ...options,
    });

    // Ensure server will have a port to bind to
    this.options.port = options.port || DEFAULT_PORT;
  }

  public async onInit(): Promise<void> {
    await super.onInit();

    // Wrap express startup in a single promise
    return new Promise((resolve, reject) => this.http = this.express
      .listen(this.options.port || DEFAULT_PORT, () => resolve())
      .on("error", (error: Error) => reject(error))
    );
  }

  public async onReady() {
    await super.onReady();
    this.logger.debug(`Express server started successfully`, { port: this.options.port });
  }
}