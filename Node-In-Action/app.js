const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const logger = require('morgan');
const flash = require('connect-flash');

const indexRouter = require('./routes/index');
const weatherRouter = require('./routes/weather');
const randomRouter = require('./routes/random');
const usersRouter = require('./routes/users');
const config = require("config");
const mongoose = require('mongoose');
const app = express();

// initialize database connection
mongoose
    .connect(`mongodb+srv://${config.get('mongodb.atlas.username')}:${config.get('mongodb.atlas.password')}@${config.get('mongodb.atlas.hostname')}/?${config.get('mongodb.atlas.params')}`)
    .catch(error => console.log(error))
// mongodb+srv://shra012:xxxxxxx@hiruzen.ywqrahd.mongodb.net/?retryWrites=true&w=majority
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// non-essential middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'TKRv0$J%=HY@rvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/weather', weatherRouter);
app.use('/random', randomRouter);
app.use('/users', usersRouter);
app.get(/^\/users\/(\d+)$/, (req,res) => {
  const userId = parseInt(req.params[0]);
  res.send(`Got user with id ${userId}`);
})

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
  const status = err.status || 500;
  res.status(status);
  res.locals.status = status;
  res.render('error');
});

module.exports = app;
