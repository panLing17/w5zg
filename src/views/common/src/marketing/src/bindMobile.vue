<template lang="pug">
  .wrap
    .contentWrapper
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/01_index_1.png")
      .content
        input.phoneInput(type="number", placeholder="请输入手机号登录")
</template>

<script>
  export default {
    name: "bindMobile"
  }
</script>

<style scoped>
  img {
    pointer-events: none;
  }
  input::placeholder{
    color: #ccc;
  }
  input  {
    -webkit-appearance: none;
  }
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: #ff314f;
    overflow: hidden;
  }
  .contentTop {
    font-size: 0;
  }
  .contentTopImg {
    width: 100%;
  }

  .content {
    width: 9.2rem;
    background: #ff6a78;
    border-radius: .53rem;
    text-align: center;
    margin: .4rem auto 0;
  }
  .phoneInput {
    width: 8.2rem;
    height: 1.17rem;
    text-align: center;
    font-weight: bold;
    font-size: .4rem;
    color: #333;
    border-radius: .58rem;
    border: none;
    outline: none;
    margin-top: .66rem;
  }
</style>
