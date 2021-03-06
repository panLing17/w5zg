const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  DEV_HOST: '//localhost:',
  REQ_PRE : '"http://"',
  //API_ROOT: '"192.168.2.100:"',
  API_ROOT: '"192.168.2.69:"',
  MEMBER_PORT: '"8051"',
  GOODS_PORT: '"8041"',
  TRADING_PORT: '"8061"',
  APP_PORT: '"8031"',
  MEMBER_PREFIEX: '""',
  GOODS_PREFIEX: '""',
  TRADING_PREFIEX: '""',
  APP_PREFIEX: '""',
  // IMG_URL: '"http://w5zg-mall-test.oss-cn-hangzhou.aliyuncs.com/"'
  IMG_URL: '"http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/"'

})

/*
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = {
  NODE_ENV: '"production"' ,
  REQ_PRE : '"http://"',
  API_ROOT: '".w5zg.net:"',
  MEMBER_PORT: '"80"',
  GOODS_PORT: '"80"',
  TRADING_PORT: '"80"',
  APP_PORT: '"80"',
  MEMBER_PREFIEX: '"member"',
  GOODS_PREFIEX: '"goods"',
  TRADING_PREFIEX: '"trading"',
  APP_PREFIEX: '"app"',
  IMG_URL: '"http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/"',
  // IMG_URL: '"http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/"',
  // MEMBER_PREFIEX: '"member"',
  // GOODS_PREFIEX: '"goods"',
  // TRADING_PREFIEX: '"trading"',
  // APP_PREFIEX: '"app"'
}
*/

