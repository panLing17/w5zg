<template lang="pug">
  .wrap
    <!--.headerWrapper-->
      <!--.back(@click="$router.go(-1)")-->
        <!--img.backImg(src="../../../../../assets/img/back@2x.png")-->
      <!--.title 领取工会福利券和耐克鞋-->
    .contentWrapper(v-loading="loadingFlag")
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/nike1.png")
      .content
        .template1(v-if="showIndex===1")
          .template1ImgWrapper
            img.template1Img(src="../../../../../assets/img/nike2.png")
          .inputWrapper
            input.phone(type="number", placeholder="请输入手机号领取", v-model="phone")
          .submitBtn(@click="receive")
            img.submitImg(src="../../../../../assets/img/nike3.png")
        .template2(v-if="showIndex===2")
          .template2ImgWrapper
            img.template2Img(src="../../../../../assets/img/nike4.png")
          .descWrapper
            .desc1 500元工会福利券
            .desc2 已发放至您的手机账号
          .desc3 免费领取
            strong.strong1 1200元耐克鞋
          .nextBtn
            img.nextImg(src="../../../../../assets/img/nike5.png")
        .template3(v-if="showIndex===3")
          .template2ImgWrapper
            img.template2Img(src="../../../../../assets/img/nike4.png")
          .descWrapper
            .desc1 您已为好友助力成功！
            .desc4 额外赠送
              strong.strong2 500元工会福利券
              span 已发放至您的手机账号
          .desc3.small 免费领取
            strong.strong1 1200元耐克鞋
          .nextBtn
            img.nextImg(src="../../../../../assets/img/nike6.png")
          .nextBtn.next
            img.nextImg(src="../../../../../assets/img/nike7.png")
</template>

<script>
  export default {
    name: "receiveTicket",
    data () {
      return {
        showIndex: 1,
        phone: '',
        url: '',
        isLoginFlag: false,
        loadingFlag: false
      }
    },
    created () {
      this.getData();
    },
    mounted () {
      document.title = '领取工会福利券和耐克鞋';
    },
    methods: {
      getData () {
        this.url = this.$route.query.redirect_url;
        // this.showIndex = this.$route.query.show_index;
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
              _this.showIndex = 2;
              // if (response.data.msg != '您已经超过领取上限') {
              //
              // }
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  img {
    pointer-events: none;
  }
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
  .headerWrapper {
    height: 1.3rem;
    position: relative;
    padding: 0 .26rem;
  }
  .back {
    padding: .2rem;
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
  }
  .backImg {
    width: .3rem;
  }
  .title {
    color: #333;
    font-size: .4rem;
    text-align: center;
    line-height: 1.3rem;
    font-weight: 600;
  }
  .contentWrapper {
    /*height: calc(100% - 1.3rem);*/
    height: 100%;
    background: #ff3050;
  }
  .contentTop {
    padding: .66rem .57rem .66rem .66rem;
  }
  .contentTopImg {
    width: 100%;
  }
  .content {
    width: 9.33rem;
    height: 10.26rem;
    border-radius: .13rem;
    margin: 0 auto;
    overflow: hidden;
    background: #fff;
  }
  .template1ImgWrapper {
    text-align: center;
    padding-top: .98rem;
    font-size: 0;
  }
  .template1Img {
    width: 4.18rem;
  }
  .inputWrapper {
    text-align: center;
    margin-top: .94rem;
  }
  .phone {
    width: 7.2rem;
    height: 1.17rem;
    background: #e6e6e6;
    border-radius: .58rem;
    border: none;
    outline: none;
    text-align: center;
    font-size: .426rem;
    color: #333;
  }
  input::placeholder{
    color: rgb(153,153,153);
  }
  .submitBtn {
    text-align: center;
    margin-top: .46rem;
  }
  .submitImg {
    width: 7.2rem;
  }
  .template2, .template3 {
    height: 100%;
    position: relative;
    z-index: 10;
  }
  .template2:after, .template3:after {
    width: 140%;
    height: 4.56rem;
    position: absolute;
    left: -20%;
    top:5.7rem;
    content: '';
    z-index: -1;
    border-radius: 50% 50% 0 0 ;
    background: #ecebe9;
  }
  .template2ImgWrapper {
    /*text-align: center;*/
    padding-top: .93rem;
    font-size: 0;
  }
  .template2Img {
    width: 5.9rem;
    margin-left: 1.56rem;
  }
  .descWrapper {
    line-height: 1;
    margin-top: .3rem;
    color: #ff3050;
    text-align: center;
    font-size: .48rem;
  }
  .desc1 {
    font-weight: 500;
  }
  .desc2 {
    margin-top: .22rem;
  }
  .desc3 {
    color: #333;
    font-size: .46rem;
    text-align: center;
    line-height: 1;
    margin-top: 1.8rem;
  }
  .strong1 {
    color: #ff3050;
    font-size: .48rem;
  }
  .nextBtn {
    text-align: center;
    padding-top: .26rem;
    font-size: 0;
  }
  .nextImg {
    width: 7.5rem;
  }
  .desc4 {
    font-size: .4rem;
    color: #333;
    margin-top: .26rem;
  }
  .strong2 {
    color: #ff3050;
  }
  .desc3.small {
    margin-top: 1.4rem;
  }
  .nextBtn.next {
    padding-top: 0;
  }
</style>
