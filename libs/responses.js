'use strict'

module.exports = {
  success: (data, code) => {

    if (!data) {
      throw new Error('I do not have data to return, please supply')
    }

    return {
      statusCode: code ? code : 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_URL || '*'
      },
      body: JSON.stringify(data)
    }
  },

  error: err => {
    err = err || null

    console.error(err)

    return {
      statusCode: err && err.statusCode ? err.statusCode : 400,
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_URL || '*'
      },
      body: JSON.stringify({
        'message': err && err.message ? err.message : err,
        'errors': err && err.errors ? err.errors : null
      })
    }
  }
}