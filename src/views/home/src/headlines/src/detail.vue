<template lang="pug">
  .detailBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 直供头条
      .topRight(slot="right")
    .content
      img.img(:src="$route.query.url | img-filter")
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
    z-index: 100;
    position: absolute;

  }
  .img {
    width: 100%;
    min-height: 500px;
  }
  .content {
    height: calc(100vh - 1.3rem);
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
