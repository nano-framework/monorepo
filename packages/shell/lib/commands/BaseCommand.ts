import { BaseComponent, ComponentOptions } from '@nano/app';
import * as yargs from 'yargs';
import { COMMAND_ACTION_METADATA_STORAGE } from './constants';

export interface BaseCommandOptions extends ComponentOptions {}

export abstract class BaseCommand<Options = any, Result = any> extends BaseComponent
  implements yargs.CommandModule<Options, Result> {
  public readonly command: string;

  public readonly describe: string;

  public readonly builder = {};

  public constructor(options?: BaseCommandOptions) {
    super(options);
    const metadata = Reflect.getMetadata(COMMAND_ACTION_METADATA_STORAGE, this.constructor);
    this.command = metadata.action;
    this.describe = metadata.describe;
  }

  public abstract async handler(args: yargs.Arguments<Result>): Promise<void>;
}
