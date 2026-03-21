require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const logger = require('./utils/logger');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1. Enforce HTTPS & secure headers
app.use(helmet());

// 2. Cross-Origin validation (allow only our Vite frontend to authenticate)
const allowedOrigins = [
  'http://localhost:5173', 
  'http://127.0.0.1:5173'
];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Allow HTTP-Only cookies to be sent back and forth
}));

// 3. Request parsing
app.use(express.json());
app.use(cookieParser());

// 4. Rate limiting to prevent brute force / token stuffing on authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many authentication requests, please try again later.' }
});

// 5. Mount Routes
// Apply the rate limiter strictly to authorization functions
app.use('/api/auth', authLimiter, authRoutes);

// Simple healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date() });
});

// Start Server
app.listen(PORT, () => {
  logger.info(`YUKTI Secure Backend is running proudly on http://localhost:${PORT}`);
});

module.exports = app; // For testing framework
