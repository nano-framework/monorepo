import { LoggerInstance } from '@nano/errors';
import { Application } from '../Application';

export interface ComponentOptions {
  name?: string;
  logger?: LoggerInstance;
}

export interface Component<Type = Application> {
  options: ComponentOptions;
  logger: LoggerInstance;

  /**
   * Handles post mount routines.
   */
  onMount?(app: Type): void;

  /**
   * Handles pre initialization routines.
   */
  onInit?(app: Type): Promise<void>;

  /**
   * Handles post unmount routines.
   */
  onUnmount?(app: Type): void;

  /**
   * Handles post initialization routines.
   */
  onReady?(app: Type): Promise<void>;
}
