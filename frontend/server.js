const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');
const app = express();

// Function to build the Angular application
function buildAngularApp() {
  return new Promise((resolve, reject) => {
    console.log('Building Angular application...');
    console.log('Current working directory:', process.cwd());
    
    // First, ensure the dist directory exists
    const distPath = path.join(process.cwd(), 'dist', 'publicity-frontend');
    if (!fs.existsSync(distPath)) {
      fs.mkdirSync(distPath, { recursive: true });
    }

    // Run npm install first to ensure all dependencies are available
    exec('npm install', (installError) => {
      if (installError) {
        console.error('npm install failed:', installError);
        reject(installError);
        return;
      }

      console.log('npm install completed successfully');
      
      // Now run the build
      exec('npm run build', (buildError, stdout, stderr) => {
        if (buildError) {
          console.error('Build failed:', buildError);
          reject(buildError);
          return;
        }
        console.log('Build completed successfully');
        console.log('Build output:', stdout);
        console.log('Build errors:', stderr);
        
        // Verify the build output
        const indexPath = path.join(distPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          console.log('index.html exists at:', indexPath);
          console.log('Build directory contents:', fs.readdirSync(distPath));
        } else {
          console.error('index.html not found at:', indexPath);
          console.log('Directory contents:', fs.readdirSync(distPath));
          reject(new Error('Build failed - index.html not found'));
          return;
        }
        
        resolve();
      });
    });
  });
}

// Serve static files from the dist directory
const staticPath = path.join(process.cwd(), 'dist', 'publicity-frontend');
console.log('Serving static files from:', staticPath);

// Verify the static directory exists
if (!fs.existsSync(staticPath)) {
  console.error('Static directory not found:', staticPath);
  process.exit(1);
}

app.use(express.static(staticPath));

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

// Start the server
const port = process.env.PORT || 8080;

// Build the application before starting the server
buildAngularApp()
  .then(() => {
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
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  }); 