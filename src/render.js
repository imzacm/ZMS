const fs = require('fs'),
  path = require('path')

function renderPage(page, templateVars) {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path.resolve('.', 'html', page + '.html'),
      'utf-8',
      (err, pageContents) => {
        if (err) {
          reject(err)
        }
        if (typeof templateVars === 'object') {
          const tempVarKeys = Object.keys(templateVars)
          tempVarKeys.forEach(key => {
            const tempVar = templateVars[key]
            while (pageContents.indexOf(key) > -1) {
              pageContents = pageContents.replace('${' + key + '}', tempVar)
            }
          })
        }

        resolve(pageContents)
      })
  })
}

module.exports = renderPage