var _ = require('lodash');

/**
 * @mehod camelCaseByChar
 * @param {String} char
 * @param {String} text
 * @returns {String}
 */
function camelCaseByChar(char, text) {
  var tokens = text.split(char).map(function(token, index) {
    if (index === 0) {
      return token[0].toLowerCase() + token.substring(1);
    } else {
      return token[0].toUpperCase() + token.substring(1);
    }
  });

  return tokens.join('');
}

/**
 * @method camelCase
 * @param {String} text
 * @returns {String}
 */
function camelCase(text) {
  text = camelCaseByChar('-', text);
  text = camelCaseByChar('_', text);

  return text;
}

/**
 * @method getPathToMethodName
 * @param {String} method
 * @param {String} path
 * @returns {String}
 */
function getPathToMethodName(method, path) {
  var segments = path.split('/').slice(1);
  var result;

  segments = _.transform(segments, function(result, segment) {
    if (segment[0] === '{' && segment[segment.length - 1] === '}') {
      segment = 'by' + segment[1].toUpperCase() + segment.substring(2, segment.length - 1);
    }

    result.push(segment);
  });

  result = camelCase(segments.join('-'));

  return method.toLowerCase() + result[0].toUpperCase() + result.substring(1);
}

function decorateParameter(swaggerVersion, parameter) {
  var checkedParameter = swaggerVersion === 'v1' ? 'paramType' : 'in';
  var formName = swaggerVersion === 'v1' ? 'form' : 'formData';

  parameter.camelCaseName = camelCase(parameter.name);

  if (parameter.enum && parameter.enum.length === 1) {
    parameter.isSingleton = true;
    parameter.singleton = parameter.enum[0];
  }

  if (parameter[checkedParameter] === 'body') {
    parameter.isBodyParameter = true;
  } else if (parameter[checkedParameter] === 'path') {
    parameter.isPathParameter = true;
  } else if (parameter[checkedParameter] === 'query') {
    if (parameter.pattern) {
      parameter.isPatternType = true;
    }

    parameter.isQueryParameter = true;
  } else if (parameter[checkedParameter] === 'header') {
    parameter.isHeaderParameter = true;
  } else if (parameter[checkedParameter] === formName) {
    parameter.isFormParameter = true;
  }

  return parameter;
}

module.exports.camelCase = camelCase;
module.exports.getPathToMethodName = getPathToMethodName;
module.exports.decorateParameter = decorateParameter;
