import { Logger } from '@nano/errors';
import * as getPort from 'get-port';
import 'reflect-metadata';
import * as request from 'supertest';
import { Controller, Get, Query, RequestComponent, RouterComponent, Server, Injectable } from '../../lib';

Logger.initialize();

class TestQuery {
  public message: string = 'test';
}

class TestServer extends Server {}

@Controller()
class TestController {
  @Get('/echo/primitive')
  public async echoPrimitive(@Query() query: any) {
    return query;
  }

  @Get('/echo')
  public async echoBody(@Query() query: TestQuery) {
    return query;
  }
}

describe('lib.server.decorators.Query', () => {
  let server: Server;

  beforeEach(async () => {
    server = new TestServer({
      port: await getPort(),
      children: [new RequestComponent(), new RouterComponent({ controllers: [TestController] })],
    });

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
      .get('/echo')
      .query({})
      .expect(200, { message: 'test' });
  });

  it('should respond to a simple GET request with promitive query', async () => {
    await request(server.express)
      .get('/echo/primitive')
      .query({ message: 'test123' })
      .expect(200, { message: 'test123' });
  });
});
