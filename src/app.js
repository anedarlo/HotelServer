const express = require('express');
const path    = require('path');
const cookieParser = require('cookie-parser');
const logger  = require('morgan');

const app = express();

// Settings
app.set('port', 5000);

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));

app.use(express.static(path.join(__dirname, 'public')));

// 404 handler
app.use((req, res, next) => {
  res.status(404).render('404');
});

module.exports = app;