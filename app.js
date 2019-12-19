require("dotenv").config();

const fetch = require('node-fetch');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// app.get("/", async (req, res, next ) => {
//   const locKey = process.env.LOCATION_KEY;
//   res.render("index", {title: "Weather app", locKey})
// });

app.get("/", async (req, res, next) => {
  const locKey = process.env.LOCATION_KEY;
  const ipAddress = req.ip;
  const myIp = '125.164.182.147';
  const locResponse = await fetch(`http://api.ipstack.com/${req.ip}?access_key=${locKey}`);
  // const locResponse = await fetch(`http://api.ipstack.com/${myIp}?access_key=${locKey}`);
  const location = await locResponse.json();

  const weatherKey = process.env.WEATHER_KEY;
  const response = await fetch(`http://api.weatherstack.com/current?access_key=${weatherKey}&query=${location.city}`);
  const weather = await response.json();

  res.render("index", {title: "Weather app", weather, location, locKey });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.set("trust proxy", true);

module.exports = app;
