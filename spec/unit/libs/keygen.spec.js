'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));
const expect = require('chai').expect;

const keygen = require('../../../libs/keygen');
const limit = Math.floor(Math.random() * 10) + 1;

describe('keygen', function () {
  it('getAllKeys should work', async done => {
    const keys = keygen.getAllKeys('davide@example.com', limit);
    expect(keys.length).to.equal(limit);
    done();
  });

  it('getNewKey should work', async done => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJrZXkiOiJkYXZpZGUzQGV4YW1wbGUuY29tOjIiLCJpYXQiOjE1ODg2NzYzNjEsImV4cCI6MTU4ODY4MzU2MX0.aakkDQZptk7132dO5JwmYemMH7bc2qqtfrjoCbYP8o0';
    const newKey = keygen.getNewKey('davide@example.com', [token], limit);
    expect(newKey).to.equal('davide@example.com:1');
    done();
  });
})