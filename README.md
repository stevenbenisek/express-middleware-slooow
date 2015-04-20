# express-middleware-slooow

[![Build Status](https://travis-ci.org/stevenbenisek/express-middleware-slooow.svg?branch=master)](https://travis-ci.org/stevenbenisek/express-middleware-slooow)

[Express.js middleware](http://expressjs.com/guide/using-middleware.html) to mimic slow loading HTTP resources.

## Usage

### Install Express
    
```shell
npm install express
```

### Install slooow
    
```shell
npm install express-middleware-slooow
```

### Create an Express server

```js
var express = require('express');
var port = 3000;
var server = express();
var slooow = require('express-middleware-slooow');

// Mount slooow on /slooow
server.use('/slooow', slooow);

server.listen(port);
```

In the example slooow is mounted on /slooow, meaning it will be executed for any 
type of HTTP request to /slooow.
If you want to execute it for every request to the server then you should use it 
without a mount path.

### Point resource links to server

#### Scheme

```
http://localhost:3000/slooow?ttfb=${ttfb}&url=${url}
```

#### Examples

**Example 1**: Request jquery.js from cdnjs with a [TTFB](http://en.wikipedia.org/wiki/Time_To_First_Byte) of 2 seconds.

```html
<script src="http://localhost:3000/slooow?ttfb=2&url=http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.1/jquery.js"></script>
```

**Example 2**: Request normalize.css from cdnjs with a [TTFB](http://en.wikipedia.org/wiki/Time_To_First_Byte) of 0.5 seconds.

```html
<link href="http://localhost:3000/slooow?ttfb=.5&url=http://cdnjs.cloudflare.com/ajax/libs/normalize/3.0.3/normalize.css" rel="stylesheet">
```

**Example 3**: Request image.jpg from localhost:3000 with a [TTFB](http://en.wikipedia.org/wiki/Time_To_First_Byte) of 1.25 seconds.

```html
<img src="http://localhost:3000/slooow?ttfb=1.25&url=http://localhost:3000/image.jpg">
```

**Example 4**: Request image.png from localhost:3000 with a [TTFB](http://en.wikipedia.org/wiki/Time_To_First_Byte) of 2 seconds.

```css
.selector {
    background-image: url('http://localhost:3000/slooow?ttfb=2&url=http://localhost:3000/image.png');
}
```

## Testing

```shell
npm install
npm test
```
