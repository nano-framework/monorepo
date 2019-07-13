import * as getPort from 'get-port';
import * as request from 'supertest';
import { Server } from '../../lib';

describe('lib.server.middlewares.legacyParams', () => {
  it('should match the value in a GET param', async () => {
    // Initialize a simple server
    const server = new Server({ port: await getPort() });
    await server.start();
    server.express.get('/test', (req, res) => res.json({ value: req.param('value') }));

    // Perform a simple request to get a 200 response
    await request(server.express)
      .get('/test')
      .query({ value: 'ok' })
      .expect('Content-Type', /json/)
      .expect(200, { value: 'ok' });

    await server.stop();
  });

  it('should match the value in a URI param', async () => {
    // Initialize a simple server
    const server = new Server({ port: await getPort() });
    await server.start();
    server.express.get('/test/:value', (req, res) => res.json({ value: req.param('value') }));

    // Perform a simple request to get a 200 response
    await request(server.express)
      .get('/test/ok')
      .expect('Content-Type', /json/)
      .expect(200, { value: 'ok' });

    await server.stop();
  });

  it('should match the value the request body as JSON', async () => {
    // Initialize a simple server
    const server = new Server({ port: await getPort() });
    await server.start();
    server.express.post('/test', (req, res) => res.json({ value: req.param('value') }));

    // Perform a simple request to get a 200 response
    await request(server.express)
      .post('/test')
      .send({ value: 'ok' })
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { value: 'ok' });

    await server.stop();
  });

  it('should match the value the request body as Urlencoded', async () => {
    // Initialize a simple server
    const server = new Server({ port: await getPort() });
    await server.start();
    server.express.post('/test', (req, res) => res.json({ value: req.param('value') }));

    // Perform a simple request to get a 200 response
    await request(server.express)
      .post('/test')
      .send({ value: 'ok' })
      .set('Content-Type', 'application/x-www-form-urlencoded')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { value: 'ok' });

    await server.stop();
  });
});
