'use strict'

const {
  expiration,
  secret
} = require('../libs/config')();

const { v1 } = require('uuid');
const jwt = require('jsonwebtoken');

const Cognito = require('../libs/Cognito');
const cognito = new Cognito();
const validate = require('../libs/schemas/login');
const responses = require('../libs/responses');

module.exports = async event => {
  try {
    if (!event.body) {
      throw new Error('Please provide a payload');
    };

    const body = JSON.parse(event.body);
    if (!validate.request(body)) {
      throw new Error(JSON.stringify(validate.request.errors));
    };

    // DUMMY EMAIL AND PASSWORD VALIDATION
    cognito.login(body.email, body.password);

    const token = jwt.sign({ email: body.email }, secret, { expiresIn: expiration });

    const response = {
      id: v1(),
      timestamp: new Date().getTime(),
      token
    };

    if (!validate.response(response)) {
      throw new Error(JSON.stringify(validate.response.errors));
    };
    
    return responses.success(response);
  } catch (err) {
    return responses.error(err);
  };
};
