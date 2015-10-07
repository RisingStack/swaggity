var expect = require('chai').expect;
var swaggerV1 = require('./swaggerV1');

describe('swaggerV1', function() {
  it('should return correct data', function() {
    var opts = {
      swagger: {
        description: 'desc',
        basePath: 'basePath',
        apis: [{
          path: '/test',
          operations: [{
            nickname: 'testGet',
            method: 'GET',
            summary: 'tests the api',
            parameters: [{
              name: 'Parameter-name1',
              paramType: 'body'
            }, {
              name: 'Parameter-name2',
              paramType: 'path'
            }]
          }, {
            nickname: 'testPost',
            method: 'POST',
            summary: 'tests the api',
            parameters: [{
              name: 'Parameter-name',
              paramType: 'header'
            }]
          }]
        }]
      },
      type: 'test',
      moduleName: 'testModule',
      className: 'testClass'
    };

    var result = swaggerV1.getView(opts);

    expect(result).to.eql({
      isNode: false,
      description: 'desc',
      moduleName: 'testModule',
      className: 'testClass',
      domain: 'basePath',
      methods: [{
        path: '/test',
        className: 'testClass',
        methodName: 'testGet',
        method: 'GET',
        isGET: true,
        summary: 'tests the api',
        parameters: [{
          name: 'Parameter-name1',
          paramType: 'body',
          camelCaseName: 'parameterName1',
          isBodyParameter: true
        }, {
          name: 'Parameter-name2',
          paramType: 'path',
          camelCaseName: 'parameterName2',
          isPathParameter: true
        }]
      }, {
        path: '/test',
        className: 'testClass',
        methodName: 'testPost',
        method: 'POST',
        isGET: false,
        summary: 'tests the api',
        parameters: [{
          name: 'Parameter-name',
          paramType: 'header',
          camelCaseName: 'parameterName',
          isHeaderParameter: true
        }]
      }]
    });
  });

});
