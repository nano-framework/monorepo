import { COMMAND_ACTION_METADATA_STORAGE } from '../constants';

export interface CommandRouteMetadata {
  basePath: string;
  middlewares: Function[];
}

export function Command(action = '/', describe?: string): ClassDecorator {
  return <T extends Function>(target: T) => {
    Reflect.defineMetadata(COMMAND_ACTION_METADATA_STORAGE, { action, describe }, target);
  };
}
