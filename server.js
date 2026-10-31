import express from 'express';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// High-performance gzip/deflate compression
app.use(compression({
  threshold: 1024,
  level: 6,
}));

// Hardened Helmet Security with CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        mediaSrc: ["'self'", 'blob:', 'data:'],
        connectSrc: ["'self'", 'https://generativelanguage.googleapis.com', 'https://api.groq.com'],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Rate Limiting Protection against DDoS
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Health check endpoint for Cloud Run and Load Balancers
app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'SpendIntruders', timestamp: Date.now() });
});

// Cache immutable build assets for 1 year
app.use('/assets', express.static(path.join(__dirname, 'dist', 'assets'), {
  maxAge: '1y',
  immutable: true,
}));

// Serve other static assets from Vite dist directory
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1d',
  etag: true,
}));

// Fallback to index.html for client-side routing
app.get('*', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ SpendIntruders production server running on port ${PORT}`);
});

// Graceful SIGTERM & SIGINT termination for Cloud Run container scaling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server gracefully');
  server.close(() => {
    console.log('HTTP server closed cleanly');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    process.exit(0);
  });
});
