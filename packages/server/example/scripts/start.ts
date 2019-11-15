import { ExampleServer } from '../api';

export const server = new ExampleServer();

server.start().catch(error => {
  server.logger.error('Server crashed with unknown error', error);
  process.exit(1);
});
