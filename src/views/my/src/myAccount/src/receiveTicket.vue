<template lang="pug">
  .receiveTicket
    <!--nav-bar(background="white")-->
      <!--.topLeft(slot="left", @click="$router.replace('/home')")-->
        <!--img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")-->
      <!--.topCenter(slot="center", style="width: 6rem;text-align:center;") 万物直供商城现金券-->
      <!--.topRight(slot="right")-->
    .content(v-loading="loadingFlag")
      <!--img.bg(:src="showSuccess?require('../../../../../assets/img/3-01.jpg'):require('../../../../../assets/img/1-01.jpg')")-->
      .form(v-if="!showSuccess")
        .formTop
        .formBottom
          input(placeholder="请输入手机号领取", v-if="!isLoginFlag", v-model="phone", type="number")
          .btn(@click="receive")
            img(src="../../../../../assets/img/getBtn@2x.png")
          .text
            img(src="../../../../../assets/img/w5zgLogo@2x.png")
          .agreementBtn(@click="$refs.agreement.mShow()") 《万物直供用户协议》
      .successWrapper(v-if="showSuccess")
        .topWrapper
          .success(v-if="getSuccess")
            .price {{price}}
              span 元
            .successDec 恭喜您获得“万物直供”商城
            .words 现金券，即领即用
          .againDec(v-if="!getSuccess")
            .line1 已经领过券了哦~
            .line2 您可以推荐亲友领券！
        .bottomWrapper
          img.ewm(src="../../../../../assets/img/erweima@2x.png")
          .dec 长按关注“万物直供”商城公众号
          .downloadWrapper
            a.btn(href="http://a.app.qq.com/o/simple.jsp?pkgname=com.w5kj.w5mall&fromcase=40002")
            a.btn(href="https://itunes.apple.com/cn/app/%E4%B8%87%E7%89%A9%E7%9B%B4%E4%BE%9B/id1391512233?mt=8")
          .goHome(@click="$router.push('/home')") 进入万物直供商城首页 >
      agreement(ref="agreement")
</template>

<script>
  import Agreement from '@/views/common/src/agreement'
  export default {
    name: "receiveTicket",
    components: {
      Agreement
    },
    data () {
      return {
        phone: '',
        isLoginFlag: false,
        showSuccess: false,
        url: '',
        price: 0,
        loadingFlag: false,
        getSuccess: false
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
        if (this.loadingFlag === false) {
          this.loadingFlag = true
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.url,
            params:{
              mobile: this.phone
            }
          }).then(function (response) {
            _this.loadingFlag = false
            if (response) {
              _this.showSuccess = true;
              if (response.data.msg != '您已经超过领取上限') {
                _this.price = response.data.data
                _this.getSuccess = true;
              }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:#ccc;
  }
  .receiveTicket {
    position: absolute;
    z-index: 100;
    width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
  }
  .content {
    height: 100%;
    min-height: calc(100vh - 1.3rem);
    line-height: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    position: relative;
    background: url("../../../../../assets/img/bg24@2x.png") no-repeat;
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .form {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 150;
  }
  .formTop {
    width: 100%;
    height: 45%;
    background: url("../../../../../assets/img/quan@2x.png") no-repeat top left;
    background-size: 100% 100%;
  }
  .formBottom {
    height: 55%;
    width: 100%;
    /*background: url("../../../../../assets/img/bg24@2x.png") no-repeat;*/
    position: relative;
  }
  .form input{
    width: 7.73rem;
    height: 1.17rem;
    border-radius: 1.17rem;
  }
  .form input {
    position: absolute;
    top: .5rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgb(242,242,242);
    border: none;
    outline: none;
    text-align: center;
    color: #999;
    font-size: .43rem;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
  }
  .form .btn {
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    /*background: #fecb37;*/
    /*color: #c72d26;*/
    /*font-size: .43rem;*/
    /*line-height: 1rem;*/
    /*box-shadow: 2px 2px 10px rgba(0,0,0,0.3);*/
  }
  .form .btn img{
    width: 5.69rem;
  }
  .text {
    /*font-size: .4rem;*/
    /*color: #fff;*/
    position: absolute;
    top: 4.36rem;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .text img{
    width: 1.28rem;
    height: 1.28rem;
  }
  .successWrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 150;
    background: url("../../../../../assets/img/bg24@2x.png") no-repeat;
  }
  .topWrapper {
    width: 100%;
    height: 45%;
    position: relative;
    background: url("../../../../../assets/img/quan2@2x.png") no-repeat top left;
    background-size: 100% 100%;
  }
  .price {
    position: absolute;
    bottom: 1.4rem;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: .7rem;
    font-weight: 600;
    color: #F02342;
    letter-spacing: -.1rem;
    transform: scale(1, 1.2);
  }
  .price span {
    font-size: .6rem;
    margin-left: .1rem;
  }
  .bottomWrapper {
    height: 55%;
    width: 100%;
    /*background: #c72d26;*/
    position: relative;
  }

  .ewm {
    width: 3.2rem;
    height: 3.2rem;
    margin-top: .5rem;
    pointer-events: auto !important;
  }
  .dec {
    margin-top: .2rem;
    font-size:.32rem;
    color: #fff;
  }
  img {
    pointer-events: none;
  }
  .downloadWrapper {
    display: flex;
    justify-content: space-between;
    padding: 0 .4rem;
    margin-top: .5rem;
  }
  .downloadWrapper .btn {
    width: 4.6rem;
    height: 1.4rem;
    flex: none;
  }
  .downloadWrapper .btn:nth-child(1) {
    background: url("../../../../../assets/img/11.png") no-repeat;
    background-size: 4.6rem 1.4rem;
  }
  .downloadWrapper .btn:nth-child(2) {
    background: url("../../../../../assets/img/12.png") no-repeat;
    background-size: 4.6rem 1.4rem;
  }
  .goHome {
    text-align: center;
    color: #fff;
    font-size: .37rem;
    margin-top: .2rem;
    text-decoration: underline;
  }
  .successDec {
    width: 100%;
    position: absolute;
    text-align: center;
    bottom: 2.4rem;
    left: 0;
    font-size: .37rem;
    color: #F02342;
  }
  .success {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .success .words{
    width: 100%;
    font-size: .3rem;
    text-align: center;
    color: #F02342;
    position: absolute;
    bottom: .8rem;
  }
  .againDec {
    width: 100%;
    position: absolute;
    text-align: center;
    bottom: 1.3rem;
    left: 0;
    font-size: .35rem;
    color: #F02342;
    line-height: 1.5;
  }
  .againDec .line2{
    margin-top: .15rem;
  }
  .agreementBtn {
    position: absolute;
    top: 5.9rem;
    left: 0;
    width: 100%;
    color: #fff;
    font-size: .3rem;
    text-align: center;
    z-index: 150;
  }
</style>
