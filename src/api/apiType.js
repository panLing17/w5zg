import Vue from 'vue'

// 用户部分
Vue.prototype.$apiMember = process.env.API_ROOT + ':8051/'
Vue.prototype.$apiMember2 = process.env.API_ROOT + ':8031/'
