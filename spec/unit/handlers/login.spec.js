'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const sinon = require('sinon');
const expect = require('chai').expect;

let proxyquire = require('proxyquire');

const handler = '../../../handlers/login.js';

describe('Login handler', function () {
  let valid, invalid;

  beforeEach(() => {
    process.env.NODE_ENV = 'dev';
    valid = require('../../mocks/login/valid');
    invalid = require('../../mocks/login/invalid');
  });

  it('all methods should be called', async done => {
    const login = sinon.stub().returns(true);
    const Cognito = function () {
      this.login = () => login();
    };

    const Handler = proxyquire(handler, {
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler({ body: JSON.stringify(valid) });
    expect(resp.statusCode).to.equal(200);
    expect(login.calledOnce).to.equal(true);
    done();
  });

  it('throw error if no payload is provided', async done => {
    const login = sinon.stub().returns(true);
    const Cognito = function () {
      this.login = () => login();
    };

    const Handler = proxyquire(handler, {
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler({ body: null });
    expect(resp.statusCode).to.equal(400);
    expect(login.calledOnce).to.equal(false);
    done();
  });

  it('the payload validation should fail', async done => {
    const login = sinon.stub().returns(true);
    const Cognito = function () {
      this.login = () => login();
    };

    const Handler = proxyquire(handler, {
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler({ body: JSON.stringify({ email: 'abcdef' }) });
    expect(resp.statusCode).to.equal(400);
    expect(login.calledOnce).to.equal(false);
    done();
  });

  it('the login should not work if the credentials are wrong', async done => {
    const login = sinon.stub().throws(true);
    const Cognito = function () {
      this.login = () => login();
    };

    const Handler = proxyquire(handler, {
      '../libs/Cognito': Cognito
    });
    
    const resp = await Handler({ body: JSON.stringify(invalid) });
    expect(resp.statusCode).to.equal(400);
    expect(login.calledOnce).to.equal(true);
    done();
  });
})
