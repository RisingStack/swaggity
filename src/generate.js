var path = require('path');
var fs = require('fs');

var request = require('superagent');
var Mustache = require('mustache');
var beautify = require('js-beautify').js_beautify;
var lint = require('jshint').JSHINT;
var _ = require('lodash');

var swaggerV1 = require('./swaggerV1');
var swaggerV2 = require('./swaggerV2');

/*
 * @method getCode
 * @param {Object} opts
 */
function getCode (opts) {
  var tpl;
  var method;
  var request;
  var source;

  // For Swagger Specification version 2.0 value of field 'swagger' must be a string '2.0'
  var data = opts.swagger.swagger === '2.0' ? swaggerV2.getView(opts) : swaggerV1.getView(opts);

  if (!opts.type) {
    if(!_.isObject(opts.template) || !_.isString(opts.template.class)  || !_.isString(opts.template.method) || !_.isString(opts.template.request)) {
      throw new Error('Unprovided custom template. Please use the following template: template: { class: "...", method: "...", request: "..." }');
    }

    tpl = opts.template.class;
    method = opts.template.method;
    request = opts.template.request;
  } else {
    tpl = fs.readFileSync(path.resolve(__dirname, '../templates/', opts.type + '-class.mustache'), 'utf-8');
    method = fs.readFileSync(path.resolve(__dirname, '../templates/', opts.type + '-method.mustache'), 'utf-8');
    request = fs.readFileSync(path.resolve(__dirname, '../templates/', opts.type + '-request.mustache'), 'utf-8');
  }

  // Skip methods, for example: DELETE needed only for admin
  if(_.isArray(opts.skipMethods)) {
    data.methods = data.methods.filter(function (item) {
      return opts.skipMethods.indexOf(item.method) === -1;
    });
  }

  // Generate source
  source = Mustache.render(tpl, data, {
    method: method,
    request: request
  });

  // Lint source
  lint(source, {
    node: opts.type === 'node' || !opts.type,
    browser: opts.type === 'angular' || !opts.type,
    undef: true,
    strict: true,
    trailing: true,
    smarttabs: true
  });

  lint.errors.forEach(function(error){
    if(error && error.code[0] === 'E') {
      throw new Error(lint.errors[0].reason + ' in ' + lint.errors[0].evidence);
    }
  });

  // Beautify source
  source = beautify(source, {
    indent_size: 4,
    max_preserve_newlines: 2
  });

  return source;
}

/*
 * @method getCodeByUrl
 * @param {String} url
 * @param {Object} opts
 * @callback
 */
function getCodeByUrl (url, opts, callback) {
  request.get(url).end(function (err, res) {
    if(err) {
      return callback(err);
    }

    if(res.error) {
      return callback(res.error);
    }

    opts.swagger = res.body;

    var code = getCode(opts);
    callback(null, code);
  });
}

module.exports.getCode = getCode;
module.exports.getCodeByUrl = getCodeByUrl;
