const render = require('../render')

function root(req, res) {
  res.vars['TITLE'] = 'ZMS'
  render(res, 'index')
}

module.exports = {
  'GET': {
    '/': root
  }
}