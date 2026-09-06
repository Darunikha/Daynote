/**
 * Convenience script for local development ONLY.
 *
 * Starts a real MongoDB Community Server process on 127.0.0.1:27017 (the
 * host/port this project's .env.example points at), storing data
 * persistently under backend/.mongodb-data so nothing is lost between
 * restarts.
 *
 * This does NOT change how the app talks to MongoDB - it's purely a way to
 * get a real local mongod running without installing MongoDB as a system
 * service or admin rights. If you already have MongoDB installed/running,
 * or you use MongoDB Atlas, you don't need this at all - just set
 * MONGO_URI in backend/.env and skip this script.
 *
 * Usage (from backend/):  npm run mongo
 */
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
    console.log(`MongoDB is already listening on ${HOST}:${PORT} - nothing to do.`);
    process.exit(0);
  }

  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.mkdirSync(LOG_DIR, { recursive: true });

  console.log('Locating the MongoDB binary (downloads once, then reused)...');
  const mongodPath = await MongoBinary.getPath({});

  console.log(`Starting MongoDB at ${HOST}:${PORT}`);
  console.log(`Data directory: ${DB_DIR}`);

  const child = spawn(
    mongodPath,
    ['--dbpath', DB_DIR, '--logpath', LOG_FILE, '--port', String(PORT), '--bind_ip', HOST],
    { detached: true, stdio: 'ignore' }
  );
  child.unref();

  for (let i = 0; i < 30; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await isPortOpen(HOST, PORT)) {
      console.log('MongoDB is up. You can now run: npm run dev');
      process.exit(0);
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((r) => setTimeout(r, 500));
  }

  console.error('MongoDB did not come up in time. Check backend/.mongodb-data/log/mongod.log');
  process.exit(1);
})();
