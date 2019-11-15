import { Logger } from '@nano/errors';
import { Component, ComponentOptions } from '../../lib';

/**
 * Minimal component boilerplate.
 */
export class DummyComponent implements Component {
  public logger = Logger.getInstance();

  public options = { name: 'DummyComponent' };

  public constructor(options: ComponentOptions = {}) {
    this.options = { ...this.options, ...options };
  }
}
