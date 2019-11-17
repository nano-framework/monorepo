import { COMMAND_ARGS_METADATA_STORAGE } from '../constants';

export interface CommandArgMetadata {
  alias?: string[];
  default?: string;
  describe?: string;
}

export function CommandArg(key: string, options: CommandArgMetadata = {}): ClassDecorator {
  return <T extends Function>(target: T) => {
    const previousMetadata = Reflect.getMetadata(COMMAND_ARGS_METADATA_STORAGE, target);
    Reflect.defineMetadata(COMMAND_ARGS_METADATA_STORAGE, { ...previousMetadata, [key]: { ...options } }, target);
  };
}
