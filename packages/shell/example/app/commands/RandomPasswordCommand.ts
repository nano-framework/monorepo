import * as qs from 'querystring';
import { BaseCommand, Command, CommandArg, CommandLineService } from '../../../lib';

@Command('random', 'Generates password using remote API for true randomness')
@CommandArg('length', { alias: ['l'], default: '8', describe: 'The length of the password' })
@CommandArg('url', {
  alias: ['u'],
  default: 'https://passwordwolf.com/api/',
  describe: 'The API url for remote generation',
})
@CommandArg('output', {
  alias: ['o'],
  describe: 'The output format of the password generation',
  default: 'pretty',
  choices: ['pretty', 'json'],
})
export class RandomPasswordCommand extends BaseCommand {
  public async handler(args: any): Promise<void> {
    const cmd = new CommandLineService({ logger: this.logger });
    const { stdout } = await cmd.execute(`curl "${args.url}?${qs.stringify({ length: args.length })}"`);

    const results = JSON.parse(stdout);

    if (args.output === 'json') {
      console.log(JSON.stringify({ password: results[0].password }, null, 2));
    } else {
      this.logger.info('Generated password successfully using Random.org', { password: results[0].password });
    }
  }
}
