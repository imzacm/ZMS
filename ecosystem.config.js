module.exports = {
  apps : [
    {
      name: 'ZMS',
      script: 'index.js',
      env_production: {
        NODE_ENV: 'production'
      },
      args: 'prod'
    }
  ]
}