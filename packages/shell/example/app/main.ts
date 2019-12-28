import { CommandLine } from '../../lib';
import { config } from '../config';
import { MathPasswordCommand } from './commands';

/**
 * A simple password generator command line.
 */
export class PasswordGenerator extends CommandLine {
  public readonly children = [new MathPasswordCommand({ logger: config.logger })];

  public constructor(options = {}) {
    super({ name: 'password-gen', logger: config.logger, ...options });
  }
}
