const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from Frontend directory
app.use(express.static(path.join(__dirname, 'Frontend')));

// Handle SPA routing - serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Frontend', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Phinix Interior Website running at http://localhost:${PORT}`);
  console.log(`📁 Serving files from: ${path.join(__dirname, 'Frontend')}`);
});