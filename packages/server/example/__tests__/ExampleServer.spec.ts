import * as getPort from 'get-port';
import 'reflect-metadata';
import * as request from 'supertest';
import { ExampleServer } from '../api';
import { Server } from '../api/lib';

describe('lib.server.examples.ExampleServer', () => {
  let server: Server;

  describe('with started server', () => {
    beforeEach(async () => {
      server = new ExampleServer({ port: await getPort() });
      await server.start();
    });

    afterEach(async () => {
      if (server) {
        await server.stop();
        server = undefined;
      }
    });

    it('should respond to a simple GET request', async () => {
      await request(server.express)
        .get('/hello')
        .query({ name: 'John Doe' })
        .expect(200, { message: 'Hello John Doe!' });
    });
  });
});
