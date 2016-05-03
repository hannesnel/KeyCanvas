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

	passport.use('local-login', new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
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

        console.log(user);
        if (!user.isValidPassword(password)) {
          return done(null, false, req.flash('message', 'Incorrect password.'));
        }

        return done(null, user);
      });
		}));
};
