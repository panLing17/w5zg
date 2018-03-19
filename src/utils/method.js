/**
 * Created by Administrator on 2017-12-24.
 */
//日期转换
function transformDate(date) {
  var d = new Date(date);
  var want=d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  return want
}
export default{transformDate}
