var bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(8);

module.exports = function(loki) {
  function user(email,firstname,lastname, password) {
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
    
  function encryptPassword(passowrd) {
    var hash = bcrypt.hashSync(passowrd, salt);
    return hash;
  }
  
  function authenticate(email,password) {
    return true;
  }
  
  function getByEmail(email) {
    return new user('nel.jpj@gmail.com', 'Hannes', 'Nel');
  }
  
  return {
    user: user,
    getByEmail: getByEmail,
    authenticate: authenticate 
  };
};