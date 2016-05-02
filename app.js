var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var expressSession = require('express-session');
var loki = require('lokijs');

var db = new loki('keycanvas.json');

var userCollection = db.addCollection('user','email');
var canvasCollection = db.addCollection('canvasDocument');
db.saveDatabase();

var users = require('./models/user')(db);
var canvasDocuments = require('./models/canvasDocument')(db);

var passport = require('passport'), 
    LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  function(email, password, done) {
    users.getByEmail(email, function(err, user){
      if (err) { 
        return done(err); 
      }
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    });
  }
));

var app = express();

app.use(expressSession({
  secret: 'K3yC@nvA$',
  resave: true,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

var routes = require('./routes/index')(passport, users, canvasDocuments);

app.use(flash());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

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
