<template lang="pug">
  .accountBind
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="goBackPage")
      .topCenter(slot="center") 账户安全
    .loginPassword
      ul.wrap(@click="routergoUpdate1()")
        li.left 登录密码设置
        li.right
          img(src="../../../assets/img/next@2x.png")
    .paymentPassword
      ul.wrap(@click="routergoUpdate2()")
        li.left 支付密码设置
        li.right
          img(src="../../../assets/img/next@2x.png")
    .cellPhoneNum
      ul.wrap(@click="$router.push('/my/changeMobile1')")
        li.left 更换手机号
        li.right
          span.bind {{userData.mi_phone}}
          img(src="../../../assets/img/next@2x.png")
</template>
<script>
  import {mapState} from  'vuex'
  export default {
    name: 'accountSafety',
    data () {
      return {

      }
    },
    computed: mapState(['userData']),
    mounted () {
    },
    methods: {
      goBackPage:function(){
        this.$router.push({
          name: '我的设置'
        });
      },
      routergoUpdate1:function(){
        this.$router.push({
           name: '修改登录密码与支付密码',
           query: {
              routeParams: 1
           }
        });
      },
      routergoUpdate2:function(){
        this.$router.push({
           name: '修改登录密码与支付密码',
           query: {
              routeParams: 2
           }
        });
      },
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
  .loginPassword,
  .paymentPassword,
  .paymentPattern,
  .cellPhoneNum{
    height: 1.5rem;
    padding: 0 .3rem;
    background-color: #fff;
  }
  .loginPassword ul.wrap,
  .paymentPassword ul.wrap,
  .paymentPattern ul.wrap,
  .cellPhoneNum ul.wrap{
    height: 1.5rem;
    line-height: 1.5rem;
    display: flex;
    justify-content: space-between;
  }
  .loginPassword ul.wrap li.left,
  .paymentPassword ul.wrap li.left,
  .paymentPattern ul.wrap li.left,
  .cellPhoneNum ul.wrap li.left{
    font-size: .4rem;
  }
  .loginPassword ul.wrap li.right img,
  .paymentPassword ul.wrap li.right img,
  .paymentPattern ul.wrap li.right img,
  .cellPhoneNum ul.wrap li.right img{
    width: .2rem;
    vertical-align: middle;
    margin-left: .4rem;
    margin-top: -.1rem;
  }
  .loginPassword ul.wrap li.right span.bind,
  .paymentPassword ul.wrap li.right span.bind,
  .paymentPattern ul.wrap li.right span.bind,
  .cellPhoneNum ul.wrap li.right span.bind{
    display: inline-block;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  /*微信,QQ,支付宝,微博共同样式--结束*/

  /*微信,QQ,支付宝下方边框--开始*/
  .loginPassword ul.wrap,
  .paymentPassword ul.wrap,
  .paymentPattern ul.wrap{
    border-bottom: 1px solid rgb(204,204,204);
  }
  /*微信,QQ,支付宝下方边框--结束*/

</style>
