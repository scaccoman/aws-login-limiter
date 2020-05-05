'use strict';

// DUMMY COGNITO CLASS
module.exports = class {
  login(email, password) {
    // validate email and password against cognito
    if (email !== 'davide@example.com' || password !== 'Password1') {
      throw new Error('Incorrect Username or Password');
    };

    return true;
  }

  logout(token) {
    // validate token
    return true;
  }
}