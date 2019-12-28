import { BaseError } from '@nano/errors';

export class UnknownDriverError extends BaseError {
  public constructor(driver: string) {
    super(`Invalid or unknown event driver requested: "${driver}". `, { driver });
  }
}
