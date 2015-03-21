var fs = require('fs');
var swaggity = require('../');
var swaggerDocs = require('./petstore.json');

// generate node code
var source = swaggity.getCode({
  type: 'node',
  moduleName: 'petstore',
  className: 'Petstore',
  swagger: swaggerDocs,
  skipMethods: ['OPTIONS']
});

fs.writeFileSync('./petstore-api.js', source);
