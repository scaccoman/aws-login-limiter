const Ajv = require('ajv')
const ajv = new Ajv()
module.exports = {
  request: ajv.compile(require('./request')),
  response: ajv.compile(require('./response'))
}