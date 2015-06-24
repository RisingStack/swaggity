var expect = require('chai').expect;
var helper = require('./helper');

describe('helper', function () {
  it('should camelCase text', function () {
    expect(helper.camelCase('snake_case')).to.be.equal('snakeCase');
    expect(helper.camelCase('very-dash')).to.be.equal('veryDash');
    expect(helper.camelCase('soNothing')).to.be.equal('soNothing');
    expect(helper.camelCase('NotCamel')).to.be.equal('notCamel');
  });

  it('should get method name from the path', function () {
    var name1 = helper.getPathToMethodName('GET', '/users/{userId}/locations/{locationId}');
    var name2 = helper.getPathToMethodName('GET', '/cat-dogs/{catId}');

    expect(name1).to.be.equal('getUsersByUserIdLocationsByLocationId');
    expect(name2).to.be.equal('getCatDogsByCatId');
  });
});
