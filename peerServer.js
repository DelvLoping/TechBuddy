import { createServer } from 'http';
import express from 'express';
import cors from 'cors';
import { ExpressPeerServer } from 'peer';
import http from 'http';

const app = express();

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true
});

app.use('/peer', peerServer);

server.listen(9000, (err) => {
  if (err) throw err;
  console.log('> Ready on http://localhost:9000');
});
