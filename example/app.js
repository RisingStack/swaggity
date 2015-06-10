var fs = require('fs');
var path = require('path');

var swaggity = require('../');
var swaggerDocs = require(path.join(__dirname, 'petstore.json'));

// generate node code
var source = swaggity.getCode(swaggerDocs, {
  type: 'node',
  moduleName: 'petstore',
  className: 'Petstore',
  indentSize: 2,                // optional
  skipMethods: ['OPTIONS']      // optional
});

fs.writeFileSync('./petstore-api.js', source);
