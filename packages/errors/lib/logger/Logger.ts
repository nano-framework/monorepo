import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { BaseError } from '../BaseError';
import { enumerateErrorFormat, lineFormat } from "../utils";

export interface LoggerOptions extends winston.LoggerOptions {
  transports?: Transport[];
}

// Export the winston.Logger type so we don't need to install the winston types on dependants
export type LoggerInstance = winston.Logger;

export class Logger {
  /**
   * The singleton logger instance, needs to be created using `Logger.initialize()`.
   * 
   * @see Logger.initialize()
   */
  protected static instance: LoggerInstance;

  /**
   * The default transports thay will be enabled in the singleton.
   */
  static DEFAULT_TRANSPORTS: LoggerInstance['transports'] = [
    new winston.transports.Console({
      level: process.env.LOG_LEVEL || 'silly',
      format: winston.format.combine(
        enumerateErrorFormat(),
        winston.format.colorize(),
        lineFormat(),
      ),
    }),
  ];

  /**
   * Simple logger constructor is deprecated, use SimpleLogger.initialize() instead.
   *
   * @deprecated
   */
  private constructor() {
    throw new Error('Simple logger constructor is deprecated in Winston 3, use Logger.initialize() instead');
  }

  /**
   * Gets the singleton Logger instance, if available.
   */
  public static getInstance(): LoggerInstance {
    if (!this.instance) {
      throw new BaseError('Logger has not been initialized yet');
    }
    return this.instance;
  }

  /**
   * Initialize a new logger instance using Winston factory.
   *
   * @param options The logger initialization options
   */
  public static initialize(options: LoggerOptions = {}): LoggerInstance {
    // Prepare default console transport
    const opt = {
      transports: options.transports || Logger.DEFAULT_TRANSPORTS,
    };

    // Construct new Winston logger instance with enhanced error handling
    const logger = winston.createLogger({
      format: winston.format.combine(enumerateErrorFormat()),
      ...opt
    });;

    if (!this.instance) {
      this.instance = logger;
    }

    return logger;
  }
}