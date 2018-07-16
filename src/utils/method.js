/**
 * Created by Administrator on 2017-12-24.
 */
global.$isContained=(a, b)=>{
  if(!(a instanceof Array) || !(b instanceof Array)) return false;
  if(a.length < b.length) return false;
  var aStr = a.toString();
  for(var i = 0, len = b.length; i < len; i++){
    if(aStr.indexOf(b[i]) == -1) return false;
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
export default {transformDate, imgUrlFilter, getClientHeight}
