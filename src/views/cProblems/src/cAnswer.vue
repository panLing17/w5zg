<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter 现金券
    .cont
      ul
        li(v-for="item in contList")
          .up(@click="item.ansFlag = !item.ansFlag")
            .left {{item.title}}
            .right
              img(src="../../../assets/img/zhankai@2x.png", v-if="!item.ansFlag")
              img(src="../../../assets/img/shouqi@2x.png", v-if="item.ansFlag")
          transition(name="slideInDown")
            .down(v-if="item.ansFlag") 顾客在万物直供商城购物，本商城自动抵扣现金券最高额，顾客仅支付用券后余额。
</template>

<script>
    export default {
        name: "cAnswer",
        data() {
          return{
            contList: [{title:'什么是现金券？', ansFlag: false},{title:'现金券的作用', ansFlag: false},{title:'如何得到现金券', ansFlag: false}]
          }
        }
    }
</script>

<style scoped>
  .wrapNav{
    width: 100%;
    height: 100vh;
    background-color: #fff;
    position: fixed;
  }
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.28rem;
    border-bottom: 1px solid #f2f2f2;
    background: #fff;
    display: flex;
    align-items: center;
  }
  .navbar img{
    vertical-align: middle;
  }
  .topLeft{
    padding-left: .36rem;
    padding-top: .1rem;
  }
  .topCenter{
    margin-left: 3.4rem;
    font-size: .48rem;
  }
  .cont{
    margin-top: 1.28rem;
  }
  .cont ul{
    padding-top: .16rem;
    background-color: #f2f2f2;
  }
  .cont ul li{
    background-color: #fff;
  }
  .cont ul li .up{
    padding: .34rem .4rem .32rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #333;
    font-size: .4rem;
    border-bottom: .05rem solid #f2f2f2;
  }
  .cont ul li .down{
    background-color: #f2f2f2;
    padding: .34rem .4rem;
    color: #666;
    font-size: .37rem;
  }
  .cont li .right img{
    width: .58rem;
    height: .58rem;
  }
  .slideInDown-enter-active,
  .slideInDown-leave-active{
    transition: all .2s ease-out;
  }
  .slideInDown-enter,
  .slideInDown-leave-to{
    transform: translateY(-5px);
    opacity: 0;
  }
</style>
