<template lang="pug">
  .wrap
    .content
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/01_index_1.png")
      .contentCenter
        img.contentCenterImg(src="../../../../../assets/img/06_user_error_btn2.jpg")
        .temp1
          .temp1Desc 您还没参加领鞋活动哦
          .temp1Btn
            img.temp1BtnImg(src="../../../../../assets/img/06_user_error_btn.png")
</template>

<script>

  export default {
    name: "noAttended",
    mounted () {
      document.title = "个人中心"
    }
  }
</script>

<style scoped>
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #ff314f;
  }
  .contentTop {
    font-size: 0;
  }
  .contentTopImg {
    width: 100%;
  }
  .contentCenter {
    font-size: 0;
    position: relative;
    margin-top: 1.5rem;
  }
  .contentCenterImg {
    width: 100%;
  }
  .temp1 {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .temp1Desc {
    font-size: .48rem;
    color: #333;
    text-align: center;
    margin-top: 1.5rem;
  }
  .temp1Btn {
    font-size: 0;
    text-align: center;
    position: absolute;
    bottom: .97rem;
    left: 0;
    width: 100%;
  }
  .temp1BtnImg {
    width: 7rem;
  }
  img {
    pointer-events: none;
  }
</style>
