'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const expect = require('chai').expect;

describe('Config', function () {
  it('Config Dev properties', done => {
    process.env.NODE_ENV = 'dev';
    const config = require('../../../libs/config')();
    expect(config.stage).to.equal('dev');
    done();
  });

  it('Config Prod properties', done => {
    process.env.NODE_ENV = 'prod';
    const config = require('../../../libs/config')();
    expect(config.stage).to.equal('prod');
    done();
  });

  it('Config default properties', done => {
    delete process.env.NODE_ENV;
    const config = require('../../../libs/config')();
    expect(config.stage).to.equal('dev');
    done();
  });
})