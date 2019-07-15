import * as yargs from 'yargs';
import { BaseComponent } from '@nano/app/lib';

// eslint-disable-next-line
const { exec } = require('child_process');

/**
 * Shows typeorm version.
 */
export class VersionCommand extends BaseComponent implements yargs.CommandModule {
  public readonly builder = {};

  public readonly command = 'version';

  public readonly describe = 'Prints versions currently installed in the environment';

  public constructor(options) {
    super(options);
    this.handler = this.handler.bind(this);
  }

  protected static executeCommand(command: string) {
    return new Promise<string>((ok, fail) => {
      exec(command, (error: any, stdout: any, stderr: any) => {
        if (stdout) return ok(stdout);
        if (stderr) return ok(stderr);
        if (error) return fail(error);
        ok('');
      });
    });
  }

  public async handler(argv): Promise<void> {
    // Fixes yargs bug with promises
    // eslint-disable-next-line
    argv._promised_result = new Promise(async (resolve, reject) => {
      try {
        // Gets local project version if available
        this.logger.debug('Fetching locally installed versions using Yarn...');
        const localYarnList = await VersionCommand.executeCommand('yarn list --depth=0');
        const localMatches = localYarnList.match(/ @nano\/shell@(.*)\n/);
        const localYarnVersion = (localMatches && localMatches[1] ? localMatches[1] : '')
          .replace(/"invalid"/gi, '')
          .trim();

        // Gets global version if available
        this.logger.debug('Fetching globally installed versions using Yarn...');
        const globalYarnList = await VersionCommand.executeCommand('yarn global list --depth=0');
        const globalMatches = globalYarnList.match(/ @nano\/shell@(.*)\n/);
        const globalYarnVersion = (globalMatches && globalMatches[1] ? globalMatches[1] : '')
          .replace(/"invalid"/gi, '')
          .trim();

        if (localYarnVersion) {
          this.logger.info('@nano/shell is installed locally', { verison: localYarnVersion });
        } else {
          this.logger.info('No locally installed @nano/shell was found', {});
        }
        if (globalYarnVersion) {
          this.logger.info('@nano/shell is installed globally', { verison: localYarnVersion });
        } else {
          this.logger.info('No globally installed @nano/shell was found', {});
        }

        if (localYarnVersion && globalYarnVersion && localYarnVersion !== globalYarnVersion) {
          this.logger.warn(
            'To avoid issues with CLI please make sure your global and local @nano versions match, ' +
              'or you are using locally installed @nano/shell instead of the global one.',
            {
              local: localYarnVersion,
              global: globalYarnVersion,
            },
          );
        }
        resolve();
      } catch (exception) {
        this.logger.error(exception);
        reject(exception);
      }
    });
  }
}
