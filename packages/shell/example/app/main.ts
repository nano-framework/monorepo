import { CommandLine } from '../../lib';
import { config } from '../config';
import { MathPasswordCommand, RandomPasswordCommand } from './commands';

/**
 * A simple password generator command line.
 */
export class PasswordGenerator extends CommandLine {
  public readonly children = [
    new MathPasswordCommand({ logger: config.logger }),
    new RandomPasswordCommand({ logger: config.logger }),
  ];

  public constructor(options = {}) {
    super({ name: 'password-gen', logger: config.logger, ...options });
  }
}
