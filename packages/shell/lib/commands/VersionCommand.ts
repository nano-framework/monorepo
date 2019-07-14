import * as yargs from 'yargs';
import { exec } from 'child_process';
import { BaseComponent } from '@nano/app/lib';

/**
 * Shows typeorm version.
 */
export class VersionCommand extends BaseComponent implements yargs.CommandModule {
  public readonly command = 'version';

  public readonly describe = 'Prints @nano/shell version currently being used';

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

  public async handler(): Promise<void> {
    // Gets local project version if available
    const localYarnList = await VersionCommand.executeCommand('yarn list --depth=0');
    const localMatches = localYarnList.match(/ @nano\/shell@(.*)\n/);
    const localYarnVersion = (localMatches && localMatches[1] ? localMatches[1] : '').replace(/"invalid"/gi, '').trim();

    // Gets global version if available
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
          'or you are using locally installed @nano/shell instead of global one.',
        {
          local: localYarnVersion,
          global: globalYarnVersion,
        },
      );
    }
  }
}
