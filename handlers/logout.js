'use strict'

const { secret, streamKeySecret, redis } = require('../libs/config')();

const { v1 } = require('uuid');
const jwt = require('jsonwebtoken');
const redisAsync = require("async-redis");
const client = redisAsync.createClient(redis);

const Cognito = require('../libs/Cognito');
const cognito = new Cognito();
const validate = require('../libs/schemas/logout');
const responses = require('../libs/responses');

module.exports = async event => {
  try {
    if (!event.body) event.body = '{}';

    const body = JSON.parse(event.body);
    if (!validate.request(body)) {
      throw new Error(JSON.stringify(validate.request.errors));
    };

    const token = event.headers.authorization || event.headers.Authorization;

    const { email } = jwt.verify(token, secret);
    
    // DUMMY LOGOUT
    cognito.logout(token);

    // Attempt to remove streamKey sessions from cache
    if (body.streamKey) {
      try {
        const { key } = jwt.verify(body.streamKey, streamKeySecret);
        if (key.split(':')[0] !== email) {
          throw new Error('Stream Key and Authorization token do NOT match')
        }
  
        const cachedStreamKey = await client.get(key);
        if (cachedStreamKey === body.streamKey) {
          await client.del(key);
        }
      } catch(err) {
        if (err && err.message !== 'invalid signature') {
          throw err
        }
      }
    }

    const response = {
      id: v1(),
      timestamp: new Date().getTime()
    };

    if (!validate.response(response)) {
      throw new Error(JSON.stringify(validate.response.errors));
    };
    
    return responses.success(response);
  } catch (err) {
    return responses.error(err);
  } finally {
    await client.quit();
  };
};
