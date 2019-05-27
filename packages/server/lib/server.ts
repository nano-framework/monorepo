import { Logger, LoggerInstance } from '@nano/errors';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as http from 'http';
import * as methodOverride from 'method-override';
import { EventEmitter } from 'events';

export interface ServerOptions {
  port: number;
  logger?: LoggerInstance;
}

export class Server {
  public http: http.Server;
  public logger: LoggerInstance;
  public emitter: EventEmitter;

  public static readonly Events = {
    MOUNTED: 'mounted',
    READY: 'ready',
  }

  constructor(public options: ServerOptions, public app = express()) {
    if (!this.app) {
      throw new Error('Express applcation is invalid or undefined');
    }
    this.onMount();
  }

  public onMount() {
    this.emitter = new EventEmitter();
    this.logger = this.options.logger || Logger.getInstance();

    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    this.app.use(methodOverride);

    this.emitter.emit(Server.Events.MOUNTED);
  }

  /**
   * Starts listening on the configured port.
   *
   * @returns {Promise<ServerOptions>}
   */
  public async listen(): Promise<ServerOptions> {
    return new Promise<ServerOptions>((resolve, reject) => {
      this.http = this.app.listen(this.options.port, () => {
        this.logger.info(`Server listening in port: ${this.options.port}`);
        this.emitter.emit(Server.Events.READY);
      })
        .on("error", (error: Error) => reject(error));
    });
  }
}