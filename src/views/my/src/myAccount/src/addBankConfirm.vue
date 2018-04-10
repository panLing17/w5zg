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
            .btn {{timerText}}
      .bottomBtn 完成
</template>

<script>
    export default {
      name: "addBankConfirm",
      data ()  {
        return {
          timerText: '60 s'
        }
      },
      mounted() {
        this.$nextTick(() => {
          this.timer();
        })
      },
      methods: {
        timer () {
          let count = 60;
          let _this = this;
          let timer = setInterval(() => {
            count--;
            _this.timerText = count + ' s';
            if (count<0) {
              clearInterval(timer);
              _this.timerText = '再次发送'
            }
          },1000);
        }
      }
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
    padding: .53rem .8rem 0;
    background: #fff;
  }
  .infoWrapper .dec{
    font-size: .4rem;
    color: rgb(153,153,153);
    line-height: 1.8;
    border-bottom: 1px solid rgb(153,153,153);
    padding-bottom: .2rem;
  }
  .block {
    display: flex;
    padding: .26rem 0;
  }
  .block .left {
    flex: 1;
    line-height: 1rem;
    display: inline-flex;

  }
  .left label{
    font-size: .4rem;
    color: rgb(51,51,51);
    flex: none;
  }
  .left input {
    flex: none;
    width: 60%;
    font-size: .4rem;
    color: rgb(51,51,51);
    border: none;
    outline: none;
  }
  .block .right {
    flex: none;
  }
  .block .right .btn {
    width: 2.24rem;
    height: 1rem;
    background: rgb(245,0,87);
    color: #fff;
    border-radius: .53rem;
    text-align: center;
    line-height: 1rem;
    font-size: .37rem;
  }
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
