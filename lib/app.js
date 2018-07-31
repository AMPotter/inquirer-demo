const express = require('express');
const app = express();
const errorHandler = require('./utils/error-handler');
const morgan = require('morgan');
const checkAuth = require('./utils/check-auth');

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static('./public'));

const user = require('./routes/user');
const auth = require('./routes/auth');

app.use('/api/auth', auth);
app.use('/api/user', checkAuth(), user);

app.use(errorHandler());

module.exports = app;