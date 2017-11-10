const routes = {},
  middleware = require('./middleware'),
  render = require('./render')

Object.assign(routes, {
  'GET': {
    '/': require('./routes/root')
  },
  'POST': {}
})

function errorHandler(response, errorCode, error) {
  if (typeof error === 'object') {
    error = JSON.stringify(error, null, 2)
  }

  if (errorCode === 404) {
    response.res.writeHead(errorCode)
    render(
      'error', {
        'ERROR_CODE': errorCode,
        'ERROR_TEXT': 'The page you\'re looking for can\'t be found, sorry?'
      })
      .then((page) => {
        response.res.end(page)
      })
    return
  }

  if (errorCode === 500 && process.env.NODE_ENV !== 'production') {
    response.res.writeHead(errorCode)
    render(
      'error', {
        'ERROR_CODE': errorCode,
        'ERROR_TEXT': error
      })
      .then((page) => {
        response.res.end(page)
      })
    return
  }

  response.res.writeHead(500)
  render(
    'error', {
      'ERROR_CODE': errorCode,
      'ERROR_TEXT': 'An error occured, try again later.'
    })
    .then((page) => {
      response.res.end(page)
    })
}

function requestHandler(req, res) {
  try {
    let mwResponse = middleware.reduce((acc, mw) => {
      mw(req, res, (request, response) => {
        acc = {req: request, res: response}
      })
    }, {req, res})

    if (mwResponse === undefined) {
      mwResponse = {req, res}
    }

    if (routes[req.method][req.url] !== undefined) {
      routes[req.method][req.url](mwResponse.req, mwResponse.res)
    }
    else {
      errorHandler(mwResponse, 404)
    }
  }
  catch(e) {
    errorHandler({req, res}, 500, e)
  }
}

let http = null

if (process.env.NODE_ENV === 'production') {
  http = require('https')
}
else {
  http = require('http')
}

const server = http.createServer(requestHandler)

module.exports = server