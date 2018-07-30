const express = require('express');
const app = express();
const errorHandler = require('./utils/error-handler');
const morgan = require('morgan');
const checkAuth = require('./utils/check-auth');

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));

app.use(errorHandler());

module.exports = app;