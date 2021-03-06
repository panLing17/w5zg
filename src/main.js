import Vue from 'vue'
import App from './App'
import 'babel-polyfill'
// 取消点击事件300毫秒延迟
// import FastClick from 'fastclick'
// FastClick.attach(document.body);
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
// 分享插件
import share from './plugIn/share/index'
//图片懒加载
import VueLazyLoad from 'vue-lazyload'
import scroll from './plugIn/scroll/index'

import AdTag from 'views/home/src/goodsList/adTag'
import Advert from 'views/home/src/goodsList/advert'
import Notify from '@/plugIn/notification/index.js'
import Verify from '@/plugIn/verify/index.js'

Vue.router = router
Vue.use(Notify)
Vue.use(Verify)
Vue.use(AdTag)
Vue.use(Advert)
Vue.use(scroll)
Vue.use(Verify)
Vue.use(VueLazyLoad, {
  // loading: require('assets/img/default.png'),
  // filter: {
  //   webp (listener, options) {
  //     console.log(listener.src)
  //       listener.src = 'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/' + listener.src + '?x-oss-process=style/compress'
  //   }
  // },
  // adapter: {
  //   loaded ({ bindType, el, naturalHeight, naturalWidth, $parent, src, loading, error, Init }) {
  //     // do something here
  //     // example for call LoadedHandler
  //     LoadedHandler(el)
  //   },
  //   loading (listender, Init) {
  //     console.log('loading')
  //   },
  //   error (listender, Init) {
  //     console.log(listender)
  //   }
  // }
})


Vue.prototype.$message = Message
Vue.config.productionTip = false
// axios加到原型链上
Vue.prototype.$ajax = axios
Vue.use(share)
//全局方法
Vue.prototype.$method=method
// 取消全部警告与错误提示
Vue.config.silent = false
/* eslint-disable no-new */
export let vue = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  components: {App}
})
