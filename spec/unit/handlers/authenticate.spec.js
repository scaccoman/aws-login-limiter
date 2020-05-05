'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const sinon = require('sinon');
const expect = require('chai').expect;

let proxyquire = require('proxyquire');

const handler = '../../../handlers/authenticate.js';

describe('Authenticate handler', function () {

  beforeEach(() => {
    process.env.NODE_ENV = 'dev';
  });

  it('all methods should be called', async done => {
    const mget = sinon.stub().resolves(['1', '2']);
    const set = sinon.stub().resolves(true);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      mget,
      set,
      quit
    });
    const redisAsync = {
      createClient
    }

    const verify = sinon.stub().returns(true);
    const sign = sinon.stub().returns('signedToken');
    const keygen = {
      getAllKeys: sinon.stub().returns(['1', '2']),
      getNewKey: sinon.stub().returns(true)
    }

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify, sign },
      '../libs/keygen': keygen
    });
    
    const resp = await Handler({ headers: { authorization: '' } });
    expect(resp.statusCode).to.equal(200);
    expect(createClient.calledOnce).to.equal(true);
    expect(mget.calledOnce).to.equal(true);
    expect(set.calledOnce).to.equal(true);
    expect(quit.calledOnce).to.equal(true);
    expect(verify.calledOnce).to.equal(true);
    expect(sign.calledOnce).to.equal(true);
    expect(keygen.getAllKeys.calledOnce).to.equal(true);
    expect(keygen.getNewKey.calledOnce).to.equal(true);
    done();
  });

  it('throw error if payload is provided', async done => {
    const mget = sinon.stub().resolves(['1', '2']);
    const set = sinon.stub().resolves(true);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      mget,
      set,
      quit
    });
    const redisAsync = {
      createClient
    }

    const verify = sinon.stub().returns(true);
    const sign = sinon.stub().returns('signedToken');
    const keygen = {
      getAllKeys: sinon.stub().returns(['1', '2']),
      getNewKey: sinon.stub().returns(true)
    }

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify, sign },
      '../libs/keygen': keygen
    });
    
    const resp = await Handler({ body: '' });
    expect(resp.statusCode).to.equal(400);
    expect(createClient.calledOnce).to.equal(true);
    expect(mget.called).to.equal(false);
    expect(set.called).to.equal(false);
    expect(quit.calledOnce).to.equal(true);
    expect(verify.called).to.equal(false);
    expect(sign.called).to.equal(false);
    expect(keygen.getAllKeys.called).to.equal(false);
    expect(keygen.getNewKey.called).to.equal(false);
    done();
  });

  it('throw error if token is not valid', async done => {
    const mget = sinon.stub().resolves(['1', '2']);
    const set = sinon.stub().resolves(true);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      mget,
      set,
      quit
    });
    const redisAsync = {
      createClient
    }

    const verify = sinon.stub().throws(true);
    const sign = sinon.stub().returns('signedToken');
    const keygen = {
      getAllKeys: sinon.stub().returns(['1', '2']),
      getNewKey: sinon.stub().returns(true)
    }

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify, sign },
      '../libs/keygen': keygen
    });
    
    const resp = await Handler({ headers: { authorization: '' } });
    expect(resp.statusCode).to.equal(400);
    expect(createClient.calledOnce).to.equal(true);
    expect(mget.called).to.equal(false);
    expect(set.called).to.equal(false);
    expect(quit.calledOnce).to.equal(true);
    expect(verify.calledOnce).to.equal(true);
    expect(sign.called).to.equal(false);
    expect(keygen.getAllKeys.called).to.equal(false);
    expect(keygen.getNewKey.called).to.equal(false);
    done();
  });

  it('throw error if session limit has been exceeded', async done => {
    const mget = sinon.stub().resolves(['1', '2', '3']);
    const set = sinon.stub().resolves(true);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      mget,
      set,
      quit
    });
    const redisAsync = {
      createClient
    }

    const verify = sinon.stub().returns(true);
    const sign = sinon.stub().returns('signedToken');
    const keygen = {
      getAllKeys: sinon.stub().returns(['1', '2']),
      getNewKey: sinon.stub().returns(true)
    }

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify, sign },
      '../libs/keygen': keygen
    });
    
    const resp = await Handler({ headers: { authorization: '' } });
    expect(resp.statusCode).to.equal(400);
    expect(createClient.calledOnce).to.equal(true);
    expect(mget.calledOnce).to.equal(true);
    expect(set.called).to.equal(false);
    expect(quit.calledOnce).to.equal(true);
    expect(verify.calledOnce).to.equal(true);
    expect(sign.called).to.equal(false);
    expect(keygen.getAllKeys.calledOnce).to.equal(true);
    expect(keygen.getNewKey.called).to.equal(false);
    done();
  });

  it('throw error if response payload validation fails', async done => {
    const mget = sinon.stub().resolves(['1', '2']);
    const set = sinon.stub().resolves(true);
    const quit = sinon.stub().resolves(true);
    const createClient = sinon.stub().returns({
      mget,
      set,
      quit
    });
    const redisAsync = {
      createClient
    }

    const verify = sinon.stub().returns(true);
    const sign = sinon.stub().returns(123);
    const keygen = {
      getAllKeys: sinon.stub().returns(['1', '2']),
      getNewKey: sinon.stub().returns(true)
    }

    const Handler = proxyquire(handler, {
      'async-redis': redisAsync,
      'jsonwebtoken': { verify, sign },
      '../libs/keygen': keygen
    });
    
    const resp = await Handler({ headers: { authorization: '' } });
    expect(resp.statusCode).to.equal(400);
    expect(createClient.calledOnce).to.equal(true);
    expect(mget.calledOnce).to.equal(true);
    expect(set.calledOnce).to.equal(true);
    expect(quit.calledOnce).to.equal(true);
    expect(verify.calledOnce).to.equal(true);
    expect(sign.calledOnce).to.equal(true);
    expect(keygen.getAllKeys.calledOnce).to.equal(true);
    expect(keygen.getNewKey.calledOnce).to.equal(true);
    done();
  });
})
