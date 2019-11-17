import { exec } from 'child_process';
import * as yargs from 'yargs';
import { BaseCommand, BaseCommandOptions } from './BaseCommand';
import { Command } from './decorators';
import { CommandLineService } from '../services';

/**
 * Shows typeorm version.
 */
@Command('version', 'Prints versions currently installed in the environment')
export class VersionCommand extends BaseCommand<{}, {}> {
  public constructor(options?: BaseCommandOptions) {
    super(options);
    this.handler = this.handler.bind(this);
  }

  public async handler(argv: yargs.Arguments<{}>): Promise<void> {
    const cmd = new CommandLineService();

    // Gets local project version if available
    this.logger.debug('Fetching locally installed versions using Yarn...');
    const { stdout: localYarnList } = await cmd.execute('yarn list --depth=0');
    const localMatches = localYarnList.match(/ @nano\/shell@(.*)\n/);
    const localYarnVersion = (localMatches && localMatches[1] ? localMatches[1] : '').replace(/"invalid"/gi, '').trim();

    // Gets global version if available
    this.logger.debug('Fetching globally installed versions using Yarn...');
    const { stdout: globalYarnList } = await cmd.execute('yarn global list --depth=0');
    const globalMatches = globalYarnList.match(/ @nano\/shell@(.*)\n/);
    const globalYarnVersion = (globalMatches && globalMatches[1] ? globalMatches[1] : '')
      .replace(/"invalid"/gi, '')
      .trim();

    console.log(' ');
    console.log(' ');
    if (localYarnVersion) {
      this.logger.info('@nano/shell is installed locally', { verison: localYarnVersion });
    } else {
      this.logger.info('No locally installed @nano/shell was found', {});
    }
    console.log(' ');
    if (globalYarnVersion) {
      this.logger.info('@nano/shell is installed globally', { verison: localYarnVersion });
    } else {
      this.logger.info('No globally installed @nano/shell was found', {});
    }

    if (localYarnVersion && globalYarnVersion && localYarnVersion !== globalYarnVersion) {
      console.log(' ');
      this.logger.warn(
        'To avoid issues with CLI please make sure your global and local @nano versions match, ' +
          'or you are using locally installed @nano/shell instead of the global one.',
        {
          local: localYarnVersion,
          global: globalYarnVersion,
        },
      );
    }
  }
}
