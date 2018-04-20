import Vue from 'vue'

// 用户部分
Vue.prototype.$apiMember = process.env.REQ_PRE + process.env.MEMBER_PREFIEX + process.env.API_ROOT + process.env.MEMBER_PORT + '/'
// app相关
Vue.prototype.$apiApp = process.env.REQ_PRE + process.env.APP_PREFIEX + process.env.API_ROOT + process.env.APP_PORT + '/'
// 交易相关
Vue.prototype.$apiTransaction = process.env.REQ_PRE + process.env.TRADING_PREFIEX + process.env.API_ROOT + process.env.TRADING_PORT + '/'
// 商品相关
Vue.prototype.$apiGoods = process.env.REQ_PRE + process.env.GOODS_PREFIEX + process.env.API_ROOT  + process.env.GOODS_PORT + '/'

global.$codeList = ''
global.$code = function (e) {
  if ($codeList[e]) {
    return $codeList[e]
  } else {
    return '错误码不存在'
  }
}
