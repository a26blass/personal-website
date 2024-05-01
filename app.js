// Default services are defined below
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// Custom services are defined below
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "mail.privateemail.com",
  port: 465,
  secure: true,
  auth: {
    user: "alexblass@alexblass.me",
    pass: process.env.EMAIL_PASSWORD,
  },
});

var app = express();

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

// Start the HTTP server
var httpPort = 8080;
app.listen(httpPort, function() {
  console.log("HTTP Server listening on port: " + httpPort);
});

// POST request handler for form submission
app.post('/submit', function(req, res) {
  var name = req.body.name; // Get name from form data
  var email = req.body.email; // Get email from form data
  var message = req.body.message; // Get message from form data

  console.log('New Message:: ' + name + ' :: ' + email + ' :: ' + message)

  const mailOptions = {
    from: "alexblass@alexblass.me",
    to: "alexblass.me@gmail.com",
    subject: "New Message From " + email,
    text: "Name: " + name + "\n" + message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
    
  // Render the page with the confirmation message
  res.render('index', { title: 'Form Submitted!', confirmation: 'Form submitted successfully!', submitted: true });
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

// Handle SIGTERM 
process.on('SIGTERM', () => {
  console.info('Received SIGTERM signal');
  
  // Perform cleanup tasks here

  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

module.exports = app;