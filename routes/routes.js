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
  
  router.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash : true
	}));
  
  router.get('/register',function(req, res, next) {
    res.render('register', {title: 'KeyCanvas', message: req.flash('message')});
  });
  
  router.post('/register',passport.authenticate('local-register',{
    successRedirect: '/login',
		failureRedirect: '/register',
		failureFlash : true
  }))

  router.get('/login', function(req, res, next) {
    res.render('login', { title:'KeyCanvas', message: req.flash('message') });
  });

  router.get('/getCanvasDocuments', isAuthenticated, function(req, res, next) {
    res.json(canvasDocuments.getCanvasDocumentsByUserId(req.user['$loki']));
  });
  
  router.get('/getCanvasByName/:name',isAuthenticated,function(req, res, next) {
    res.json(canvasDocuments.getCanvasByName(req.user['$loki'], req.params.name));
  });
  
  router.post('/savecanvas', isAuthenticated, function(req, res, next) {
    var obj = req.body;
    console.log(req.user['$loki']);
    var canvasDoc = new canvasDocuments.canvasDocument(
      req.user['$loki'],
      obj.name,
      obj.width,
      obj.height,
      obj.design);
    var newDoc = canvasDocuments.upsertCanvasDocument(canvasDoc);
    res.json({
      result: true,
      canvasDoc: newDoc
    });
  });
  
  return router;
};