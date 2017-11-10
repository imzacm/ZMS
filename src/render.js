const fs = require('fs'),
  path = require('path')

function renderPage(res, page) {
  const templateVars = {}

  Object.assign(templateVars,
    res.vars)

  Promise.all([
    readFile(path.resolve('.', 'html', page + '.html')),
    readFile(path.resolve('.', 'html', 'layout.html'))
  ])
    .then((content) => {
      page = tempVars(content[0], templateVars)
      let p  = tempVars(content[1], templateVars)
      page = p.replace('${CONTENT}', page)
      res.end(page)
    })
}

function readFile(filepath) {
  return new Promise(resolve => {
    fs.readFile(filepath, 'utf-8', (err, pageContent) => {
      resolve(pageContent)
    })
  })
}

function tempVars(page, vars) {
  if (typeof vars === 'object') {
    const tempVarKeys = Object.keys(vars)
    tempVarKeys.forEach(key => {
      const tempVar = vars[key]
      while (page.indexOf(key) > -1) {
        page = page.replace('${' + key + '}', tempVar)
      }
    })
  }
  return page
}

module.exports = renderPage