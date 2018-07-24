import Vue from 'vue'

Vue.filter('img-filter', function (value) {
  let url = process.env.IMG_URL + value + '?x-oss-process=style/compress'
  // var url = 'http://192.168.1.119/' + value
  return url
})
Vue.filter('gif-filter', function (value) {
  let url = process.env.IMG_URL + value
  // var url = 'http://192.168.1.119/' + value
  return url
})
Vue.filter('price-filter', function (value) {
  let fixNum = new Number(parseFloat(value) + 1).toFixed(2);//四舍五入之前加1
  let fixedNum = new Number(fixNum - 1).toFixed(2);//四舍五入之后减1，再四舍五入一下
  /*
  let stringNum = fixedNum.toString().split('.')
  let newNum
  if(stringNum[1][0] === '0' && stringNum[1][1] === '0') {
    newNum = stringNum[0]
  }
  if(stringNum[1][0] !== '0' && stringNum[1][1] === '0'){
    newNum = stringNum[0]+'.'+ stringNum[1][0]
  }
  if(stringNum[1][0] === '0' && stringNum[1][1] !== '0'){
    newNum = stringNum[0] + '.' + stringNum[1]
  }
  newNum = Number(newNum)
  return '￥'+ newNum*/

  return '￥'+ parseFloat(fixedNum)
})
