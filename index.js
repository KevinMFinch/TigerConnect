const express = require('express');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

// Put API endpoints under '/api' (will likely be refactored to be more modular in other files
app.get('/api/message', (req, res) => {
  // Send back a message from the API
  var num = Math.random();
  res.json({
    message: `Hello, your number from the express API is ${num}`
  });
  console.log('Sent a number');
});

// The 'catchall' handler: for any request that doesn't match one above, send back React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
