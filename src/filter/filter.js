import Vue from 'vue'

Vue.filter('img-filter', function (value) {
  let url = 'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/' + value
  // var url = 'http://192.168.1.119/' + value
  return url
})
Vue.filter('price-filter', function (value) {
  return '￥'+parseFloat(value).toFixed(2)
})
