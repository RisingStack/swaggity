var expect = require('chai').expect;
var generate = require('./generate');

var fs = require('fs');
var request = require('superagent');
var Mustache = require('mustache');
var beautify = require('js-beautify');
var lint = require('jshint');
var swaggerV2 = require('./swaggerV2');

describe('generate', function() {
  it('should fetch data and call getCode', function(done) {
    var requestStub = this.sandbox.stub(request, 'get', function() {
      return {
        end: function(cb) {
          return cb(null, {
            body: {
              swagger: '2.0'
            }
          });
        }
      };
    });

    this.sandbox.stub(swaggerV2, 'getView', function () {
      return 'data';
    });

    this.sandbox.stub(fs, 'readFileSync', function() {
      return 'file';
    });

    var mustacheStub = this.sandbox.stub(Mustache, 'render', function() {
      return 'renderedStuff';
    });

    var beautifyStub = this.sandbox.stub(beautify, 'js_beautify', function() {
      return 1;
    });

    var lintStub = this.sandbox.stub(lint, 'JSHINT', function() {
      return 1;
    });
    lintStub.errors = [];

    var options = {
      type: 'angular',
      indentSize: 4
    };
    generate.getCodeByUrl('www.test.com/docs', options)
      .then(function (res) {
        expect(res).to.eql(1);
        done();
      })
      .catch(done);

    expect(requestStub).to.have.been.calledWith('www.test.com/docs');
    expect(mustacheStub).to.have.been.calledWith('file', 'data', {
      method: 'file',
      request: 'file'
    });
    expect(lintStub).to.have.been.calledWith('renderedStuff', {
      node: false,
      browser: true,
      undef: true,
      strict: true,
      trailing: true,
      smarttabs: true
    });
    expect(beautifyStub).to.have.been.calledWith('renderedStuff', {
      indent_size: 4,
      max_preserve_newlines: 2,
    });
  });
});
