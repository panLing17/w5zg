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
          #sc(ref="sc")
          .submitBtn(@click="receive")
            img.submitImg(src="../../../../../assets/img/nike3.png")
          .temp1Desc 我们将保护您的个人隐私不被泄露
        .template2(v-if="showIndex===2")
          .template2ImgWrapper
            img.template2Img(src="../../../../../assets/img/nike4.png")
          .descWrapper
            .desc1 500元工会福利券
            .desc2 已发放至您的手机账号
          .desc3 免费领取
            strong.strong1 1200元耐克鞋
          .nextBtn(@click="$router.push({path: '/marketing/publicNum', query: {temp: 1}})")
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
      transition(name="fade")
        .mask(v-show="popShow", @click="hidePop")
      transition(name="fade")
        .popWrapper(v-show="popShow")
          .popDesc 我们会通过短信的形式，发送验证码至您的手机，请注意查收。
          .popInputWrapper
            input.popInput(type="text", placeholder="请输入验证码")
            .inputBtn(:class="{'red': inputStatus.flag, 'gray': !inputStatus.flag}") {{inputStatus.inputBtnText}}
          .popBtn 立即验证
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
        loadingFlag: false,
        scFlag: false,
        inputStatus:{
          inputBtnText: '获取验证码',
          flag: true
        },
        popShow: false
      }
    },
    created () {
      this.getData();
    },
    mounted () {
      document.title = '领取工会福利券和耐克鞋';
      this._initSc()
    },
    methods: {
      hidePop () {
        this.popShow = false
      },
      _initSc () {
        let _this = this
        this.$nextTick(()=>{
          var ic = new smartCaptcha({
            renderTo: '#sc',
            width: '7.2rem',
            height: '1.17rem',
            default_txt: '< 点击按钮开始智能验证',
            success_txt: '验证成功',
            fail_txt: '验证失败，请在此点击按钮刷新',
            scaning_txt: '智能检测中',
            success: function(data) {
              _this.$ajax({
                method: 'post',
                url: _this.$apiMember + 'afs/afsValidateWeb',
                params: {
                  sessionId: data.sessionId,
                  sig: data.sig,
                  token: NVC_Opt.token,
                  scene: NVC_Opt.scene
                }
              }).then(function (response) {
                if (response) {
                  _this.scFlag = true
                }
              })
            },
          });
          ic.init();
        })
      },
      getData () {
        this.url = this.$route.query.redirect_url;
        if (this.$route.query.show_index) {
          this.showIndex = this.$route.query.show_index;
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
      receive () {
        let _this = this
        if (!this.isLoginFlag) {
          let reg = /^1[0-9]{10}$/;
          if (!reg.test(this.phone)) {
            this.$message.error('手机号码格式不正确！');
            return;
          }
        }

        if (this.scFlag){
          this.popShow = true
          // if (this.isLoginFlag && this.phone.length!==11) {
          //   this.getUserData(function () {
          //     _this.getTicket();
          //   })
          //   return
          // }
          // this.getTicket();
        }else {
          this.$message.warning('请点击智能验证按钮')
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
              if (response.data.msg != '您已经超过领取上限') {
                _this.showIndex = 2;
              } else {
                _this.$message.error(response.data.msg)
              }
            }
          }).catch(function (reason) {
            _this.loadingFlag = false
            _this.$message.error('系统出错~')

          });
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
    padding-top: .5rem;
    font-size: 0;
  }
  .template1Img {
    width: 4.18rem;
  }
  .inputWrapper {
    text-align: center;
    margin-top: .5rem;
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
    margin-top: .2rem;
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
  .temp1Desc {
    font-size: .32rem;
    color: #666;
    text-align: center;
    margin-top: .2rem;
  }
  #sc {
    margin: .2rem auto 0;
    width: 7.2rem;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
    z-index: 1500;
  }
  .popWrapper {
    width: 9rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    z-index: 1501;
    padding: 0 .8rem 1.5rem;
    border-radius: .2rem;
  }
  .popDesc {
    margin-top: 1rem;
    font-size: .32rem;
    color: #666;
    line-height: 1.5;
  }
  .popInputWrapper {
    display: flex;
    justify-content: space-between;
    margin-top: .46rem;
  }
  .popInput {
    border: 1px solid #b5b5b5;
    width: 5rem;
    height: .93rem;
    outline: none;
    padding-left: .33rem;
  }
  .inputBtn {
    line-height: .93rem;
    width: 2.1rem;
    text-align: center;
    border-radius: .2rem;
  }
  .red {
    border: 1px solid #ff3050;
    color: #ff3050;
  }
  .gray {
    border: 1px solid #999;
    color: #999;
  }
  .popBtn {
    border-radius: .2rem;
    line-height: .93rem;
    text-align: center;
    color: #fff;
    background: linear-gradient(#ffab8d, #ff3050);
    margin-top: .37rem;
    font-size: .37rem;
  }
</style>
