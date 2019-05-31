import { Logger, LoggerInstance } from '@nano/errors';
import { ComponentGroup, ComponentGroupOptions } from "./base";

export interface ApplicationOptions extends ComponentGroupOptions {
  logger?: LoggerInstance;
}

export class Application extends ComponentGroup {
  public readonly options: ApplicationOptions;

  constructor(options: ApplicationOptions = {}) {
    const logger = options.logger || Logger.initialize();
    super({ name: 'Application', logger, ...options });
  }

  /**
   * Handles post mount routines.
   */
  public onMount(): void {
    super.onMount(this);
  }

  /**
   * Handles pre initialization routines.
   */
  public async onInit(): Promise<void> {
    super.onInit(this);
  }

  /**
   * Handles post unmount routines.
   */
  public onUnmount(): void {
    super.onUnmount(this);
  }

  /**
   * Handles post initialization routines.
   */
  public async onReady(): Promise<void> {
    super.onReady(this);
  }

  /**
   * Starts the application lifecycle and mount all its components.
   */
  public async start() {
    this.onMount();
    await this.onInit();
    await this.onReady();
  }

  /**
   * Stops the application lifecycle and unmount all its components.
   */
  public async stop() {
    this.onUnmount();
  }
}