var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var vistaares = require('./routes/vistaares')
var app = express();

var csrf = require('csurf');
var csrfProtection = csrf({ cookie: true })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.VSESSIONID;
  if (cookie === undefined)
  {
  	console.log(cookie);
    // no: set a new cookie
    var randomNumber=Math.random().toString();
    randomNumber=randomNumber.substring(2,randomNumber.length);
    res.cookie('VSESSIONID',randomNumber, { maxAge: 900000, httpOnly: true });
    res.cookie('VISTAARAUTHTOKEN',randomNumber, { maxAge: 900000, httpOnly: true });
    res.cookie('CSRFTOKEN',randomNumber, { maxAge: 900000, httpOnly: true });
    console.log('cookie created successfully');
  } 
  else
  {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  } 
  next(); // <-- important!
});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// app.use('/',function(req, res){
//      var cookie = req.cookies.cookieName;
//   if (cookie === undefined)
//   {
//     // no: set a new cookie
//     var randomNumber=Math.random().toString();
//     randomNumber=randomNumber.substring(2,randomNumber.length);
//     res.cookie('VISTAARAUTHTOKEN',randomNumber, { maxAge: 900000, httpOnly: true });
//     console.log('cookie created successfully');
//   } 
//   else
//   {
//     // yes, cookie was already present 
//     console.log('cookie exists', cookie);
//   } 
//   next(); 
// });
// app.use(csrfProtection);
app.use('/VistaarES/Entity',vistaares);

app.use('/users', users);

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
