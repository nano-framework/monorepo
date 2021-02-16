import { Logger } from '@nano/errors';
import { CommandLine } from './CommandLine';
import * as Commands from './commands';

const logger = Logger.initialize();

export class NanoShell extends CommandLine {
  public readonly children = [new Commands.VersionCommand({ logger })];
}
