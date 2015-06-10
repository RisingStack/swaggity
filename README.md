# swaggity

Client generation from swagger docs for Node.js, Browser and AngularJS

## API

### Get code

```
var code = getCode(swagerJSON, opts);
```

### Get code by url

#### Callback

```
getCodeByUrl(url, opts, function (code) { ... })
```

#### Promise

```
getCodeByUrl(url, opts)
  .then(function (code) { ... })
  .catch(function (err) { ... })
```
## options

```
type: 'node',
moduleName: 'petstore',
className: 'Petstore',
indentSize: 2,                // optional, code indent size
skipMethods: ['OPTIONS'],     // optional, skip methods where method type match
authorization: ['USER']       // optional, skip methods where auth doesn't match
```
**experimental options:**  
```
resourcesByPath: true
```
