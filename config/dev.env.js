const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEV_HOST: '//localhost:',
  API_ROOT: '"http://www.leshu.shop/api/"'
})

