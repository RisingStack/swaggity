var expect = require('chai').expect;
var helper = require('./helper');

describe('helper', function() {
  it('should camelCase text', function() {
    expect(helper.camelCase('snake_case')).to.be.equal('snakeCase');
    expect(helper.camelCase('very-dash')).to.be.equal('veryDash');
    expect(helper.camelCase('soNothing')).to.be.equal('soNothing');
    expect(helper.camelCase('NotCamel')).to.be.equal('notCamel');
  });

  it('should get method name from the path', function() {
    var name1 = helper.getPathToMethodName('GET', '/users/{userId}/locations/{locationId}');
    var name2 = helper.getPathToMethodName('GET', '/cat-dogs/{catId}');

    expect(name1).to.be.equal('getUsersByUserIdLocationsByLocationId');
    expect(name2).to.be.equal('getCatDogsByCatId');
  });

  describe('#decorateParameter', function() {
    var v1Types = ['body', 'path', 'query', 'header', 'form'];
    var v2Types = ['body', 'path', 'query', 'header', 'formData'];
    var parameter = {
      name: 'Parameter-name',
      enum: ['Singleton'],
      pattern: 'pattern'
    };

    v1Types.forEach(function (type) {
      it('v1 ' + type, function () {
        parameter.paramType = type;

        var decorated = helper.decorateParameter('v1', parameter);
        var addedProp = helper.camelCase('is-' + type + '-parameter');

        expect(decorated[addedProp]).to.eql(true);
        expect(decorated.isSingleton).to.eql(true);
        expect(decorated.singleton).to.eql('Singleton');
        expect(decorated.camelCaseName).to.eql('parameterName');
        if (type === 'query') {
          expect(decorated.isPatternType).to.eql(true);
        }
      });
    });

    v2Types.forEach(function (type) {
      it('v2 ' + type, function () {
        parameter.in = type;

        var decorated = helper.decorateParameter('v2', parameter);

        type = type === 'formData' ? 'form' : type;
        var addedProp = helper.camelCase('is-' + type + '-parameter');

        expect(decorated[addedProp]).to.eql(true);
        expect(decorated.isSingleton).to.eql(true);
        expect(decorated.singleton).to.eql('Singleton');
        expect(decorated.camelCaseName).to.eql('parameterName');
        if (type === 'query') {
          expect(decorated.isPatternType).to.eql(true);
        }
      });
    });
  });
});
