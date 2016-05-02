var express = require('express');
var router = express.Router();

module.exports = function(passport, users, canvasDocuments) {
  var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    else
      res.redirect('/login');
  }
  
  router.get('/', isAuthenticated, function(req, res, next) {
    res.render('index', { title: 'KeyCanvas' });
  });
  
  router.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true
	}));

  router.get('/login', function(req, res, next) {
    res.render('login', { message: req.flash('message') });
  });

  router.post('/savecanvas', function(req, res, next) {
    
  });
  
  return router;
};