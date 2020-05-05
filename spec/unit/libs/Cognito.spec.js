'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));
const expect = require('chai').expect;

const Cognito = require('../../../libs/Cognito');

describe('Cognito', function () {
  let cognito;

  beforeEach(() => {
    cognito = new Cognito();
  });

  it('logging in should work', async done => {
    const value = cognito.login('davide@example.com', 'Password1');
    expect(value).to.be.true;
    done();
  });

  it('logging in should throw an error if the supplied credentials are incorrect', async done => {
    try {
      cognito.login('sometinwong@example.com', 'WrongPassword1');
    } catch(err) {
      expect(err.message).to.equal('Incorrect Username or Password');
    }
    done();
  });

  it('logging out should work', async done => {
    const value = cognito.logout('sometoken');
    expect(value).to.be.true;
    done();
  });
})