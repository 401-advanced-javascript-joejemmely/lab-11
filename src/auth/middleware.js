'use strict';

/**
 * @module
 */

const User = require('./users-model.js');

module.exports = (req, res, next) => {
  try {
    let [type, encodedString] = req.headers.authorization.split(' ');
    type = type.toLowerCase();

    switch (('test', type)) {
    case 'basic':
      return _authBasic(encodedString);
    default:
      return _authError();
    }
  } catch (error) {
    return _authError();
  }

  /**
   * Decode username and password from encodedString
   * @param {*} encodedString
   */
  function _authBasic(encodedString) {
    const base64Buffer = Buffer.from(encodedString, 'base64');
    const decodedString = base64Buffer.toString();
    const [username, password] = decodedString.split(':');

    const authData = { username, password };

    return User.authenticateBasic(authData).then(user => _authenticate(user));
  }

  /**
   * Check the user and generate a token
   * @param {*} user
   */
  function _authenticate(user) {
    if (user) {
      req.user = user;
      req.token = user.generateToken();
      return next();
    } else {
      return _authError();
    }
  }

  /**
   * Pass the error to the errorHandler
   */
  function _authError() {
    next({
      status: 401,
      statusMessage: 'Unauthorized',
      message: 'Invalid User ID/Password',
    });
  }
};
