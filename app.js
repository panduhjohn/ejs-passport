const createError = require('http-errors');
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport')
const chalk = require('chalk')
const flash = require('connect-flash')
const session = require('express-session');
const mongoose = require('mongoose');
let mongoStore = require('connect-mongo')(session);

require('dotenv').config()

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//! MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => {
        console.log(chalk.cyan('MongoDB Connected'));
    })
    .catch(err => console.log(`MongoDB error ${err}`));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        resave: true,
        saveUninitialized: true,
        secret: process.env.SESSION_SECRET,
        store: new mongoStore({
            url: process.env.MONGO_URI,
            mongooseConnection: mongoose.connection,
            autoReconnect: true
        }),
        cookie: {
            secure: false,
            maxAge: 6000000
        }
    })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.errors = req.flash('errorMessage');
    res.locals.success = req.flash('successMessage');
    next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
