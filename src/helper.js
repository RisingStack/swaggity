var _ = require('lodash');

/**
 * @method camelCase
 * @param {String} id
 * @returns {String}
 */
function camelCase (id) {
  var tokens = [];

  id.split('-').forEach(function(token, index){
    if(index === 0) {
      tokens.push(token[0].toLowerCase() + token.substring(1));
    } else {
      tokens.push(token[0].toUpperCase() + token.substring(1));
    }
  });

  return tokens.join('');
}

/**
 * @method getPathToMethodName
 * @param {String} method
 * @param {String} path
 * @returns {String}
 */
function getPathToMethodName (method, path){
  var segments = path.split('/').slice(1);
  var result;

  segments = _.transform(segments, function(result, segment){
    if(segment[0] === '{' && segment[segment.length - 1] === '}') {
      segment = 'by' + segment[1].toUpperCase() + segment.substring(2, segment.length - 1);
    }

    result.push(segment);
  });

  result = camelCase(segments.join('-'));

  return method.toLowerCase() + result[0].toUpperCase() + result.substring(1);
}

module.exports.camelCase = camelCase;
module.exports.getPathToMethodName = getPathToMethodName;
