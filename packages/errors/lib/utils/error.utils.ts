import { BaseError } from "../BaseError";

export const inheritStackTrace = (baseError: BaseError, originalStackStrace: string): string => {
  const stack: string[] = originalStackStrace.split('\n');
  const header = stack.shift();
  stack.unshift(`    inherits ${header}`);
  stack.unshift(`${baseError.name}: ${baseError.message}`);
  return stack.join('\n');
};