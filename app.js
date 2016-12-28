var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', function(req, res) {
  var date = new Date();
  var season = "Winter"
  //Japan has four television seasons: 
  //  Winter (January–March), 
  //  Spring (April–June), 
  //  Summer (July–September), 
  //  Fall (October–December).
  switch (date.getMonth()){
    case 3: case 4: case 5:
      season = "Spring";
    case 6: case 7: case 8:
      season = "Summer";
    case 9: case 10: case 11:
      season = "Fall";
  }
  res.render('index', {
    title: "Grani",
    season: season,
    year: date.getFullYear()
  });
});

app.use('/', function(req, res) {
  res.render()
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
