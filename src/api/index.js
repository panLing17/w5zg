import Vue from 'vue'
import router from '../router/index.js'
import axios from 'axios'
import Message from 'vue-multiple-message'
import store from '../vuex/store'


// axios.defaults.baseURL = process.env.API_ROOT

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
      Message.error(res.msg)
      // if (response.config.url.indexOf('member/login') === -1) {
      //   Message.error(res.msg)
      // }
      // return response
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
    console.log(error.response.status) // for debug
    if (error.response.status === 800) {
      let vm = new Vue({
        router
      })
      vm.$router.push('/login')
      localStorage.removeItem('token')
    }
    Message.error(error.message)
    return Promise.reject(error)
  })
