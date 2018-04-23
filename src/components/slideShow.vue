<template lang="pug">
  .slideShow
    div.layout
      div.banner
        ul.clearfix
          li
            a(href="https://www.baidu.com/")
              img( src="../assets/img/5.jpg")
          li
            a(href="https://www.baidu.com/")
              img( src="../assets/img/1.jpg")
          li
            a(href="https://www.baidu.com/")
              img( src="../assets/img/2.jpg")
          li
            a(href="https://www.baidu.com/")
              img( src="../assets/img/3.jpg")
          li
            a(href="https://www.baidu.com/")
              img( src="../assets/img/4.jpg")
          li
            a(href="https://www.baidu.com/")
              img( src="../assets/img/5.jpg")
          li
            a(href="https://www.baidu.com/")
              img( src="../assets/img/1.jpg")
        ul
          li.now
          li
          li
          li
          li

</template>
<script>

  export default {
    name: 'home',
    data () {
      return {

      }
    },
    mounted () {

      window.onload = function(){

          var imageCount = 5; //页面中用来轮播的图片有5张不同的
          //轮播图大盒子
          var banner = document.querySelector('.banner');
          //图片的宽度
          var width = banner.offsetWidth;
          //图片盒子
          var imageBox = banner.querySelector('ul:first-child');
          //点盒子
          var pointBox = banner.querySelector('ul:last-child');
          //所有的点
          var points = pointBox.querySelectorAll('li');

          //公用方法
          //加过渡
          var addTransition = function(){
              imageBox.style.transition = "all 0.3s";
              imageBox.style.webkitTransition = "all 0.3s";/*做兼容*/
          };
          //清除过渡
          var removeTransition = function(){
              imageBox.style.transition = "none";
              imageBox.style.webkitTransition = "none";
          }
          //定位
          var setTranslateX = function(translateX){
              imageBox.style.transform = "translateX("+translateX+"px)";
              imageBox.style.webkitTransform = "translateX("+translateX+"px)";
          }

          //功能实现
          //自动轮播  定时器  无缝衔接  动画结束瞬间定位
          var index = 1;
          var timer = setInterval(function(){
              index++ ;   //自动轮播到下一张
              //改变定位  动画的形式去改变  transition transform translate
              addTransition();    //加过渡动画
              setTranslateX(-index * width);  //定位
          },3000);

          //等过渡结束之后来做无缝衔接
          my.transitionEnd(imageBox, function(){
              //处理事件结束后的业务逻辑
              if(index > imageCount ){
                  index = 1;
              }else if(index <= 0){
                  index = imageCount;
              }
              removeTransition(); //清除过渡
              setTranslateX(-index * width);  //定位
              setPoint(); //设置底部显示当前图片对应的圆角
          });

          //改变当前样式  当前图片的索引
          var setPoint = function(){
              //清除上一次的now
              for(var i = 0 ; i < points.length ; i++){
                  points[i].className = " ";
              }
              //给图片对应的点加上样式
              points[index-1].className = "now";
          }

          //touch事件
          var startX = 0; //记录起始  刚刚触摸的点的位置 x的坐标
          var moveX = 0;  //滑动的时候x的位置
          var distanceX = 0;  //滑动的距离
          var isMove = false; //是否滑动过

          imageBox.addEventListener('touchstart', function(e){
              clearInterval(timer);   //清除定时器
              startX = e.touches[0].clientX;  //记录起始X
          });

          imageBox.addEventListener('touchmove',function(e){
              moveX = e.touches[0].clientX;   //滑动时候的X
              distanceX = moveX - startX; //计算移动的距离
              //计算当前定位  -index*width+distanceX
              removeTransition(); //清除过渡
              setTranslateX(-index * width + distanceX);  //实时的定位
              isMove = true;  //证明滑动过
          });

          //在模拟器上模拟的滑动会有问题 丢失的情况  最后在模拟器的时候用window
          imageBox.addEventListener('touchend', function(e){
              // 滑动超过 1/3 即为滑动有效，否则即为无效，则吸附回去
              if(isMove && Math.abs(distanceX) > width/3){
                  //5.当滑动超过了一定的距离  需要 跳到 下一张或者上一张  （滑动的方向）*/
                  if(distanceX > 0){  //上一张
                      index --;
                  }
                  else{   //下一张
                      index ++;
                  }
              }
              addTransition();    //加过渡动画
              setTranslateX(-index * width);    //定位

              if(index > imageCount ){
                  index = 1;
              }else if(index <= 0){
                  index = imageCount;
              }
              setPoint();

              //重置参数
              startX = 0;
              moveX = 0;
              distanceX = 0;
              isMove = false;
              //加定时器
              clearInterval(timer);   //严谨 再清除一次定时器
              timer= setInterval(function(){
                  index++ ;  //自动轮播到下一张
                  addTransition();    //加过渡动画
                  setTranslateX(-index * width);    //定位
              },3000);
          });
      }

      /*封装一些公用的事件或者公用的方法*/
      /*定义的一个命名空间*/
      window.my = {};
      /*封装一个事件 过渡结束事件*/
      my.transitionEnd = function(dom,callback){
          //1.给谁加事件
          //2.事件触发后处理什么业务
          if(!dom || typeof dom != 'object'){
              //没dom的时候或者不是一个对象的时候 程序停止
              return false;
          }
          dom.addEventListener('transitionEnd', function(){
              callback && callback();
          });
          dom.addEventListener('webkitTransitionEnd', function(){
              callback && callback();
          });
      }

      //封装一个tap事件
      my.tap = function(dom,callback){
          if(!dom || typeof dom != 'object'){
              //没dom的时候或者不是一个对象的时候 程序停止
              return false;
          }

          var isMove = false; //是否滑动过
          var time = 0;   //刚刚触摸屏幕的事件  touchstart的触发事件

          dom.addEventListener('touchstart',function(){
              //记录触发这个事件的时间
              time = Date.now();  //时间戳 毫秒
          });
          dom.addEventListener('touchmove',function(){
              isMove = true;
          });
          window.addEventListener('touchend',function(e){
              //1.没有滑动过
              //2.响应事件在150ms以内   要求比click要响应快
              if(!isMove && (Date.now()-time)<150 ){
                  callback && callback(e);
              }

              //重置参数
              isMove = false;
              time = 0;
          });

      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  .slideShow {
    width: 100%;
    background: white;
  }
  *,
  ::before,
  ::after{
      padding: 0;
      margin: 0;
      -webkit-box-sizing: border-box;/*兼容移动端主流浏览器*/
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;/*清除移动端点击高亮效果*/
  }
  body{
      font-family:Microsoft YaHei,sans-serif;/*移动端默认的字体*/
      font-size: 14px;
      color: #333;
  }
  ol,ul{
      list-style: none;
  }
  /*清除浮动*/
  .clearfix::before,
  .clearfix::after{
      content: "";
      display: block;
      height: 0;
      line-height: 0;
      visibility: hidden;
      clear: both;
  }

  .layout{
      width: 100%;
      max-width: 750px;
      min-width: 320px;
      margin: 0 auto;
      position: relative;
  }
  .banner{
      width: 100%;
      overflow: hidden;
      position: relative;
  }
  .banner ul:first-child{
      width: 1000%;
      -webkit-transform: translateX(-10%);
      transform: translateX(-10%);
  }
  .banner ul:first-child li{
      width: 10%;
      float: left;
  }
  .banner ul:first-child li a{
      display: block;
      width: 100%;
  }
  .banner ul:first-child li a img{
      width: 100%;
      display: block;
  }
  .banner ul:last-child{
      position: absolute;
      bottom: 6px;
      width: 100%;
      text-align: center;
  }
  .banner ul:last-child li{
      width: 6px;
      height: 6px;
      border: 1px solid #fff;
      border-radius: 50%;
      display: inline-block;
      margin-left: 10px;
  }
  .banner ul:last-child li:first-child{
      margin-left: 0;
  }
  .banner ul:last-child li.now{
      background: #fff;
  }
</style>
