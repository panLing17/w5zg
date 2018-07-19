/**
 * Created by Administrator on 2017-12-24.
 */
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
export default {transformDate, imgUrlFilter, getClientHeight}
