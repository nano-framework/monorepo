import * as request from 'supertest';
import { Server, BaseRequest, BaseResponse, Get, BaseController } from '../lib';
import * as  getPort from 'get-port';

class TestServer extends Server {
}

class TestController extends BaseController {
  @Get('/echo')
  public static echo(req: BaseRequest, res: BaseResponse) {
    res.json({ body: req.body })
  }
}


describe('api.MainServer', () => {
  it('should not respond on an invalid port', async () => {
    const server = new TestServer({ port: -1 });
    await expect(server.start()).rejects.toThrow(/Received -1/ig);
  });

  it('should respond to a simple status request', async () => {
    // Construct server with a random available port
    const server = new TestServer({
      port: await getPort(),
      children: [new TestController()]
    });

    // Start server and perform a simple 404 request
    await server.start();
    await request(server.express).get('/').expect(404);
    await request(server.express).get('/echo').expect(200);
    await server.stop();
  });
});
