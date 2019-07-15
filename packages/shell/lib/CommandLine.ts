import { Application, ApplicationOptions } from '@nano/app';
import { BaseError } from '@nano/errors';
import * as yargs from 'yargs';
import * as Commands from './commands';

// TODO: Move to config
export const DEFAULT_COLUMN_WIDTH = 120;

export class CommandLineError extends BaseError {}

export interface CommandLineOptions extends ApplicationOptions {
  /** The name of the command line, defaults to "nano". */
  name?: string;
  /** The max columns in the terminal output. */
  maxWidth?: number;
  /** The commands to be bound to the Yargs instance */
  commands?: (new () => yargs.CommandModule)[];
}

export class CommandLine extends Application {
  public static DEFAULT_COMMANDS = [Commands.VersionCommand];

  public yargs: yargs.Argv;

  public options: CommandLineOptions;

  public constructor({ commands, ...options }: CommandLineOptions = {}) {
    // eslint-disable-next-line
    super({
      name: 'nano',
      commands: commands || CommandLine.DEFAULT_COMMANDS,
      ...options,
    } as ApplicationOptions);
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

    // Base script name
    this.yargs.scriptName(this.options.name);

    // Continue with children mounting
    super.onMount();
  }

  /**
   * Initializes command line using Yargs.
   */
  public async onInit() {
    await super.onInit();

    if (!this.options.commands || !this.options.commands.length) {
      throw new CommandLineError('No commands were bound to the command line instance');
    }

    // Initialize all child commands
    const commands = this.options.commands || [];
    commands.map((Command: any) => this.yargs.command(new Command({ logger: this.logger })));

    // Spacing between logs and output
    console.log(' ');

    // Prepare verbose option
    this.yargs
      .boolean('verbose')
      .alias('V', 'verbose')
      .describe('verbose', 'Runs command in verbose mode');

    // eslint-disable-next-line
    await new Promise((resolve, reject) => this.yargs
        .recommendCommands()
        .demandCommand(1)
        .help('h')
        .alias('h', 'help')
        .alias('v', 'version')
        .parse(process.argv.slice(2, process.argv.length), async (error, argv, output) => {
          if (argv._promised_result) {
            await argv._promised_result;
          }

          if (error) {
            reject(error);
          } else {
            resolve(output);
          }
        }),
    );
  }
}
