// Import express module
const express = require('express');
const app = express();

// Define a port (Render automatically assigns a port using environment variable)
const port = process.env.PORT || 3000;

// Define a basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server and listen on the assigned port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});