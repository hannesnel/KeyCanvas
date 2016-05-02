var bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(8);

module.exports = function(db) {
  
  var users = db.getCollection("user");
  
  function user(email, firstname, lastname, password) {
    this.email = email;
    this.firstname = firstname;
    this.lastname = lastname;
    if(password && password.length>0) {
      this.hash = encryptPassword(password);
    }
    else {
      this.hash = null;
    }
  }
  
  user.prototype.isValidPassword = function(password) {
    return bcrypt.compareSync(password,this.hash);
  };
    
  function encryptPassword(passowrd) {
    var hash = bcrypt.hashSync(passowrd, salt);
    return hash;
  }
  
  function getByEmail(email, done) {
    var user = users.by('email',email);
    if(user==null) {
      done('user not found', null);
    }
    else {
      done(null, user);
    }
  }
  
  return {
    user: user,
    getByEmail: getByEmail
  };
};