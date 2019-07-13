import { Application, ApplicationOptions } from '@nano/app';
import * as yargs from 'yargs';

// TODO: Move to config
export const DEFAULT_COLUMN_WIDTH = 120;

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
    const maxWidth = Math.min(this.options.maxWidth, yargs.terminalWidth());

    // Prepare logger and initial yargs instance
    this.yargs = yargs.usage('Usage: $0 <command> [...args]').wrap(maxWidth);

    // Base script name
    this.yargs.scriptName(this.options.name);

    // Prepare verbose option
    this.yargs
      .boolean('verbose')
      .alias('V', 'verbose')
      .describe('verbose', 'Runs command in verbose mode');

    // Prepare help guide
    this.yargs
      .help('h')
      .alias('h', 'help')
      .alias('v', 'version');

    // Continue with children mounting
    super.onMount();
  }

  /**
   * Initializes command line using Yargs.
   */
  public async onInit() {
    await super.onInit();

    // Initialize yarhs using getter
    console.log(' ');

    // eslint-disable-next-line
    this.yargs.argv;
  }
}
