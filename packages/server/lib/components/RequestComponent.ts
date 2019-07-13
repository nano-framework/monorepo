// import * as multer from "multer";
// import { legacyParams, responseBinder } from "./middlewares";
import { Component, ComponentOptions } from '@nano/app';
import { BaseError, Logger, LoggerInstance } from '@nano/errors';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as methodOverride from 'method-override';
import { legacyParams } from '../middlewares';
import { Server } from '../Server';

export interface RequestComponentOptions extends ComponentOptions {
  logger?: LoggerInstance;
  cookieParser?: false | (cookieParser.CookieParseOptions & { secret: string });
  methodOverride?: false | methodOverride.Options;
  bodyParser?:
    | false
    | {
        text?: bodyParser.OptionsText;
        json?: bodyParser.OptionsJson;
        urlencoded?: bodyParser.OptionsUrlencoded;
      };
  // multer?: {
  //   single?: string;
  //   array?: { name: string; maxCount: number };
  //   fields?: { name: string; maxCount: number }[];
  //   options?: Multer.Options;
  // };
}

export class RequestComponent implements Component {
  public logger: LoggerInstance;

  public constructor(public options: RequestComponentOptions = {}) {
    this.logger = options.logger || Logger.getInstance();
    this.options.name = this.options.name || this.constructor.name;
  }

  /**
   * Mounts all inner dependencis for handling requests in the Express server.
   *
   * @param server The server instance to mount into
   */
  public onMount(server: Server) {
    // Mount body parser as default, unless is disabled from outside
    if (this.options.bodyParser !== false) {
      const options = { ...this.options.bodyParser };
      this.logger.debug(`${this.options.name} initializing middleware: BodyParser`, options);

      // Handle Text body parser configuration as default
      if (options.text !== false) {
        server.express.use(bodyParser.text({ ...options.text }));
      }

      // Handle JSON body parser configuration as default
      if (options.json !== false) {
        server.express.use(bodyParser.json({ ...options.json }));
      }

      // Handle Urlencoded body parser configuration as default
      if (options.urlencoded !== false) {
        server.express.use(bodyParser.urlencoded({ extended: true, ...options.urlencoded }));
      }
    }

    // Mount method override as default, unless is disabled from outside
    if (this.options.methodOverride !== false) {
      const options = { ...this.options.methodOverride };
      this.logger.debug(`${this.options.name} initializing middleware: MethodOverride`, options);
      server.express.use(methodOverride());
    }

    // Only enable cookie parser if a secret was set
    if (this.options.cookieParser && !this.options.cookieParser) {
      throw new BaseError('Cannot setup Cookie Parser without a valid secret');
    } else if (this.options.cookieParser) {
      // Initialize cookie parser with the provided secret
      const { secret, ...options } = { ...this.options.cookieParser };
      this.logger.debug(`${this.options.name} initializing middleware: CookieParser`, options);
      server.express.use(cookieParser(secret, options));
    }

    // Handle multer middleware
    // if (this.options.multer) {
    //   this.logger.silly("Initializing server middleware: Multer");
    //   const opts = this.options.multer as any;
    //   const multer = Multer(opts);

    //   if (opts.single) {
    //     // Single file field
    //     server.app.use(multer.single(opts.single));
    //   } else if (opts.array) {
    //     // Array field
    //     server.app.use(multer.array(opts.array.name, opts.array.maxCount));
    //   } else if (opts.fields) {
    //     // Multiple fields
    //     server.app.use(multer.fields(opts.fields));
    //   } else {
    //     // Defaults to single "file" field
    //     server.app.use(multer.single("file"));
    //   }
    // }

    // Utilitary middlewares for requests and responses
    server.express.use(legacyParams);
    // server.express.use(responseBinder);
  }
}
