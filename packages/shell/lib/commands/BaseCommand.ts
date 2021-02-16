import 'reflect-metadata';
import { BaseComponent, ComponentOptions } from '@nano/app';
import * as yargs from 'yargs';
import { BaseError } from '@nano/errors/lib';
import { COMMAND_ACTION_METADATA_STORAGE, COMMAND_ARGS_METADATA_STORAGE } from './constants';

export interface BaseCommandOptions extends ComponentOptions {}

export abstract class BaseCommand<Options = any, Result = any> extends BaseComponent
  implements yargs.CommandModule<Options, Result> {
  public readonly command: string;

  public readonly describe: string;

  public readonly builder: yargs.CommandBuilder<Options, Result> = {};

  public constructor(options?: BaseCommandOptions) {
    super(options);

    // Build command from reflection metadata
    const metadata = Reflect.getMetadata(COMMAND_ACTION_METADATA_STORAGE, this.constructor) || {};
    this.command = metadata.action;
    this.describe = metadata.describe || '';

    // Build command arguments from reflection metadata
    const argsMetadata = Reflect.getMetadata(COMMAND_ARGS_METADATA_STORAGE, this.constructor) || {};
    Object.keys(argsMetadata).map(name => {
      if (typeof this.builder === 'function') {
        // TODO
        throw new BaseError('@CommandArg decorator does not support yargs builder, only objects');
      }
      const { alias, ...otherOpts } = argsMetadata[name];

      const orderedAliases = [name, ...alias].sort((a, b) => {
        return a.length > b.length ? 1 : -1;
      });

      const minAlias = orderedAliases.shift();
      this.builder[minAlias] = { ...otherOpts, alias: [...orderedAliases] };
    });
  }

  public abstract async handler(args: yargs.Arguments<Result>): Promise<void>;
}
