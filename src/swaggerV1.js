var helper = require('./helper');

/**
 * @method getView
 * @param {Object} opts
 * @param {String} type
 * @returns {Object} data
 */
function getView (opts){
  var swagger = opts.swagger;
  var data = {
    isNode: opts.type === 'node',
    description: swagger.description,
    moduleName: opts.moduleName,
    className: opts.className,
    domain: swagger.basePath ? swagger.basePath : '',
    methods: []
  };

  swagger.apis.forEach(function(api){
    api.operations.forEach(function(op){
      var method = {
        path: api.path,
        className: opts.className,
        methodName: op.nickname,
        method: op.method,
        isGET: op.method === 'GET',
        summary: op.summary,
        parameters: op.parameters
      };

      op.parameters = op.parameters ? op.parameters : [];

      op.parameters.forEach(function(parameter) {
        parameter.camelCaseName = helper.camelCase(parameter.name);
        if(parameter.enum && parameter.enum.length === 1) {
          parameter.isSingleton = true;
          parameter.singleton = parameter.enum[0];
        }
        if(parameter.paramType === 'body'){
          parameter.isBodyParameter = true;
        } else if(parameter.paramType === 'path'){
          parameter.isPathParameter = true;
        } else if(parameter.paramType === 'query'){
          if(parameter.pattern){
            parameter.isPatternType = true;
          }

          parameter.isQueryParameter = true;
        } else if(parameter.paramType === 'header'){
          parameter.isHeaderParameter = true;
        } else if(parameter.paramType === 'form'){
          parameter.isFormParameter = true;
        }
      });
      data.methods.push(method);
    });
  });

  return data;
}

module.exports.getView = getView;
