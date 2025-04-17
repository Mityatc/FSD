const express = require('express');
const path = require('path');
const { exec } = require('child_process');
const app = express();

// Function to build the Angular application
function buildAngularApp() {
  return new Promise((resolve, reject) => {
    console.log('Building Angular application...');
    exec('npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error('Build failed:', error);
        reject(error);
        return;
      }
      console.log('Build completed successfully');
      resolve();
    });
  });
}

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist/publicity-frontend')));

// Handle all routes by serving index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/publicity-frontend/index.html'), (err) => {
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