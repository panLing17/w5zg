import Vue from 'vue'

// 用户部分
Vue.prototype.$apiMember = process.env.API_ROOT + ':8051/'
// app相关
Vue.prototype.$apiApp = process.env.API_ROOT + ':8031/'
// 交易相关
Vue.prototype.$apiTransaction = process.env.API_ROOT + ':8061/'


global.$codeList = {
  111: '请求错误',
  112: '未登录'
}
global.$code = function (e) {
  if ($codeList[e]) {
    return $codeList[e]
  } else {
    return '错误码不存在'
  }
}
