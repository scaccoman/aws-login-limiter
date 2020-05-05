const Ajv = require('ajv')
const ajv = new Ajv()
module.exports = {
  response: ajv.compile(require('./response'))
}