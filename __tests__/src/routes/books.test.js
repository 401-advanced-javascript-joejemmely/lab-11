'use strict';

const server = require('../../../src/app.js').server;
const supergoose = require('../../supergoose.js');

const mockRequest = supergoose.server(server);

describe('Books route', () => {
  it('can\'t access /books without auth', () => {
    return mockRequest.get('/books').then(results => {
      expect(results.status).toEqual(401);
    });
  });
  it('can\'t access /books:id without auth', () => {
    return mockRequest.get('/books/1').then(results => {
      expect(results.status).toEqual(401);
    });
  });
});
