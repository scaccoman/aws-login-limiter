'use strict'

const expect = require('chai').expect

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'))

const handler = require(process.cwd() + '/handler')

describe('Handler', () => {

  it ('Handler definitions', () => {
    expect(handler).to.have.property('authenticate')
    expect(handler).to.have.property('logout')
    expect(handler).to.have.property('login')
  })
})