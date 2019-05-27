import * as Sentry from '@sentry/node';
import jsonStringify from 'fast-safe-stringify';
import * as os from 'os';
import { MESSAGE } from 'triple-beam';
import { format, info } from 'winston';
import { BaseError } from '../BaseError';

export const lineFormat = format((info: any) => {
  const stringifiedRest = jsonStringify({
    ...info,
    level: undefined,
    message: undefined,
    splat: undefined
  }, null, 2);

  const padding = info.padding && info.padding[info.level] || '';
  if (stringifiedRest !== '{}') {
    info[MESSAGE] = `${info.level}:${padding} ${info.message} ${stringifiedRest}`;
  } else {
    info[MESSAGE] = `${info.level}:${padding} ${info.message}`;
  }

  return info;
});

// Quick and dirty fix for Winston@3.0.0 issue with errors
// @see {https://github.com/winstonjs/winston/issues/1338}
export const enumerateErrorFormat = format((info: any) => {
  if (info.message instanceof BaseError) {
    return {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message
    };
  }

  if (info.message instanceof Error) {
    return {
      message: info.message.message,
      stack: info.message.stack,
      ...info.message
    };
  }

  if (info instanceof BaseError) {
    return {
      message: info.message,
      stack: info.stack,
      ...info,
    };
  }

  if (info instanceof Error) {
    return {
      message: info.message,
      stack: info.stack,
      ...info,
    };
  }

  return info;
});


export const winstonLevelToSentryLevel = {
  silly: 'debug',
  verbose: 'debug',
  info: 'info',
  debug: 'debug',
  warn: 'warning',
  error: 'error',
  default: info,
};


export const prepareSentryMeta = (info: { level: string, tags: any, message: any }): Sentry.Event | Error => {
  const {
    level,
    tags,
    modules,
    platform = os.platform(),
    server_name = os.hostname(),
    ...extra
  }: any = { ...info };

  let stack: string | undefined;

  // Generate mocked stack for objects
  if (info.level !== 'error') {
    const event = new Error(info.message);
    event.name = info.level;
    stack = event.stack;
  }

  const result = {
    modules,
    server_name,
    platform,
    extra: {
      stack,
      ...extra,
    },
    tags: {
      platform,
      stackId: extra.stackId,
      ...tags,
    },
    message: info.message.message || info.message,
    level: winstonLevelToSentryLevel[info.level],
  };

  return result;
};