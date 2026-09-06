require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { isCloudinaryConfigured } = require('./config/cloudinary');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { ok } = require('./utils/response');

const app = express();

// --- Core middleware -------------------------------------------------------
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin / curl / server-to-server requests (no Origin header).
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// --- Routes ----------------------------------------------------------------
app.get('/api/health', (req, res) =>
  ok(res, {
    message: 'Daynote API is running',
    data: { uptime: process.uptime(), imageUpload: isCloudinaryConfigured },
  })
);

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/journals', require('./routes/journalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.use(notFound);
app.use(errorHandler);

// --- Start -----------------------------------------------------------------
const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Daynote API listening on http://localhost:${PORT}`);
      if (!isCloudinaryConfigured) {
        console.log('Cloudinary is not configured - image uploads are disabled (everything else works).');
      }
    });
  } catch (err) {
    console.error('Failed to start the server:', err.message);
    process.exit(1);
  }
};

start();

module.exports = app;
