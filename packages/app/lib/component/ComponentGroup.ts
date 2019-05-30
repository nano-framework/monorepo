import { ComponentOptions, Component } from './Component';
import { Application } from '../Application';
import { Logger, LoggerInstance } from '@nano/errors';

export interface ComponentGroupOptions extends ComponentOptions {
  children?: Component[];
  logger?: LoggerInstance;
}

/**
 * A higher order component to handle a group of children.
 */
export default abstract class ComponentGroup implements Component {
  public children: Component[];
  public readonly logger: LoggerInstance;

  constructor(public options: ComponentGroupOptions = {}) {
    this.logger = options.logger || Logger.getInstance();
    this.children = options.children || this.children || [];
  }

  /**
   * Handles post mount routines.
   */
  public onMount(app: Application): void {
    this.logger.silly(`Mounting ${this.options.name} child components`, this.children.map(c => c.options.name));
    for (let i = 0; i < this.children.length; i += 1) {
      this.children[i].onMount(app);
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
    this.logger.silly(`${this.options.name} components initialized successfully`, this.children.map(c => c.options.name));
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
      this.children[i].onUnmount(app);
    }
  }

  /**
   * Gets currently registered components.
   */
  public components(): Component[] {
    return this.children;
  }

  /**
   * Register a new component.
   */
  public component(component: Component) {
    return this.children.push(component);
  }
}
