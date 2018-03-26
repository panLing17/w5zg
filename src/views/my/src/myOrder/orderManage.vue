<template lang="pug">
  .orderManage
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单管理
      .topRight(slot="right")
</template>

<script>
    export default {
      name: "orderManage"
    }
</script>

<style scoped>
  .flexBox {
    margin-top: .5rem;
    display: flex;
    height: 12rem;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .flexBox img{
    width: 3rem;
  }
  .two {
    color: rgb(153,153,153);
  }
  .three {
    font-size: .4rem;
  }
  .three span{
    color: rgb(245,0,87);
    font-size: .8rem;
    margin: 0 .1rem;
  }
</style>
