<template lang="pug">
  .receiveTicket
    nav-bar(background="white")
      .topLeft(slot="left", @click="$router.replace('/home')")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 6rem;text-align:center;") 万物直供商城现金券
      .topRight(slot="right")
    .content(v-loading="loadingFlag")
      <!--img.bg(:src="showSuccess?require('../../../../../assets/img/3-01.jpg'):require('../../../../../assets/img/1-01.jpg')")-->
      .form(v-if="!showSuccess")
        .formTop
        .formBottom
          input(placeholder="请输入手机号领取", v-if="!isLoginFlag", v-model="phone", type="number")
          .btn(@click="receive") 点击领取
          .text 万物直供商城送您现金券，购物更省钱！
          .agreementBtn(@click="$refs.agreement.mShow()") 《万物直供用户协议》
      .successWrapper(v-if="showSuccess")
        .topWrapper
          .success(v-if="getSuccess")
            .price {{price}}
              span 元
            .successDec 恭喜您获得“万物直供”商城
          .againDec(v-if="!getSuccess")
            .line1 已经领过券了哦~
            .line2 您可以推荐亲友领券！
        .bottomWrapper
          img.ewm(src="../../../../../assets/img/gzh.jpg")
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
        showSuccess:false,
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
    min-height: calc(100vh - 1.3rem);
    line-height: 1;
    text-align: center;
    display: flex;
    flex-direction: column;
    position: relative;
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
    height: 60%;
    background: url("../../../../../assets/img/issue1@2x.jpg") no-repeat top left;
    background-size: 100% 100%;
  }
  .formBottom {
    height: 40%;
    width: 100%;
    background: #c72d26;
    position: relative;
  }
  .form input, .form .btn {
    width: 7.45rem;
    height: 1rem;
    border-radius: 1rem;
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
    color: rgb(51,51,51);
    font-size: .43rem;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
  }
  .form .btn {
    position: absolute;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: #fecb37;
    color: #c72d26;
    font-size: .43rem;
    line-height: 1rem;
    box-shadow: 2px 2px 10px rgba(0,0,0,0.3);
  }
  .text {
    font-size: .4rem;
    color: #fff;
    position: absolute;
    top: 3.5rem;
    left: 0;
    width: 100%;
    text-align: center;
  }
  .successWrapper {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 150;
  }
  .topWrapper {
    width: 100%;
    height: 50%;
    position: relative;
    background: url("../../../../../assets/img/issue2@3x.png") no-repeat top left;
    background-size: 100% 100%;

  }
  .price {
    position: absolute;
    bottom: .6rem;
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 1.5rem;
    font-weight: bold;
    color: #c72d26;
    letter-spacing: -.1rem;
    transform: scale(1, 1.2);
  }
  .price span {
    font-size: .7rem;
    margin-left: .1rem;
  }
  .bottomWrapper {
    height: 50%;
    width: 100%;
    background: #c72d26;
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
    font-size:.4rem;
    color: #fff;
  }
  img {
    pointer-events: none;
  }
  .downloadWrapper {
    display: flex;
    justify-content: space-between;
    padding: 0 .3rem;
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
    font-size: .4rem;
    margin-top: .2rem;
  }
  .successDec {
    width: 100%;
    position: absolute;
    text-align: center;
    bottom: 2.8rem;
    left: 0;
    font-size: .53rem;
    color: #c82c26;
  }
  .success {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .againDec {
    width: 100%;
    position: absolute;
    text-align: center;
    bottom: 1.5rem;
    left: 0;
    font-size: .53rem;
    color: #c82c26;
    line-height: 1.5;
  }
  .agreementBtn {
    position: absolute;
    top: 4.5rem;
    left: 0;
    width: 100%;
    color: #fff;
    font-size: .4rem;
    text-align: center;
    z-index: 150;
  }
</style>
