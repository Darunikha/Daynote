const net = require('net');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');
const { MongoBinary } = require('mongodb-memory-server-core');

const HOST = '127.0.0.1';
const PORT = 27017;
const DB_DIR = path.join(__dirname, '..', '.mongodb-data', 'db');
const LOG_DIR = path.join(__dirname, '..', '.mongodb-data', 'log');
const LOG_FILE = path.join(LOG_DIR, 'mongod.log');

const isPortOpen = (host, port) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ host, port });
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('error', () => resolve(false));
  });

(async () => {
  if (await isPortOpen(HOST, PORT)) {
    console.log(`MongoDB is already listening on ${HOST}:${PORT}`);
    setInterval(() => {}, 10000);
    return;
  }

  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });

  const mongodPath = await MongoBinary.getPath({});

  console.log(`Starting MongoDB at ${HOST}:${PORT}...`);
  const child = spawn(
    mongodPath,
    ['--dbpath', DB_DIR, '--logpath', LOG_FILE, '--port', String(PORT), '--bind_ip', HOST],
    { stdio: 'inherit' }
  );

  child.on('exit', (code) => {
    console.log(`mongod exited with code ${code}`);
    process.exit(code || 0);
  });
})();
