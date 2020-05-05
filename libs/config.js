'use strict'

module.exports = () => {

  const stage = process.env.NODE_ENV || 'dev'

  return {
    api: 'APIAuth',
    stage: stage,
    sessionLimit: 3,
    secret: process.env.SECRET,
    streamKeySecret: process.env.SECRET, // this secret should actually be different
    expiration: 60 * 60 * 2, // 2 hours
    redis: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD
    }
  }
}