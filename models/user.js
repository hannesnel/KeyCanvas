var bcrypt = require('bcryptjs');

var salt = bcrypt.genSaltSync(8);

module.exports = function(db) {
  var users = db.getCollection('user');

  function user(email, firstname, lastname, clearPassword) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    if(clearPassword && clearPassword.length>0) {
      this.hash = encryptPassword(clearPassword);
    }
    else {
      this.hash = null;
    }
  }
  
  user.prototype.setHash = function(hash) {
    this.hash = hash;
  };
  
  user.prototype.isValidPassword = function(clearPassword) {
    return bcrypt.compareSync(clearPassword, this.hash);
  };
    
  function encryptPassword(clearPassword) {
    var hash = bcrypt.hashSync(clearPassword, salt);
    return hash;
  }
  
  function getByEmail(email, done) {
    console.log('getByEmail');
    var auser = users.findOne({'email': email});
    if(auser == null)
      return done(null, null);
    var nuser = new user(auser.email, auser.firstname, auser.lastname);
    nuser.setHash(auser.hash);
    done(null, nuser);
  }
  
  function createUser(user, done) {
    var newUser = users.insert(user);
    db.saveDatabase();
    done(newUser);
  }
  
  return {
    user: user,
    getByEmail: getByEmail,
    createUser: createUser
  };
};