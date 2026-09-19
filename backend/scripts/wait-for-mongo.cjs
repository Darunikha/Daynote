/**
 * Blocks until MongoDB accepts connections on 127.0.0.1:27017 (or gives up
 * after 60s), so the API doesn't crash when it boots before `npm run mongo`
 * has finished starting mongod.
 */
const net = require('net');

const HOST = '127.0.0.1';
const PORT = 27017;
const TIMEOUT_MS = 60000;
const started = Date.now();

const attempt = () => {
  const socket = net.createConnection({ host: HOST, port: PORT });
  socket.once('connect', () => {
    socket.destroy();
    process.exit(0);
  });
  socket.once('error', () => {
    socket.destroy();
    if (Date.now() - started > TIMEOUT_MS) {
      console.error(`MongoDB did not come up on ${HOST}:${PORT} within 60s.`);
      process.exit(1);
    }
    setTimeout(attempt, 500);
  });
};

attempt();
