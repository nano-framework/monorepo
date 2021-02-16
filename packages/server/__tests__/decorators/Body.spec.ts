import * as getPort from 'get-port';
import 'reflect-metadata';
import * as request from 'supertest';
import { Logger } from '@nano/errors';
import { Body, Controller, Post, RequestComponent, RouterComponent, Server } from '../../lib';

Logger.initialize();

class TestBody {
  public message: string = 'test';
}

class TestServer extends Server {}

@Controller()
class TestController {
  @Post('/echo/primitive')
  public async echoPrimitive(@Body() body: any) {
    return body;
  }

  @Post('/echo')
  public async echoBody(@Body() body: TestBody) {
    return body;
  }
}

describe('lib.server.Server.decorators.Body', () => {
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

  it('should respond to a simple POST request', async () => {
    await request(server.express)
      .post('/echo')
      .send({})
      .expect(200, { message: 'test' });
  });

  it('should respond to a simple POST request with a primitive body', async () => {
    await request(server.express)
      .post('/echo/primitive')
      .send({ message: 'test123' })
      .expect(200, { message: 'test123' });
  });
});
