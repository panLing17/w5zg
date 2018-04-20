const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEV_HOST: '//localhost:',
  REQ_PRE : '"http://"',
  API_ROOT: '"192.168.1.190:"',
  MEMBER_PORT: '"8051"',
  GOODS_PORT: '"8041"',
  TRADING_PORT: '"8061"',
  APP_PORT: '"8031"',
  MEMBER_PREFIEX: '""',
  GOODS_PREFIEX: '""',
  TRADING_PREFIEX: '""',
  APP_PREFIEX: '""'
})

