var fs = require('fs');
var swaggity = require('../');
var swagger = require('./petstore.json');

// generate node code
var source = swaggity.getCode({
  type: 'node',
  moduleName: 'petstore',
  className: 'Petstore',
  swagger: swagger,
  skipMethods: ['OPTIONS']
});

fs.writeFileSync('./petstore-api.js', source);
