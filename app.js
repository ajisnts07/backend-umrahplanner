const express = require('express');
const path = require('path');
const app = express();
require('dotenv').config({ path: './config.env' });
const url = process.env.URL;

// initialize middlewares
const cors = require('./middlewares/cors.middleware');
const json = require('./middlewares/json.middleware');

// initialize routes
const hotelRoute = require('./routes/hotel.route');
const airlineRoute = require('./routes/airline.route');
const visaRoute = require('./routes/visa.route');
const laRoute = require('./routes/la.route');
const settingRoute = require('./routes/setting.route');
const calculateRoute = require('./routes/calculate.route');

// middleware
app.use(cors);
app.use(json);

// route
app.get('/', (req, res) => {
  res.send('Hello from Express!');
});
app.use(`${url}/hotels`, hotelRoute);
app.use(`${url}/airlines`, airlineRoute);
app.use(`${url}/visas`, visaRoute);
app.use(`${url}/las`, laRoute);
app.use(`${url}/settings`, settingRoute);
app.use(`${url}/calculates`, calculateRoute);

module.exports = app;
