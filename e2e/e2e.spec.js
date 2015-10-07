var fs = require('fs');
var path = require('path');
var util = require('util');

var nock = require('nock');
var expect = require('chai').expect;

var swaggity = require('../');
var swaggerDocs = require(path.join(__dirname, 'test.json'));

describe('e2e', function() {

  var testApi;
  var token = 'testToken';

  before(function() {
    var source = swaggity.getCode(swaggerDocs, {
      type: 'node',
      moduleName: 'testServer',
      className: 'TestServer',
      indentSize: 2,
      skipMethods: ['OPTIONS'],
      authorization: ['user']
    });
    fs.writeFileSync('./e2e/test-api.js', source);
    var api = require('./test-api');
    testApi = new api.TestServer();
    testApi.token = {
      value: token
    };
  });

  after(function () {
    fs.unlinkSync('./e2e/test-api.js');
  });

  it('POST /user', function() {
    expect(testApi.createUser).to.be.ok;

    var userData = {
      name: 'test',
      email: 'test@rstck.com'
    };

    nock('http://risingstack.com/v2')
      .post('/user', userData)
      .reply(201);

    testApi.createUser({
      body: userData
    });

  });

  it('OPTIONS /user', function() {
    // because of excluded methods
    expect(testApi.getOptions).to.be.not.ok;
  });

  it('GET /user/{userId}', function() {
    expect(testApi.getUserById).to.be.ok;

    var userId = 'abcdef12345';

    nock('http://risingstack.com/v2')
      .matchHeader('Authorization', util.format('Bearer %s', token))
      .get('/user/' + userId)
      .reply(200);

    testApi.getUserById({
      userId: userId
    });
  });

  it('PUT /user/{userId}', function() {
    expect(testApi.updateUser).to.be.ok;

    var userId = 'abcdef12345';

    nock('http://risingstack.com/v2')
      .matchHeader('Authorization', util.format('Bearer %s', token))
      .matchHeader('Content-Type', 'application/x-www-form-urlencoded')
      .put('/user/' + userId, 'name=test&email=email')
      .reply(200);

    testApi.updateUser({
      userId: userId,
      name: 'test',
      email: 'email'
    });
  });

  it('DELETE /user/{userId}', function() {
    // because of authorizations level
    expect(testApi.deleteUser).to.be.not.ok;
  });

});
