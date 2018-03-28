import Vue from 'vue'

// 用户部分
Vue.prototype.$apiMember = process.env.API_ROOT + ':8051/'
Vue.prototype.$apiApp = process.env.API_ROOT + ':8031/'
