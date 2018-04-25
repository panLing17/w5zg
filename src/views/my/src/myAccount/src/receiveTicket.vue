<template lang="pug">
  .receiveTicket
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.replace('/home')")
      .topCenter(slot="center") 万物商城现金券
      .topRight(slot="right")
    .content
      .decWrapper
        .title 万物商城
        .dec 800大品牌  线上下单 | 专柜提货
      .imagesWrapper
        img.z3(src="../../../../../assets/img/three@2x.png")
        img.z1(src="../../../../../assets/img/one@2x.png")
        transition(name="fold")
          .price(v-if="showSuccess")
            span.wrapper
              sup ￥
              strong {{price}}
      .formWrapper
        transition(name="scale")
          .text(v-if="showSuccess")
            p 恭喜您
            p 获得 “万物商城” 现金券{{price}}元
        .form
          input(placeholder="请输入手机号领取", v-if="!isLoginFlag", v-model="phone", type="number")
          .btn(@click="receive") 点击领取

</template>

<script>
  export default {
    name: "receiveTicket",
    data () {
      return {
        phone: '',
        isLoginFlag: false,
        showSuccess:false,
        url: '',
        price: 0
      }
    },
    created () {
      this.isLogin();
      this.getUrl()
    },
    methods: {
      getUrl () {
        this.url = this.$route.query.redirect_url
      },
      receive () {
        let _this = this
        if (!this.isLoginFlag) {
          let reg = /^1[0-9]{10}$/;
          if (!reg.test(this.phone)) {
            this.$message.error('手机号码格式不正确！');
            return;
          }
        }

        if (!this.showSuccess){
          if (this.isLoginFlag && this.phone.length!==11) {
            this.getUserData(function () {
              _this.getTicket();
            })
            return
          }
          this.getTicket();
        }else {
          return
        }

      },
      isLogin () {
        if (localStorage.hasOwnProperty('token')) {
          this.isLoginFlag = true;
          this.getUserData()
        }
      },
      getUserData (callback) {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          if (response.data.code === '081') {
            self.phone = response.data.data.mi_phone
            callback && callback()
          }
        })
      },
      getTicket () {
        let _this = this;
        this.$ajax({
          method: 'get',
          url: this.url,
          params:{
            mobile: this.phone
          }
        }).then(function (response) {
          if (response.data.code === '081') {
            _this.price = response.data.data
            _this.showSuccess = true;
            _this.$router.replace('/home')
          }else {
            _this.$message.error(response.data.msg);
          }
        })
      }
    }
  }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:rgb(204,204,204);
  }
  .receiveTicket {
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
  }
  .content {
    min-height: calc(100vh - 1.3rem);
    line-height: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
  }
  .decWrapper {
    flex: none;
  }
  .title {
    margin-top: 1.33rem;
    font-size: .64rem;
    color: rgb(51,51,51);
  }
  .dec {
    font-size: .42rem;
    color: rgb(102,102,102);
    margin-top: .34rem;
  }
  .bg {
    width: 100%;
    height: 4.45rem;
    position: relative;
    z-index: 150;
  }
  .formWrapper {
    background:rgb(231,55,62);
    flex: 1;
    position: relative;
    z-index: 200;
  }
  .text {
    position: absolute;
    top: 0;
    left: 0;
    color: #fff;
    font-size: .43rem;
    line-height: 1.5;
    width: 100%;
    text-align: center;
    transform: scale(1);
  }
  .scale-enter-active, .scale-leave-active {
    transition: all 1s;
  }
  .scale-enter, .scale-leave-to {
    transform: scale(4);
  }
  .form {
    margin-top: 2rem;
  }
  .form input, .form .btn {
    width: 7.45rem;
    height: 1rem;
    border-radius: 1rem;
  }
  .form input {
    display: inline-block;
    vertical-align: top;
    background: rgb(242,242,242);
    border: none;
    outline: none;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .43rem;
  }
  .form .btn {
    margin: .4rem auto 0;
    background: rgb(255,147,30);
    color: #fff;
    font-size: .43rem;
    line-height: 1rem;
  }
  .z1, .z3 {
    width: 100%;
  }
  .z3 {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 200;
  }
  .z1 {
    position: absolute;
    left: 0;
    bottom: -1rem;
    z-index: 100
  }
  .price {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 150;
    width: 100%;
    height: 100%;
    background: url("../../../../../assets/img/two@2x.png") no-repeat top left;
    background-size: 100%;
    transform: translate3d(0,0,0);
  }
  .price.fold-enter-active, .price.fold-leave-active {
    transition: all 0.5s;
  }
  .price.fold-enter, .price.fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .price .wrapper {
    display: inline-block;
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: .8rem;
    left: 0;
    font-size: 1rem;
    color: rgb(231,55,62);
    font-weight: 900;
  }
  .wrapper strong {
    font-size: 1.78rem;
  }
  .wrapper sup {
    position: relative;
    top: -.2rem;
  }
  .imagesWrapper {
    flex: none;
    height: 5.5rem;
    position: relative;
    overflow: hidden;
  }

</style>
