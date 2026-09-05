const express = require('express');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Security: Rate limiter middleware for all requests
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

// Security: Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Only set HSTS header when running over HTTPS or in production
  if (req.secure || NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Serve static files from the current directory
app.use(express.static(path.join(__dirname)));

// Health check endpoint (not rate limited)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve index.html for any request not matching a file
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Pull of War game server running on http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
});

// Graceful shutdown helper
const gracefulShutdown = (reason = 'SIGTERM') => {
  console.log(`${reason} received. Gracefully shutting down...`);
  
  // Force exit after 30 seconds to prevent hanging
  const forceExitTimeout = setTimeout(() => {
    console.error('Forced exit due to shutdown timeout');
    process.exit(reason === 'uncaught exception' ? 1 : 0);
  }, 30000);
  // Don't keep the event loop alive waiting for this timeout
  forceExitTimeout.unref();
  
  server.close(() => {
    clearTimeout(forceExitTimeout);
    console.log('Server closed');
    process.exit(reason === 'uncaught exception' ? 1 : 0);
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  gracefulShutdown('uncaught exception');
});

module.exports = app;
