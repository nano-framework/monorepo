import * as Sentry from '@sentry/node';
import jsonStringify from 'fast-safe-stringify';
import * as os from 'os';
import { MESSAGE } from 'triple-beam';
import { format, info } from 'winston';
import { BaseError } from '../BaseError';

export const lineFormat = format((input: any) => {
  const stringifiedRest = jsonStringify(
    {
      ...input,
      level: undefined,
      message: undefined,
      splat: undefined,
    },
    null,
    2,
  );

  const padding = (input.padding && input.padding[input.level]) || '';
  if (stringifiedRest !== '{}') {
    // eslint-disable-next-line
    input[MESSAGE] = `${input.level}:${padding} ${input.message}${padding} ${stringifiedRest} `;
  } else {
    // eslint-disable-next-line
    input[MESSAGE] = `${input.level}:${padding} ${input.message}${padding} `;
  }

  return input;
});

// Quick and dirty fix for Winston@3.0.0 issue with errors
// @see {https://github.com/winstonjs/winston/issues/1338}
export const enumerateErrorFormat = format((input: any) => {
  if (input.message instanceof BaseError) {
    return {
      message: input.message.message,
      stack: input.message.stack,
      ...input.message,
    };
  }

  if (input.message instanceof Error) {
    return {
      message: input.message.message,
      stack: input.message.stack,
      ...input.message,
    };
  }

  if (input instanceof BaseError) {
    return {
      message: input.message,
      stack: input.stack,
      ...input,
    };
  }

  if (input instanceof Error) {
    return {
      message: input.message,
      stack: input.stack,
      ...input,
    };
  }

  return input;
});

export const winstonLevelToSentryLevel = {
  silly: 'debug',
  verbose: 'debug',
  input: 'input',
  debug: 'debug',
  warn: 'warning',
  error: 'error',
  default: info,
};

export const prepareSentryMeta = (input: { level: string; tags: any; message: any }): Sentry.Event | Error => {
  // eslint-disable-next-line
  const { level, tags, modules, platform = os.platform(), server_name = os.hostname(), ...extra }: any = { ...input };

  let stack: string | undefined;

  // Generate mocked stack for objects
  if (input.level !== 'error') {
    const event = new Error(input.message);
    event.name = input.level;
    // eslint-disable-next-line
    stack = event.stack;
  }

  const result = {
    modules,
    // eslint-disable-next-line
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
    message: input.message.message || input.message,
    level: winstonLevelToSentryLevel[input.level],
  };

  return result;
};
