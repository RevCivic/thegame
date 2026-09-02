const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

const PORT = process.env.PORT || 3000;

// Rate limiter middleware for static files
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/health';
  }
});

// Apply rate limiter to all requests
app.use(limiter);

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Health check endpoint (not rate limited)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve index.html for any request not matching a file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Pull of War game server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Gracefully shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Gracefully shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
