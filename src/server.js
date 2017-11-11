const routes = {},
  middleware = require('./middleware'),
  render = require('./render'),
  fs = require('fs'),
  path = require('path'),
  http = require('http'),
  mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'aplication/font-sfnt'
  }

Object.assign(routes, require('./routes/root'))

const server = http.createServer(requestHandler)

function requestHandler(req, res) {
  const stack = middleware

  if (req.url.indexOf('public') > -1 ||
      req.url.indexOf('node_modules') > -1) {
    fs.readFile(path.resolve('.' + req.url), 'utf-8', (err, file) => {
      const ext = path.parse(req.url).ext
      res.writeHead(200, {'Content-Type': mimeType[ext] || 'text/plain'})
      res.end(file)
    })
  }
  else if (routes[req.method][req.url] === undefined) {
    errorHandler({req, res}, 404)
  }
  else {
    stack.push(routes[req.method][req.url])

    stack.map(action => {
      action(req, res, (request, response) => {
        req = request
        res = response
      })
    })
  }
}

function errorHandler(response, errorCode, error) {
  if (typeof error === 'object') {
    error = JSON.stringify(error, null, 2)
  }

  if (errorCode === 404) {
    response.res.vars = {
      'TITLE': 'Error ' + errorCode,
      'ERROR_CODE': errorCode,
      'ERROR_TEXT': 'The page you\'re looking for can\'t be found, sorry?'
    }
  }

  else if (errorCode === 500 && process.env.NODE_ENV !== 'production') {
    response.res.vars = {
      'TITLE': 'Error ' + errorCode,
      'ERROR_CODE': errorCode,
      'ERROR_TEXT': error
    }
  }

  else {
    errorCode = 500
    response.res.vars = {
      'TITLE': 'Error ' + errorCode,
      'ERROR_CODE': errorCode,
      'ERROR_TEXT': 'We\'ve encountered an error, please try again later.'
    }
  }

  response.res.statusCode = errorCode
  render(response.res, 'error')
}

module.exports = server