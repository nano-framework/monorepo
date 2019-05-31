import * as request from 'supertest';
import { Server } from '../lib';
import * as  getPort from 'get-port';


describe('api.MainServer', () => {
  it('should respond to a simple status request', async () => {
    // Construct server with a random available port
    const server = new Server({ port: await getPort() });

    // Start server and perform a simple 404 request
    await server.start();
    await request(server.express).get('/').expect(404);
    await server.stop();
  });

  it('should not respond on an invalid port', async () => {
    const server = new Server({ port: -1 });
    await expect(server.start()).rejects.toThrow(/Received -1/ig);
  });
});
