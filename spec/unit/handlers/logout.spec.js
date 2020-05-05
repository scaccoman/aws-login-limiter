'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const sinon = require('sinon');
const expect = require('chai').expect;

let proxyquire = require('proxyquire');

const handler = '../../../handlers/logout.js';

describe('Logout handler', function () {

  beforeEach(() => {
    process.env.NODE_ENV = 'dev';
  });

  it('all methods should be called', async done => {
    const streamKey = 'somestreamkey'
    const get = sinon.stub().resolves(streamKey);
    const del = sinon.stub().resolves(1);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      get,
      del,
      quit
    });
    const redisAsync = {
      createClient
    }

    const logout = sinon.stub().returns(true);
    const Cognito = function () {
      this.logout = () => logout();
    };

    const verify = sinon.stub()
      .onFirstCall().returns({ email: 'test@example' })
      .onSecondCall().returns({ key: 'test@example:1' })

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify },
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler(
      { headers: { authorization: '' },
      body: `{"streamKey": "${streamKey}"}`
    });
    expect(resp.statusCode).to.equal(200);
    expect(createClient.calledOnce).to.equal(true);
    expect(get.calledOnce).to.equal(true);
    expect(del.calledOnce).to.equal(true);
    expect(quit.calledOnce).to.equal(true);
    expect(logout.calledOnce).to.equal(true);
    expect(verify.calledTwice).to.equal(true);
    done();
  });

  it('throw error if payload validation fails', async done => {
    const streamKey = 'somestreamkey'
    const get = sinon.stub().resolves(streamKey);
    const del = sinon.stub().resolves(1);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      get,
      del,
      quit
    });
    const redisAsync = {
      createClient
    }

    const logout = sinon.stub().returns(true);
    const Cognito = function () {
      this.logout = () => logout();
    };

    const verify = sinon.stub()
      .onFirstCall().returns({ email: 'test@example' })
      .onSecondCall().returns({ key: 'test@example:1' })

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify },
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler(
      { headers: { authorization: '' },
      body: `{"randomKey": "randomValue"}`
    });
    expect(resp.statusCode).to.equal(400);
    expect(createClient.calledOnce).to.equal(true);
    expect(get.calledOnce).to.equal(false);
    expect(del.calledOnce).to.equal(false);
    expect(quit.calledOnce).to.equal(true);
    expect(logout.calledOnce).to.equal(false);
    expect(verify.calledTwice).to.equal(false);
    done();
  });

  it('throw error if token is not valid', async done => {
    const streamKey = 'somestreamkey'
    const get = sinon.stub().resolves(streamKey);
    const del = sinon.stub().resolves(1);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      get,
      del,
      quit
    });
    const redisAsync = {
      createClient
    }

    const logout = sinon.stub().returns(true);
    const Cognito = function () {
      this.logout = () => logout();
    };

    const verify = sinon.stub()
      .onFirstCall().throws('error')
      .onSecondCall().returns({ key: 'test@example:1' })

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify },
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler(
      { headers: { authorization: '' },
      body: `{"streamKey": "${streamKey}"}`
    });
    expect(resp.statusCode).to.equal(400);
    expect(createClient.calledOnce).to.equal(true);
    expect(get.calledOnce).to.equal(false);
    expect(del.calledOnce).to.equal(false);
    expect(quit.calledOnce).to.equal(true);
    expect(logout.calledOnce).to.equal(false);
    expect(verify.calledOnce).to.equal(true);
    done();
  });

  it('throw error if auth token and stream key email do not match', async done => {
    const streamKey = 'somestreamkey'
    const get = sinon.stub().resolves(streamKey);
    const del = sinon.stub().resolves(1);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      get,
      del,
      quit
    });
    const redisAsync = {
      createClient
    }

    const logout = sinon.stub().returns(true);
    const Cognito = function () {
      this.logout = () => logout();
    };

    const verify = sinon.stub()
      .onFirstCall().returns({ email: 'test@example' })
      .onSecondCall().returns({ key: 'test2@example:1' })

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify },
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler(
      { headers: { authorization: '' },
      body: `{"streamKey": "${streamKey}"}`
    });
    expect(resp.statusCode).to.equal(400);
    expect(createClient.calledOnce).to.equal(true);
    expect(get.calledOnce).to.equal(false);
    expect(del.calledOnce).to.equal(false);
    expect(quit.calledOnce).to.equal(true);
    expect(logout.calledOnce).to.equal(true);
    expect(verify.calledTwice).to.equal(true);
    done();
  });
})
