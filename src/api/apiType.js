import Vue from 'vue'

// 用户部分
Vue.prototype.$apiMember = process.env.API_ROOT + ':8051/'
// app相关
Vue.prototype.$apiApp = process.env.API_ROOT + ':8031/'
// 交易相关
Vue.prototype.$apiTransaction = process.env.API_ROOT + ':8061/'
