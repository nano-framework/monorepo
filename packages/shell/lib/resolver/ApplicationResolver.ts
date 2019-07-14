import { BaseComponent } from '@nano/app';
import { BaseError } from '@nano/errors';

export class ApplicationResolverError extends BaseError {
  public constructor(exception: Error, details: { path: string }) {
    super(exception, { ...details });
  }
}

export class ApplicationResolver extends BaseComponent {
  public async resolve(fullPath: string) {
    try {
      const instance = await import(fullPath);
      this.logger.silly('Module resolved successully', {
        module: instance.name || instance.constructor.name,
      });
      return module;
    } catch (exception) {
      throw new ApplicationResolverError(exception, { path: fullPath });
    }
  }
}
