<template lang="pug">
  .addBankConfirm
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 添加银行卡
      .topRight(slot="right")
    .content
      .infoWrapper
        .dec 绑定银行卡需要短信确认，验证码已发送于手机：136*******1233,请按提示操作。
        .block
          .left
            label 验证码：
            input(type="text")
          .right
            .btn 59s
      .bottomBtn 完成
</template>

<script>
    export default {
        name: "addBankConfirm"
    }
</script>

<style scoped>
  .addBankConfirm {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .infoWrapper {
    padding: .53rem .8rem .26rem;
    background: #fff;
  }
  .infoWrapper
  .bottomBtn {
    width: 68%;
    height: 1rem;
    line-height: 1rem;
    margin: 1.6rem auto 0;
    background: #f50057;
    color: #fff;
    font-size: .37rem;
    text-align: center;
    border-radius: .53rem;
  }

</style>
