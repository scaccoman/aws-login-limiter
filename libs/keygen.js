'use strict';

const jwt = require('jsonwebtoken')

module.exports.getAllKeys = (email, limit) => {
  let params = [];
  for (let i = 1; i <= limit; i++) {
    params.push(`${email}:${i}`);
  };
  return params;
}

module.exports.getNewKey = (email, tokens, limit) => {
  const numbers = tokens.map(token => {
    const { key } = jwt.decode(token);
    return Number(key.split(':')[1]);
  });
  
  const range = Array.from(Array(limit), (v, i) => i + 1)
  var [newNumber] = range.filter(i => !numbers.includes(i));
  return `${email}:${newNumber}`;
}