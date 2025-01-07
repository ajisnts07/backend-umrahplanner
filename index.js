const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('./configs/database.config');
const port = require('./configs/server.config');

dotenv.config({
  path: './config.env',
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: 'Internal Server Error',
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
