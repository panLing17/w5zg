<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter 现金券
</template>

<script>
    export default {
        name: "cAnswer"
    }
</script>

<style scoped>
  .wrapNav{
    width: 100%;
    height: 100vh;
    background-color: #f2f2f2;
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
</style>
