/* eslint no-console: 0 */
const cluster = require('cluster'),
  server = require('./src/server'),
  numCPUs = require('os').cpus().length

if (process.env.NODE_ENV !== 'production') {
  server.listen(3001)
}
else {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)

    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }

    cluster.on('exit', (worker) => {
      console.log(`worker ${worker.process.pid} died`)
    })
  }
  else {
    server.listen(3001)
    console.log(`Worker ${process.pid} started`)
  }

}