import 'reflect-metadata';
import { PasswordGenerator } from '../app';

const cmd = new PasswordGenerator();

cmd.start().catch((error: Error) => {
  cmd.logger.error(error);
  process.exit(1);
});
