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

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──
app.use(
  cors({
    origin: [process.env.CLIENT_URL || 'http://localhost:5173', 'http://localhost:5173'],
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
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`SchemeMatch API server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
