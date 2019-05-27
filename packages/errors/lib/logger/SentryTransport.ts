import * as Integrations from '@sentry/integrations';
import * as Sentry from '@sentry/node';
import * as Transport from 'winston-transport';
import { BaseError } from '../BaseError';
import { prepareSentryMeta } from '../utils';

export interface SentryTransportOptions extends Sentry.NodeOptions, Transport.TransportStreamOptions {
}

export class SentryTransport extends Transport {
  public readonly name = 'Sentry';
  public options: SentryTransportOptions;

  constructor(options: SentryTransportOptions) {
    super(options);

    Sentry.init({
      dsn: '',
      patchGlobal: false,
      install: false,
      environment: process.env.NODE_ENV,
      attachStacktrace: true,
      tags: {},
      extra: {},
      integrations: [
        new Integrations.ExtraErrorData({ depth: 6 }),
      ],
      ...options,
    });
  }

  async log(info: { level: string, tags: any, message: any }, done: () => void) {
    if (this.silent) {
      return done();
    }

    const meta = prepareSentryMeta(info);

    if (info.level === 'error') {
      const error = new BaseError(info, meta);
      error.name = info['name'] || BaseError.name;
      Sentry.captureException(error);
    } else {
      Sentry.captureEvent(meta);
    }

    done();
  }
}
