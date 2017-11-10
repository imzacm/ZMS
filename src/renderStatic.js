const fs = require('fs'),
  path = require('path'),
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

module.exports = function (req, res, file) {
  let filePath = path.resolve('.', 'public', file)

  if (file.indexOf('bootstrap') > -1 ||
    file.indexOf('jquery') > -1 ||
    file.indexOf('popper') > -1) {
    filePath = path.resolve('.', 'node_modules', file)
  }

  fs.readFile(filePath, (err, data) => {
    const ext = path.parse(filePath).ext
    res.writeHead(200, {'Content-Type': mimeType[ext] || 'text/plain'})
    res.end(data)
  })
}