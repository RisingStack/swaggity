# swaggity

Client generation from swagger docs for Node.js and AngularJS.

## authentication

The tool only supports api key authentication. To enable it, add this to the securityDefinitions:
```javascript
"api_key": {
  "type": "apiKey",
  "name": "api_key",
  "in": "header"
}
```

## authorization

Swaggity has authorization support, so only the endpoints with given authorization levels will be used during the generation process. For example if you want to generate USER related paths only and  exclude the ADMIN only endpoints, add this to the options for the tool:

```javascript
authorization: ['USER']
```
Then add the desired authorization level to the routes in your description file:

```javascript
"security": [{
  "api_key": []
}, {
  "authorization" : ["user"]
}]
```

## API

### Get code

```javascript
var code = getCode(swagerJSON, opts);
```

### Get code by url

#### Callback

```javascript
getCodeByUrl(url, opts, function (code) { ... })
```

#### Promise

```javascript
getCodeByUrl(url, opts)
  .then(function (code) { ... })
  .catch(function (err) { ... })
```
## options

```javascript
type: 'node',
moduleName: 'petstore',
className: 'Petstore',
indentSize: 2,
skipMethods: ['OPTIONS'],
authorization: ['USER']
```
