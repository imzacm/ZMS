const routes = {},
  middleware = require('./middleware'),
  render = require('./render'),
  renderStatic = require('./renderStatic')

Object.assign(routes, {
  'GET': {
    '/': require('./routes/root')
  },
  'POST': {}
})

let http = null

if (process.env.NODE_ENV === 'production') {
  http = require('https')
}
else {
  http = require('http')
}

const server = http.createServer(requestHandler)

module.exports = server

function requestHandler(req, res) {
  const stack = middleware

  if (routes[req.method][req.url] === undefined &&
      req.url.indexOf('/public/') < 0) {
    errorHandler({req, res}, 404)
    return
  }
  else if (req.url.indexOf('/public/') > -1) {
    stack.push((req, res) => {
      renderStatic(req, res, req.url.replace('/public/', ''))
    })
  }
  else {
    stack.push(routes[req.method][req.url])
  }

  stack.map(action => {
    action(req,res, (request, response) => {
      req = request
      res = response
    })
  })
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