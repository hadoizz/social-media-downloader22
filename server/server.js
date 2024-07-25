const express = require('express');
const path = require('path');
const app = express();
const proxyRouter = require('./proxy');

// Serve static files from the client directory (if applicable)
app.use(express.static(path.join(__dirname, '../client')));

// Use the proxy router for /proxy routes
app.use('/proxy', proxyRouter);

// Optional: Serve the main index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
