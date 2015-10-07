var _ = require('lodash');
var helper = require('./helper');

/**
 * @method getView
 * @param {Object} opts
 * @returns {Object} data
 */
function getView(opts) {
  var swagger = opts.swagger;
  var data = {
    isNode: opts.type === 'node',
    description: swagger.description,
    moduleName: opts.moduleName,
    className: opts.className,
    domain: swagger.basePath || ''
  };

  data.methods = _.chain(swagger.apis)
    .map(function(api) {
      return _.map(api.operations, function(op) {
        op.parameters = _.map(op.parameters || [], function (parameter) {
          return helper.decorateParameter('v1', parameter);
        });

        return {
          path: api.path,
          className: opts.className,
          methodName: op.nickname,
          method: op.method,
          isGET: op.method === 'GET',
          summary: op.summary,
          parameters: op.parameters
        };
      });
    })
    .flatten()
    .value();

  return data;
}

module.exports.getView = getView;
