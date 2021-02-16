import { Logger } from '@nano/errors';

export const logger = Logger.initialize({ level: process.env.LOG_LEVEL });
