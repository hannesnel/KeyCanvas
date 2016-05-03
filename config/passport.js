var LocalStrategy = require('passport-local').Strategy;

module.exports = function (passport, users) {
	passport.serializeUser(function (user, done) {
		done(null, user.email);
	});

	passport.deserializeUser(function (email, done) {
		users.getByEmail(email, function (err, user) {
      done(err, user);
		});
	});

  passport.use('local-register',new LocalStrategy({
    usernameField: 'email',
    passwordField:'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    process.nextTick(function() {
      users.getByEmail(email, function (err, user) {
        if(err) {
          done(err);
        }
        
        if(user) {
          return done(null, false, req.flash('message', 'A user with that email already exist'));
        }
        console.log(req.body);
        if(password!=req.body.repeatPassword) {
          return done(null, false, req.flash('message','Passwords do not match'));
        }
        
        users.createUser(new users.user(email,req.body.firstname,req.body.lastname,password),function(newUser) {
          done(null,newUser);
        });
      });
    });
  }));

	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
      passReqToCallback: true
		},
    function (req, email, password, done) {
      users.getByEmail(email, function (err, user) {
        if (err) {
          return done(err);
        }

        if (!user) {
          return done(null, false, req.flash('message', 'Incorrect username.'));
        }

        if (!user.isValidPassword(password)) {
          return done(null, false, req.flash('message', 'Incorrect password.'));
        }

        return done(null, user);
      });
		}));
};
