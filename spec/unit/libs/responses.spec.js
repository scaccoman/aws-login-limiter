'use strict'

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const expect = require('chai').expect;

const responses = require('../../../libs/responses');

describe('Responses', function () {
  it('Success works without custom status code', done => {
    const res = responses.success('success');
    expect(res.statusCode).to.equal(200);
    done();
  })

  it('Success works with custom status code', done => {
    const res = responses.success('success', 201);
    expect(res.statusCode).to.equal(201);
    done();
  })

  it('Success errors when no data is provided', done => {
    try {
      responses.success();
    } catch (err) {
      expect(err.message).to.equal('I do not have data to return, please supply');
    }
    
    done();
  })

  it('Error works', done => {
    const res = responses.error();
    expect(res.statusCode).to.equal(400);
    done();
  })

  it('Error works with custom status code', done => {
    const res = responses.error({ statusCode: 404 });
    expect(res.statusCode).to.equal(404);
    done();
  })
})