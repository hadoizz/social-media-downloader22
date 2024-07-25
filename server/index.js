const express = require('express');
const app = express();
const proxy = require('./proxy');

app.use('/proxy', proxy);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
