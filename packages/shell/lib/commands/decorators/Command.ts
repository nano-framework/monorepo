import { COMMAND_ACTION_METADATA_STORAGE } from '../constants';

export interface CommandActionMetadata {
  action: string;
  describe: string;
}

export function Command(action: string, describe?: string): ClassDecorator {
  return <T extends Function>(target: T) => {
    Reflect.defineMetadata(COMMAND_ACTION_METADATA_STORAGE, { action, describe }, target);
  };
}
