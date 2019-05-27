import { Server } from '../lib';

const server = new Server({ port: 3000 });

server
  .listen()
  .then(() => console.log('Server started successfully at port 3000'));