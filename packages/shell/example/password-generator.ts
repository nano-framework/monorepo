import { Logger } from '@nano/errors';
import * as qs from 'querystring';
import { BaseCommand, Command, CommandArg, CommandLine, CommandLineService } from '../lib';

const logger = Logger.initialize();

@Command('math', 'Generates password using Math.random()')
@CommandArg('length', { alias: ['l'], default: '8', describe: 'The length of the password' })
export class MathPasswordCommand extends BaseCommand {
  public async handler(args: any): Promise<void> {
    this.logger.info('Generated password successfully', {
      password: Math.random()
        .toString(36)
        .slice(-args.length),
    });
  }
}

@Command('random', 'Generates password using remote API for true randomness')
@CommandArg('length', { alias: ['l'], default: '8', describe: 'The length of the password' })
@CommandArg('url', {
  alias: ['u'],
  default: 'https://passwordwolf.com/api/',
  describe: 'The API url for remote generation',
})
export class RandomPasswordCommand extends BaseCommand {
  public async handler(args: any): Promise<void> {
    const cmd = new CommandLineService({ logger: this.logger });
    const { stdout } = await cmd.execute(`curl "${args.url}?${qs.stringify({ length: args.length })}"`);
    const results = JSON.parse(stdout);
    this.logger.info('Generated password successfully using Random.org', { password: results[0].password });
  }
}

export class PasswordGenerator extends CommandLine {
  public readonly children = [new MathPasswordCommand({ logger }), new RandomPasswordCommand({ logger })];

  public constructor(options) {
    super({ name: 'password-gen', ...options });
  }
}

new PasswordGenerator({ logger }).start().catch((error: Error) => {
  logger.error(error);
  process.exit(1);
});
