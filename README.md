# swaggity

Client generation from swagger docs for Node.js, Browser and AngularJS

## API

## Get code

`getCode(opts)`

```
swagger: (JSON swagger docs),

type: 'node',
moduleName: 'petstore',
className: 'Petstore',
resourcesByPath: true,
swagger: swaggerDocs,
indentSize: 2,                // optional
skipMethods: ['OPTIONS']      // optional
```

## Get code by url

`getCodeByUrl(url, opts, callback)`

```
type: 'node',
moduleName: 'petstore',
className: 'Petstore',
resourcesByPath: true,
swagger: swaggerDocs,
indentSize: 2,                // optional
skipMethods: ['OPTIONS']      // optional
```
