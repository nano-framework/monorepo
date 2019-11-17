import { BaseCommand, Command, CommandArg } from '../../../lib';

@Command('math', 'Generates password using Math.random()')
@CommandArg('length', { alias: ['l'], default: '8', describe: 'The length of the password' })
@CommandArg('output', {
  alias: ['o'],
  describe: 'The output format of the password generation',
  default: 'pretty',
  choices: ['pretty', 'json'],
})
export class MathPasswordCommand extends BaseCommand {
  public async handler(args: any): Promise<void> {
    const result = {
      password: Math.random()
        .toString(36)
        .slice(-args.length),
    };

    if (args.output === 'json') {
      console.log(JSON.stringify(result, null, 2));
    } else {
      this.logger.info('Generated password successfully', result);
    }
  }
}
