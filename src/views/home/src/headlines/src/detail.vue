<template lang="pug">
  .detailBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 直供头条
      .topRight(slot="right")
    .content dkdkkdkdkdkdkddkkdkdkdkdkd
</template>

<script>
    export default {
        name: "detail"
    }
</script>

<style scoped>
  .detailBox {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
</style>
