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

    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error('Build failed:', error);
        reject(error);
        return;
      }
      console.log('Build completed successfully');
      console.log('Build output:', stdout);
      console.log('Build errors:', stderr);
      
      // Verify the build output
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        console.log('index.html exists at:', indexPath);
      } else {
        console.error('index.html not found at:', indexPath);
        console.log('Directory contents:', fs.readdirSync(distPath));
      }
      
      resolve();
    });
  });
}

// Serve static files from the dist directory
const staticPath = path.join(process.cwd(), 'dist', 'publicity-frontend');
console.log('Serving static files from:', staticPath);
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
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  }); 