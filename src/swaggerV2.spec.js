var expect = require('chai').expect;
var swaggerV2 = require('./swaggerV2');

describe('swaggerV2', function() {
  it('should return correct data', function() {
    var opts = {
      swagger: {
        info: {
          description: 'desc',
        },
        securityDefinitions: [{}],
        host: 'www.test.com',
        basePath: '/basePath',
        schemes: ['http'],
        paths: {
          '/test': {
            'GET': {
              description: 'desc',
              security: '',
              tags: ['test'],
              parameters: [{
                name: 'Parameter-name1',
                in : 'header'
              }, {
                name: 'Parameter-name2',
                in : 'path'
              }]
            }
          },
          '/other': {
            'POST': {
              description: 'desc',
              security: '',
              tags: ['test', 'other'],
              parameters: [{
                name: 'Parameter-name',
                in : 'body'
              }]
            }
          }
        }
      },
      type: 'test',
      moduleName: 'testModule',
      className: 'testClass'
    };

    var result = swaggerV2.getView(opts);

    expect(result).to.eql({
      isNode: false,
      description: 'desc',
      moduleName: 'testModule',
      className: 'testClass',
      domain: 'http://www.test.com/basePath',
      isSecure: false,
      methods: [{
        path: '/test',
        authorization: '',
        className: 'testClass',
        methodName: 'getTest',
        resource: 'test',
        method: 'GET',
        isSecure: false,
        isGET: true,
        tags: ['test'],
        summary: 'desc',
        parameters: [{
          name: 'Parameter-name1',
          in: 'header',
          camelCaseName: 'parameterName1',
          isHeaderParameter: true
        }, {
          name: 'Parameter-name2',
          in: 'path',
          camelCaseName: 'parameterName2',
          isPathParameter: true
        }]
      }, {
        path: '/other',
        authorization: '',
        className: 'testClass',
        methodName: 'postOther',
        tags: ['test', 'other'],
        method: 'POST',
        isGET: false,
        summary: 'desc',
        isSecure: false,
        resource: 'other',
        parameters: [{
          name: 'Parameter-name',
          in: 'body',
          camelCaseName: 'parameterName',
          isBodyParameter: true
        }]
      }]
    });
  });

});
