import { Logger, LoggerInstance } from '@nano/errors';
import { Application } from '../Application';
import { Component, ComponentOptions } from '../schema';
import { BaseComponent } from './BaseComponent';

export interface BaseComponentGroupOptions extends ComponentOptions {
  children?: Component[];
  logger?: LoggerInstance;
}

/**
 * A higher order component to handle a group of children.
 */
export abstract class BaseComponentGroup extends BaseComponent {
  public readonly children: Component[];

  public readonly logger: LoggerInstance;

  public constructor(public options: BaseComponentGroupOptions = {}) {
    super(options);
    this.children = options.children || this.children || [];
  }

  /**
   * Handles post mount routines.
   */
  public onMount(app: Application): void {
    const names = this.children.length ? this.children.map(c => c.options.name) : [];
    this.logger.silly(`Mounting ${this.options.name} child components`, names);

    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].onMount) {
        this.children[i].onMount(app);
      }
    }
  }

  /**
   * Handles pre initialization routines.
   */
  public async onInit(app: Application): Promise<void> {
    this.logger.silly(`Initializing ${this.options.name} child components`, this.children.map(c => c.options.name));
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].onInit) {
        await this.children[i].onInit(app);
      }
    }
  }

  /**
   * Handles post initialization routines.
   */
  public async onReady(app: Application) {
    this.logger.silly(
      `${this.options.name} components initialized successfully`,
      this.children.map(c => c.options.name),
    );
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].onReady) {
        await this.children[i].onReady(app);
      }
    }
  }

  /**
   * Handles post unmount routines.
   */
  public onUnmount(app: Application): void {
    this.logger.silly(`Unmounting ${this.options.name} child components`, this.children.map(c => c.options.name));
    for (let i = 0; i < this.children.length; i += 1) {
      if (this.children[i].onUnmount) {
        this.children[i].onUnmount(app);
      }
    }
  }
}
