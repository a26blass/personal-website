var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var fs = require('fs'),
    http = require('http'),
    https = require('https'),
    express = require('express');

var httpsPort = 443;
var httpPort = 80;

var options = {
    key: fs.readFileSync(__dirname + '/ssl/privatekey.key'),
    cert: fs.readFileSync(__dirname + '/ssl/certificate.crt'),
};

// HTTPS server
var server = https.createServer(options, app).listen(httpsPort, function(){
    console.log("HTTPS Server listening on port: " + httpsPort);
});

// HTTP Server redirects to HTTPS
var httpServer = http.createServer(function(req, res) {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

module.exports = app;