import { Logger, LoggerInstance } from '@nano/errors';
import { Application } from '../Application';
import { Component, ComponentOptions } from '../schema';

/**
 * The class component class for deriving simple components instead of implementing
 * all component methods with empty functions.
 */
export abstract class BaseComponent<Type = Application> implements Component<Type> {
  public readonly logger: LoggerInstance;

  /**
   *
   * @param options The component options (readonly)
   */
  public constructor(public readonly options: ComponentOptions = {}) {
    this.logger = this.options.logger || Logger.getInstance();
  }

  /**
   * Handles post mount routines.
   */
  // eslint-disable-next-line no-empty-function
  public onMount(app: Type): void {}

  /**
   * Handles pre initialization routines.
   */
  // eslint-disable-next-line no-empty-function
  public async onInit(app: Type): Promise<void> {}

  /**
   * Handles post unmount routines.
   */
  // eslint-disable-next-line no-empty-function
  public onUnmount(app: Type): void {}

  /**
   * Handles post initialization routines.
   */
  // eslint-disable-next-line no-empty-function
  public async onReady(app: Type): Promise<void> {}
}
