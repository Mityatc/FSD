const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const helmet = require('helmet');
const app = express();

// Enable security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// Enable compression
app.use(compression());

// Serve static files from the dist directory
const staticPath = path.join(process.cwd(), 'dist', 'publicity-frontend');
console.log('Serving static files from:', staticPath);

// Verify the static directory exists
if (!fs.existsSync(staticPath)) {
  console.error('Static directory not found:', staticPath);
  process.exit(1);
}

// Set cache control for static assets
app.use(express.static(staticPath, {
  maxAge: '1y',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  console.log('Attempting to serve index.html from:', indexPath);
  
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    console.log('Directory contents:', fs.readdirSync(staticPath));
    res.status(500).send('Error loading the application. Please try again later.');
    return;
  }

  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('Error serving index.html:', err);
      res.status(500).send('Error loading the application. Please try again later.');
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
const port = process.env.PORT || 8080;

const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log('Server is listening on all network interfaces');
  console.log('Static files directory:', staticPath);
  console.log('Directory contents:', fs.readdirSync(staticPath));
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
}); 