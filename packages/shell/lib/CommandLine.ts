import { Application, ApplicationOptions } from '@nano/app';
import { BaseError } from '@nano/errors';
import * as yargs from 'yargs';
import { BaseCommand } from './commands';

// TODO: Move to config
export const DEFAULT_COLUMN_WIDTH = 120;

export class CommandLineError extends BaseError {}

export interface CommandLineOptions extends ApplicationOptions {
  /** The name of the command line, defaults to "nano". */
  name?: string;
  /** The max columns in the terminal output. */
  maxWidth?: number;
}

export class CommandLine extends Application {
  public yargs: yargs.Argv;

  public options: CommandLineOptions;

  public constructor(options: CommandLineOptions = {}) {
    super({ name: 'nano', ...options });
    this.options.maxWidth = this.options.maxWidth || DEFAULT_COLUMN_WIDTH;
  }

  /**
   * Mounts the Yargs command line.
   */
  public onMount() {
    // Prevents max width larger than terminal width
    const maxWidth = Math.min(this.options.maxWidth, yargs.terminalWidth());

    // Prepare logger and initial yargs instance
    this.yargs = yargs.usage('Usage: $0 <command> [...args]').wrap(maxWidth);

    // Prepare verbose option
    this.yargs
      .scriptName(this.options.name)
      .recommendCommands()
      .demandCommand(1)
      .strict()
      .help('h')
      .alias('h', 'help');

    // Continue with children mounting
    super.onMount();
  }

  /**
   * Initializes command line using Yargs.
   */
  public async onInit() {
    await super.onInit();

    const commands = this.children.filter(item => item instanceof BaseCommand);

    if (!commands || !commands.length) {
      throw new CommandLineError('No commands were bound to the command line instance, check your child components');
    }

    // Initialize all child commands
    commands.map((cmd: BaseCommand) => {
      // eslint-disable-next-line
      cmd.handler = cmd.handler.bind(cmd);
      this.yargs.command(cmd);
    });

    // Spacing between logs and output
    console.log(' ');

    // eslint-disable-next-line
    this.yargs
      .help('h')
      .alias('h', 'help')
      .alias('v', 'version').argv;
  }
}
