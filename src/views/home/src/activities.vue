<template lang="pug">
  .activities
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 大牌云集
      .topRight(slot="right")
        img(src="../../../assets/img/scanSuccess消息.png")
    .banner
      ul
        li
          img(src="../../../assets/img/1.jpg")
        li
          img(src="../../../assets/img/2.jpg")
        li
          img(src="../../../assets/img/3.jpg")
        li
          img(src="../../../assets/img/4.jpg") 
      
</template>

<script>
  export default {
    name: "activities",
    data (){
      return{
      	
      }	
    },
    mounted (){
      window.onscroll = function(){}	
    }
  }
</script>

<style scoped>
  .activities{
	background-color: rgb(242,242,242);
	padding-bottom: 2rem;
  }
  .topCenter{
	font-size: .45rem;
	font-weight: 400;
  }
  .topRight img{
    width: .7rem;
    vertical-align: middle;
  }
  /*内容图片的样式--开始*/
  .banner{
	margin-top: .2rem;
	background-color: #fff;
  }
  .banner ul li{
	margin-top: .1rem;
  }
  .banner ul li img{
  	height: 4.2rem;
  }
  /*内容图片的样式--结束*/
</style>