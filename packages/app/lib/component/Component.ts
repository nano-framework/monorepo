import { Application } from "../Application";
import { Logger, LoggerInstance } from "@nano/errors";

export interface ComponentOptions {
  name?: string;
}

export interface Component {
  options: ComponentOptions;
  logger: LoggerInstance;

  /**
   * Handles post mount routines.
   */
  onMount(app: Application): void;

  /**
   * Handles pre initialization routines.
   */
  onInit?(app: Application): Promise<void>;

  /**
   * Handles post unmount routines.
   */
  onUnmount(app: Application): void;

  /**
   * Handles post initialization routines.
   */
  onReady?(app: Application): Promise<void>;
}
