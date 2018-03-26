import Vue from 'vue'
import App from './App'
import store from './vuex/store'
// 路由
import router from './router'
//http请求
import axios from 'axios'
//公用方法
import method from './utils/method.js'
//mescroll初始化
import './utils/mescrollInt.js'
//过滤器
import './filter/filter.js'
//动画
import './animate/animate.css'
//自定义公用组件
import './components/index.js'
//自定义插件
import './plugIn/index.js'
// axios拦截器
import './api/index.js'
// 接口端口号
import './api/apiType'
//message插件
import Message from 'vue-multiple-message'
Vue.prototype.$message = Message
Vue.config.productionTip = false
// axios加到原型链上
Vue.prototype.$ajax = axios
//全局方法
Vue.prototype.$method=method

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: {App}
})
