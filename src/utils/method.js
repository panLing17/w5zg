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

function goActivity(data) {
  switch (data.url_type) {
    // 跳外链
    case '143': window.location.href = data.url + '?shId=' + data.sh_id; break;
    // 跳3级页面 361代表从1级跳3级
    case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
    // 跳商品详情页 取relate_id
    case '141': this.$router.push({ path: '/goodsDetailed', query: { id: data.relate_id }}); break;
    // 跳2级页面
    case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
    // 跳3级页面模板2
    case '149': this.$router.push({ path: '/activity', query: { actId: data.id, title: data.title, parentType: '361', shId: data.sh_id}}); break;
    // 跳三级页面模板2
    case '148': this.$router.push({path: '/twoLevel', query: {parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
  }
}
export default { transformDate, imgUrlFilter, getClientHeight, arrayPrice, back, goActivity }
