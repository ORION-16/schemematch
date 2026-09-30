const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const schemesRouter = require('./routes/schemes');
const profilesRouter = require('./routes/profiles');
const errorHandler = require('./middleware/errorHandler');
const cron = require('node-cron');
const importSchemes = require('./data/importSchemes');

const app = express();
const PORT = process.env.PORT || 5000;
const isDevelopment = process.env.NODE_ENV !== 'production';
const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isAllowedOrigin = (origin) => {
  // Requests such as health checks and the same-origin production app do not
  // include an Origin header.
  if (!origin || configuredOrigins.includes(origin)) return true;

  // Vite moves to the next available port when 5173 is occupied. Accept local
  // development servers without opening CORS to arbitrary production origins.
  return isDevelopment && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin);
};

// ── Middleware ──
app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests, please try again later.' },
  })
);
app.use(morgan('dev'));
app.use(express.json());

// ── Routes ──
app.use('/api/schemes', schemesRouter);
app.use('/api/profiles', profilesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'SchemeMatch API is running' });
});

// ── Serve React Frontend (Production) ──
// Serve static client files from the React build directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route to serve index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

// ── Error Handler ──
app.use(errorHandler);

// ── Database & Server ──
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Auto-seed if empty
    const Scheme = require('./models/Scheme');
    const count = await Scheme.countDocuments();
    if (count === 0) {
      console.log('Database empty. Auto-seeding initial schemes...');
      try {
        const { schemes } = require('./data/seedSchemes'); 
        await Scheme.insertMany(schemes);
        console.log('Auto-seed complete.');
      } catch (err) {
        console.error('Auto-seed failed:', err.message);
      }
    }

    // Schedule weekly scraping job
    // Runs every Sunday at midnight
    cron.schedule('0 0 * * 0', () => {
      console.log('Running weekly scheme sync...');
      importSchemes();
    });
    console.log('Cron job scheduled: Weekly scheme sync.');

    app.listen(PORT, () => {
      console.log(`SchemeMatch API server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
