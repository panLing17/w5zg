<template lang="pug">
  .accountBind
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 账户绑定
    .weChat
      ul.wrap
        li.left 微信
        li.right
          span.bind 未绑定
          img(src="../../../assets/img/next@2x.png")
    .qq
      ul.wrap
        li.left QQ
        li.right
          span.bind 未绑定
          img(src="../../../assets/img/next@2x.png")
    .alipay
      ul.wrap
        li.left 支付宝
        li.right
          span.bind 未绑定
          img(src="../../../assets/img/next@2x.png")
    .microblog
      ul.wrap
        li.left 微博
        li.right
          span.bind 未绑定
          img(src="../../../assets/img/next@2x.png")                       
</template>
<script>
 
  export default {
    name: 'accountBind',
    data () {
      return {
        
      }
    },
    mounted () {
 
    },
    methods: {
      
    }
  }
</script>

<style scoped>
  .accountBind{
  	height: 100vh;
    background-color: rgb(242,242,242);
  }
  .accountBind .topCenter{
  	font-size: .5rem;
  	font-weight: 400;
  	color: rgb(51,51,51);
  }
  
  /*微信,QQ,支付宝,微博共同样式--开始*/
  .weChat,
  .qq,
  .alipay,
  .microblog{
    height: 1.5rem;
    padding: 0 .3rem;
    background-color: #fff;
  }
  .weChat ul.wrap,
  .qq ul.wrap,
  .alipay ul.wrap,
  .microblog ul.wrap{
    height: 1.5rem;
    line-height: 1.5rem;
    display: flex;
    justify-content: space-between;
  }
  .weChat ul.wrap li.left,
  .qq ul.wrap li.left,
  .alipay ul.wrap li.left,
  .microblog ul.wrap li.left{
    font-size: .45rem;
  }
  .weChat ul.wrap li.right img,
  .qq ul.wrap li.right img,
  .alipay ul.wrap li.right img,
  .microblog ul.wrap li.right img{
    width: .2rem;
    vertical-align: middle;
    margin-left: .4rem;
    margin-top: -.1rem;
  }
  .weChat ul.wrap li.right span.bind,
  .qq ul.wrap li.right span.bind,
  .alipay ul.wrap li.right span.bind,
  .microblog ul.wrap li.right span.bind{
    display: inline-block;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  /*微信,QQ,支付宝,微博共同样式--结束*/
  
  /*微信,QQ,支付宝下方边框--开始*/
  .weChat ul.wrap,
  .qq ul.wrap,
  .alipay ul.wrap{
    border-bottom: 1px solid rgb(204,204,204);
  }
  /*微信,QQ,支付宝下方边框--结束*/
  
</style>
