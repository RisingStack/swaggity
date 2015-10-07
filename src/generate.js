var path = require('path');
var fs = require('fs');

var callbackify = require('callbackify');
var request = require('superagent');
var Mustache = require('mustache');
var beautify = require('js-beautify');
var lint = require('jshint');
var _ = require('lodash');

var swaggerV1 = require('./swaggerV1');
var swaggerV2 = require('./swaggerV2');

/**
 * @method getCode
 * @param {Object} swagger
 * @param {Object} opts
 */
function getCode(swagger, opts) {
  var tpl;
  var method;
  var request;
  var source;

  opts.swagger = swagger;

  // For Swagger Specification version 2.0 value of field 'swagger' must be a string '2.0'
  var data = opts.swagger.swagger === '2.0' ? swaggerV2.getView(opts) : swaggerV1.getView(opts);

  if (!opts.type) {
    if (!_.isObject(opts.template) || !_.isString(opts.template.class) || !_.isString(opts.template.method) ||
      !_.isString(opts.template.request)) {
      throw new Error('Unprovided custom template. Please use the following template:' +
        ' template: { class: "...", method: "...", request: "..." }');
    }

    tpl = opts.template.class;
    method = opts.template.method;
    request = opts.template.request;
  } else {
    tpl = fs.readFileSync(path.resolve(__dirname, '../templates/', opts.type + '-class.mustache'), 'utf-8');
    method = fs.readFileSync(path.resolve(__dirname, '../templates/', opts.type + '-method.mustache'), 'utf-8');
    request = fs.readFileSync(path.resolve(__dirname, '../templates/', opts.type + '-request.mustache'), 'utf-8');
  }

  // Skip methods based on method type, for example: DELETE needed only for admin
  if (_.isArray(opts.skipMethods)) {
    data.methods = data.methods.filter(function(item) {
      return opts.skipMethods.indexOf(item.method) === -1;
    });
  }

  // Skip methods based on security
  if (_.isArray(opts.authorization)) {
    data.methods = data.methods.filter(function(item) {
      // no auth specified
      if (!_.isArray(item.authorization) || !item.authorization.length) {
        return true;
      }
      // auth match
      if (_.intersection(item.authorization, opts.authorization).length) {
        return true;
      }
      return false;
    });
  }

  // Generate source
  source = Mustache.render(tpl, data, {
    method: method,
    request: request
  });

  // Lint source
  lint.JSHINT(source, {
    node: opts.type === 'node' || !opts.type,
    browser: opts.type === 'angular' || !opts.type,
    undef: true,
    strict: true,
    trailing: true,
    smarttabs: true,
  });

  lint.JSHINT.errors.forEach(function(error) {
    if (error && error.code[0] === 'E') {
      throw new Error(lint.errors[0].reason + ' in ' + lint.errors[0].evidence);
    }
  });

  // Beautify source
  source = beautify.js_beautify(source, {
    indent_size: opts.indentSize || 2,
    max_preserve_newlines: 2,
  });

  return source;
}

/**
 * @method getCodeByUrl
 * @param {String} url
 * @param {Object} opts
 * @returns {Promise}
 */
function getCodeByUrl(url, opts) {
  return new Promise(function(resolve, reject) {
    request
      .get(url)
      .end(function(err, res) {
        var code;
        var swagger;

        if (err) {
          return reject(err);
        }

        if (res.error) {
          return reject(res.error);
        }

        swagger = res.body;
        code = getCode(swagger, opts);

        resolve(code);
      });
  });
}

module.exports.getCode = getCode;
module.exports.getCodeByUrl = callbackify(getCodeByUrl);
