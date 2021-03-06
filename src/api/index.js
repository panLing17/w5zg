import Vue from 'vue'
import router from '../router/index.js'
import axios from 'axios'
import Message from 'vue-multiple-message'


// axios.defaults.baseURL = process.env.API_ROOT

//不需要登录的页面
let noNeedLogin = [
  '/home',
  '/goodsDetailed',
  '/twoLevel',
  '/activity',
  '/home/sports',
  '/home/largeCollection',
  '/search',
  '/page',
  '/my/receiveTicket',
  '/my/receiveTicketGH',
  '/download',
  '/download/labourunion'
]



// 过滤请求
axios.interceptors.request.use((config) => {
  // 如果没有token追加一条token
  if (config.data === undefined) {
    if (!config.params.W5MALLTOKEN && config.url.indexOf('member/login') === -1) {
      config.params.W5MALLTOKEN = localStorage.getItem('token')
    }
  }
  return config
})
axios.defaults.withCredentials = true
// respone拦截器
axios.interceptors.response.use(
  (response) => {
    const res = response.data
    let optSuc = res.optSuc
    if (optSuc) {
      return response
    } else {
      Vue.notify({
        content: res.msg,
        bottom: 3
      })
    }
  },
  /*
   * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
   * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
   */
  //  const res = response.data;
  //     if (res.code !== 20000) {
  //       Message({
  //         message: res.message,
  //         type: 'error',
  //         duration: 5 * 1000
  //       });
  //       // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
  //       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
  //         MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
  //           confirmButtonText: '重新登录',
  //           cancelButtonText: '取消',
  //           type: 'warning'
  //         }).then(() => {
  //           store.dispatch('FedLogOut').then(() => {
  //             location.reload();// 为了重新实例化vue-router对象 避免bug
  //           });
  //         })
  //       }
  //       return Promise.reject('error');
  //     } else {
  //       return response.data;
  //     }
  (error) => {
    // console.log(error.response.status) // for debug
    if (error.response.status === 800) {
      localStorage.removeItem('token')
      let lo = window.location.href.split('#')[1].split('?')[0]
      let f = false
      noNeedLogin.forEach(item => {
        if (lo === item) {
          f = true
        }
      })

      if (!f) {
        let vm = new Vue({
          router
        })
        vm.$router.push('/login')
      }
    } else {
      Message({
        showClose: true,
        message: error.message,
        type: 'error'
      })
    }
    return Promise.reject(error)
  })
