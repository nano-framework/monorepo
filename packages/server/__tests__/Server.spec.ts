import * as getPort from 'get-port';
import 'reflect-metadata';
import * as request from 'supertest';
import { Body, Controller, Get, Post, Query, RouterComponent, Res, Server, RequestComponent } from '../lib';

class TestServer extends Server {}

@Controller()
class TestController {
  @Get('/echo')
  public async echo(@Query() query: any) {
    return query;
  }

  @Post('/echo')
  public async echoBody(@Body() body: any) {
    return body;
  }

  @Post('/echo/text')
  public async echoText(@Res() res) {
    return res
      .status(200)
      .set('Content-type', 'plain/text')
      .send('test');
  }
}

describe('lib.server.Server', () => {
  let server: Server;

  describe('with invalid server', () => {
    beforeEach(async () => {
      server = new TestServer({ port: -1 });
    });

    it('should not respond on an invalid port', async () => {
      await expect(server.start()).rejects.toThrow(/Received -1/gi);
    });
  });

  describe('with started server', () => {
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
        .query({ test: '123' })
        .expect(200, { test: '123' });
    });

    it('should respond to a simple POST request', async () => {
      await request(server.express)
        .post('/echo')
        .send({ test: 123 })
        .expect(200, { test: 123 });
    });
    it('should respond to a simple GET request with a plain text response', async () => {
      const response = await request(server.express)
        .post('/echo/text')
        .expect(200, 'test');

      expect(response.header).toHaveProperty('content-type');
      expect(response.header['content-type'].startsWith('plain/text')).toBeTruthy();
    });
  });
});
