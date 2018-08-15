/**
 * Created by Administrator on 2017-12-24.
 */
import Vue from 'vue'
global.$isContained=(aa, bb)=>{
  if(!(aa instanceof Array)||!(bb instanceof Array)||((aa.length < bb.length))){
    return false;
  }
  var aaStr = aa.toString();
  for (var i = 0 ;i < bb.length;i++) {
    if(aaStr.indexOf(bb[i]) < 0) return false;
  }
  return true;

}
// 日期转换
function transformDate(date) {
  var d = new Date(date);
  var want=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  return want
}
// 拼接图片前缀
function imgUrlFilter(data) {
  return process.env.IMG_URL + data
}
function getClientHeight(){
  let clientHeight=0;
  if(document.body.clientHeight&&document.documentElement.clientHeight){
    let clientHeight=(document.body.clientHeight<document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }else{
    let clientHeight=(document.body.clientHeight>document.documentElement.clientHeight)?document.body.clientHeight:document.documentElement.clientHeight;
  }
  return clientHeight;
}

function arrayPrice(value) {
  let fixNum;
  let fixedNum;
  let arr;
  if (value) {
    fixNum = new Number(parseFloat(value) + 1).toFixed(2);//四舍五入之前加1
    fixedNum = new Number(fixNum - 1).toFixed(2);//四舍五入之后减1，再四舍五入一下
    arr = parseFloat(fixedNum).toString().split('.')
    if (arr.length === 2) {
      arr.splice(1, 1, '.' + arr[1])
    }
  } else {
    arr = [0]
  }

  return arr
}

function back() {
  // android交互
  if (typeof w5zgApp !== 'undefined') {
    w5zgApp.onfinish()
    return
  }
  // android交互完毕

  // ios交互
  if (window.webkit && window.webkit.messageHandlers.iosMessage) {
    let results2 = window.webkit.messageHandlers.iosMessage.postMessage({type: 'back'});
    if (results2) {
      return
    }
  }
  // ios交互完毕
  this.$router.go(-1)
}
export default {transformDate, imgUrlFilter, getClientHeight, arrayPrice, back}
