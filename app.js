var morgan = require('morgan');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var flash = require('express-flash');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var loki = require('lokijs');

var passport = require('passport');
var app = express();

var userCollection, canvasCollection;

var db = new loki('keycanvas.json', {
  autoload: true,
  autoloadCallback: loadHandler
});

function loadHandler() {
  console.log('handler');
  userCollection = db.getCollection('user');
  canvasCollection = db.getCollection('canvasDocument');
  if (userCollection == null) {
    userCollection = db.addCollection('user', {indices:['email']});
  }
  if (canvasCollection == null) {
    canvasCollection = db.addCollection('canvasDocument', {indices:['userId','name']});
  }
  db.saveDatabase();  
  
  var users = require('./models/user')(db);
  var canvasDocuments = require('./models/canvasDocument')(db);

  //userCollection.insert(new users.user('nel.jpj@gmail.com', 'Hannes', 'Nel', 'password'));
  //db.saveDatabase();
  
  require('./config/passport')(passport, users);

  app.use(cookieParser('K3yC@nvA$'));

  app.use(expressSession({
      secret : 'K3yC@nvA$',
      resave : true,
      saveUninitialized : false,
      cookie : {
        maxAge : 60000 * 24 * 365
      }
    }));

  app.use(flash());
  app.use(passport.initialize());
  app.use(passport.session());

  var routes = require('./routes/routes')(passport, users, canvasDocuments);

  app.use(morgan('dev'));
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
      extended : true
    }));
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', routes);

  // catch 404 and forward to error handler
  app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message : err.message,
        error : err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message : err.message,
      error : {}
    });
  });
}

module.exports = app;