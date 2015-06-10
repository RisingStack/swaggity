var _ = require('lodash');
var helper = require('./helper');

var AUTHORIZED_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

/*
 * @method getView
 * @param {Object} opts
 * @returns {Object} data
 */
function getView (opts){
  var swagger = opts.swagger;
  var data = {
    isNode: opts.type === 'node',
    description: swagger.info.description,
    isSecure: swagger.securityDefinitions !== undefined,
    moduleName: opts.moduleName,
    className: opts.className,
    domain: (swagger.schemes && swagger.schemes.length > 0 && swagger.host && swagger.basePath) ? swagger.schemes[0] + '://' + swagger.host + swagger.basePath : '',
    methods: []
  };

  _.forEach(swagger.paths, function(api, path){
    var globalParams = [];
    _.forEach(api, function(op, m){
      if(m.toLowerCase() === 'parameters') {
        globalParams = op;
      }
    });

    _.forEach(api, function(op, m){
      if(AUTHORIZED_METHODS.indexOf(m.toUpperCase()) === -1) {
        return;
      }

      op.security = op.security || [];
      var authorization = (op.security[1] || {}).authorization;

      var method = {
        path: path,
        className: opts.className,
        methodName: op['x-swagger-js-method-name'] ? op['x-swagger-js-method-name'] : (op.operationId ? op.operationId : helper.getPathToMethodName(m, path)),
        method: m.toUpperCase(),
        isGET: m.toUpperCase() === 'GET',
        summary: op.description,
        isSecure: op.security !== undefined,
        parameters: [],
        tags: op.tags,
        authorization: authorization,
        resource: helper.camelCase(path.split('/')[1])
      };

      var params = [];

      if(_.isArray(op.parameters)) {
        params = op.parameters;
      }

      params = params.concat(globalParams);

      method.parameters = _.map(params, function(parameter) {

        if (_.isString(parameter.$ref)) {
          var segments = parameter.$ref.split('/');
          parameter = swagger.parameters[segments.length === 1 ? segments[0] : segments[2] ];
        }

        parameter.camelCaseName = helper.camelCase(parameter.name);

        if(parameter.enum && parameter.enum.length === 1) {
          parameter.isSingleton = true;
          parameter.singleton = parameter.enum[0];
        }

        if(parameter.in === 'body'){
            parameter.isBodyParameter = true;
        } else if(parameter.in === 'path'){
            parameter.isPathParameter = true;
        } else if(parameter.in === 'query'){
          if(parameter.pattern){
              parameter.isPatternType = true;
          }
          parameter.isQueryParameter = true;
        } else if(parameter.in === 'header'){
            parameter.isHeaderParameter = true;
        } else if(parameter.in === 'formData'){
            parameter.isFormParameter = true;
        }

        return parameter;
      });

      data.methods.push(method);
    });
  });

  return data;
}

module.exports.getView = getView;
