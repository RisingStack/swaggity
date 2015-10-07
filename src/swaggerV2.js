var util = require('util');
var _ = require('lodash');
var helper = require('./helper');

var AUTHORIZED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK',
  'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

/**
 * @method getView
 * @param {Object} opts
 * @returns {Object} data
 */
function getView(opts) {
  var swagger = opts.swagger;
  var data = {
    isNode: opts.type === 'node',
    description: swagger.info.description,
    isSecure: swagger.securityDefinitions && !!swagger.securityDefinitions.api_key,
    moduleName: opts.moduleName,
    className: opts.className,
    domain: (swagger.schemes && swagger.schemes.length > 0 && swagger.host && swagger.basePath) ?
      util.format('%s://%s%s', swagger.schemes[0], swagger.host, swagger.basePath) : ''
  };

  data.methods = _.chain(swagger.paths)
    .map(function (api, path) {
      var globalParams = _.filter(api, function(operation, method) {
        if (method.toLowerCase() === 'parameters') {
          return operation;
        }
      });

      return _.map(api, function(operation, method) {
        if (AUTHORIZED_METHODS.indexOf(method.toUpperCase()) === -1) {
          return;
        }

        var auth = _.find(operation.security, 'authorization');

        var _data = {
          path: path,
          className: opts.className,
          methodName: operation['x-swagger-js-method-name'] ?
            operation['x-swagger-js-method-name'] : (operation.operationId ?
              operation.operationId : helper.getPathToMethodName(method, path)),
          method: method.toUpperCase(),
          isGET: method.toUpperCase() === 'GET',
          summary: operation.description,
          isSecure: !!_.find(operation.security, 'api_key'),
          parameters: [],
          tags: operation.tags,
          authorization: auth ? auth.authorization : '',
          resource: helper.camelCase(path.split('/')[1]),
        };

        var params = [];

        if (_.isArray(operation.parameters)) {
          params = operation.parameters;
        }

        params = params.concat(globalParams);

        _data.parameters = _.map(params, function(parameter) {

          if (_.isString(parameter.$ref)) {
            var segments = parameter.$ref.split('/');
            parameter = swagger.parameters[segments[2] || segments[0]];
          }

          return helper.decorateParameter('v2', parameter);
        });

        return _data;
      });
    })
    .flatten()
    .value();

  return data;
}

module.exports.getView = getView;
