<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter 现金券
    .cont
      ul
        li
          .up
            .left 什么是现金券？
            .right
              img(src="")
              img(src="")
          .down 顾客在万物直供商城购物，本商城自动抵扣现金券最高额，顾客仅支付用券后余额。
</template>

<script>
    export default {
        name: "cAnswer",
        data() {
          return{
            contList:[{title:'什么是现金券？'},{title:'现金券的作用'},{title:'如何得到现金券'}]
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
</style>
