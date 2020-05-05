'use strict'

const { 
  redis,
  sessionLimit,
  expiration,
  secret,
  streamKeySecret
} = require('../libs/config')();

const { v1 } = require('uuid');
const jwt = require('jsonwebtoken');
const redisAsync = require('async-redis');
const client = redisAsync.createClient(redis);

const validate = require('../libs/schemas/authenticate');
const responses = require('../libs/responses');
const keygen = require('../libs/keygen');

module.exports = async event => {
  try {
    if (event.body || !event.headers) {
      throw new Error('Payload validation error');
    };

    const token = event.headers.authorization || event.headers.Authorization;
    
    const { email } = jwt.verify(token, secret);

    const params = keygen.getAllKeys(email, sessionLimit);
    const matches = (await client.mget(...params)).filter(Boolean);
    if (matches.length >= sessionLimit) throw new Error('Session limit reached');
    
    const key = keygen.getNewKey(email, matches, sessionLimit);
    const streamKey = jwt.sign({ key }, streamKeySecret, { expiresIn: expiration });
    
    await client.set(key, streamKey, 'EX', expiration);

    const response = {
      id: v1(),
      timestamp: new Date().getTime(),
      streamKey
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
