import { DEPENDENCY_INJECTION_METADATA_STORAGE } from '../constants';

export enum ProviderScope {
  SINGLETON,
  REQUEST,
  TRANSIENT,
}

export interface ProviderIntf<O = any, T = any> extends Function {
  initialize(opts: O): T;
  getInstance(): T;
}

export function Injectable(scope: ProviderScope = ProviderScope.TRANSIENT): ClassDecorator {
  return (target: Function) => {
    Reflect.defineMetadata(DEPENDENCY_INJECTION_METADATA_STORAGE, { scope }, target);
  };
}
