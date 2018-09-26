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

function getStyle (el, attr) {
  if(el.currentStyle) {
    return el.currentStyle[attr];
  } else {
    return getComputedStyle(el, false)[attr];
  }
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

function goActivity(data, from) {
  from = from===1?'361':'362'
  // 外链解析
  let f = ''

  if (data.url && data.url.split('?').length===1) {
    f = '?'
  }else {
    f = '&'
  }
  switch (data.url_type) {
    // 跳外链
    case '143':
      if (data.sh_id) {
        window.location.href = data.url + f +'shId=' + data.sh_id;
      } else {
        window.location.href = data.url
      }
      break;
    // 跳3级页面 361代表从1级跳3级
    case '145':
      if (data.sh_id) {
        this.$router.push({path: '/home/sports',query:{parentType: from,actId: data.id, title: data.title, shId: data.sh_id}});
      } else {
        this.$router.push({path: '/home/sports',query:{parentType: from,actId: data.id, title: data.title}});
      }
      break;
    // 跳商品详情页 取relate_id
    case '141': this.$router.push({ path: '/goodsDetailed' }); break;
    // 跳2级页面
    case '144':
      if (data.sh_id) {
        this.$router.push({path: '/home/largeCollection',query:{parentType: from,actId: data.id, title: data.title, shId: data.sh_id}});
      } else {
        this.$router.push({path: '/home/largeCollection',query:{parentType: from,actId: data.id, title: data.title}});
      }
      break;
    // 跳3级页面模板2
    case '149':
      if (data.sh_id) {
        this.$router.push({ path: '/activity', query: { actId: data.id, title: data.title, parentType: from, shId: data.sh_id}});
      } else {
        this.$router.push({ path: '/activity', query: { actId: data.id, title: data.title, parentType: from}});
      }
      break;
    // 跳三级页面模板2
    case '148':
      if (data.sh_id) {
        this.$router.push({path: '/twoLevel', query: {parentType: from,actId: data.id, title: data.title, shId: data.sh_id}});
      } else {
        this.$router.push({path: '/twoLevel', query: {parentType: from,actId: data.id, title: data.title}});
      }
      break;
  }
}
export default {transformDate, imgUrlFilter, getClientHeight, arrayPrice, getStyle, back, goActivity}
