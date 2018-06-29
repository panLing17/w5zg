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
        .template1(v-if="showIndex==1")
          .template1ImgWrapper
            img.template1Img(src="../../../../../assets/img/nike2.png")
          .inputWrapper(v-if="!isLoginFlag")
            input.phone(type="number", placeholder="请输入手机号领取", v-model="phone")
          <!--#sc(ref="sc", :class="{'margin-1': isLoginFlag}")-->
          .submitBtn(@click="receive", :class="{'margin-1': isLoginFlag}")
            img.submitImg(src="../../../../../assets/img/nike3.png")
        .template4(v-if="showIndex==4")
          .template1ImgWrapper
            img.template1Img(src="../../../../../assets/img/nike2.png")
          .inputWrapper(v-if="!isLoginFlag")
            input.phone(type="number", placeholder="请输入手机号领取", v-model="phone")
          .submitBtn(@click="receive", :class="{'margin-1': isLoginFlag}")
            img.submitImg(src="../../../../../assets/img/16_inputnum_btn.png")
      .temp1Desc(v-if="showIndex==1 || showIndex==4") 我们将保护您的个人隐私不被泄露
      transition(name="fade")
        .mask(v-show="popShow", @click="hidePop")
      transition(name="fade")
        .popWrapper(v-show="popShow")
          .popDesc 我们会通过短信的形式，发送验证码至您的手机，请注意查收。
          #sc(ref="sc", :class="{'margin-1': isLoginFlag}")
          .popInputWrapper
            input.popInput(type="text", placeholder="请输入验证码", v-model="code")
            <!--.inputBtn(:class="{'red': inputStatus.flag, 'gray': !inputStatus.flag}", @click="getCode") {{inputStatus.inputBtnText}}-->
          .popBtn(@click="checkCode") 提交
</template>

<script>
  import shareImg from '../../../../../assets/img/applogo@2x.png'
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
        popShow: false,
        timer: null,
        price: 0,
        code: '',
        randomText: '',
        sessionId: '',
        sendCodeFlag: false,
        W5MALLTOKEN: ''
      }
    },
    created () {
      this.getData()
      this.getToken()
      this.checkAuthority()
      this.isLogin()
      this.getRandomText()
    },
    mounted () {
      document.title = '领取工会福利券和耐克鞋';
      this._initSc()
      this.loadShare()
    },
    methods: {
      //绑定手机
      bindAccount () {
        let _this = this
        this.$ajax({
          method: 'post',
          url: _this.$apiMember + 'member/bindAccount',
          params: {
            unionId: localStorage.getItem('unionId'),
            mobile : this.phone,
            W5MALLTOKEN: this.W5MALLTOKEN
          }
        }).then(function (response) {
          if (response) {
            _this.helpActivity()
          }
        })
      },
      //助力
      helpActivity () {
        let _this = this
        this.$ajax({
          method: 'get',
          url: _this.$apiApp + 'presentShoes/helpActivity',
          params: {
            unionId: localStorage.getItem('unionId'),
            sharerId : localStorage.getItem('originatorId')
          }
        }).then(function (response) {
          if (response) {
            _this.getTicket2()
          }
        })
      },
      loadShare () {
        let _this = this
        if (localStorage.getItem('sharerId') == 'undefined' || !localStorage.getItem('sharerId')) {
          if (localStorage.getItem('phone') && localStorage.getItem('phone').length === 11) {
            this.getSharerId(function (data) {
              if (data != '用户不存在') {
                _this.$initShare({
                  sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + data).replace(/\?*#/, "?#")
                })
              } else {
                _this.$initShare({
                  sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
                })
              }
            })
          } else {
            this.$initShare({
              sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
              shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
              shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
              link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
            })
          }
        } else {
          this.$initShare({
            sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
            shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
            shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
            link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + localStorage.getItem('sharerId')).replace(/\?*#/, "?#")
          })
        }
      },
      getToken () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/getSessionId',
          params: {}
        }).then(function (response) {
          if (response) {
            self.W5MALLTOKEN = response.data.data
          }
        })
      },
      getRandomText () {
        if (this.showIndex==3) {
          let Range = 4;
          let Rand = Math.random();
          let num = Math.round(Rand * Range);
          let aText = ['鞋垫','鞋带','鞋舌','鞋帮','耐克标']
          this.randomText = aText[num]
        }
      },
      checkCode () {
        let _this = this
        if (this.code.length === 6) {
          if (this.isLoginFlag && this.phone.length!==11) {
            this.getUserData(function () {
              if (_this.showIndex==1) {
                _this.getTicket();
              } else if (_this.showIndex == 4){
                _this.bindAccount();
              }
            })
            return
          }
          if (this.showIndex==1) {
            this.getTicket();
          } else if (this.showIndex == 4){
            this.bindAccount();
          }

        } else {
          this.$message.error('验证码输入有误！')
        }
      },
      //查看权限
      checkAuthority () {
        let _this = this
        if (this.showIndex == 1 || this.showIndex == 4) {
          if (localStorage.getItem('redirect_url') == 'undefined' || !localStorage.getItem('redirect_url')) {
            this.$message.error('请从活动入口进入！');
            this.$router.replace('/home')
          } else {
            this.url = localStorage.getItem('redirect_url')
            if (localStorage.getItem('phone') && localStorage.getItem('phone').length === 11) {
              this.isJoinActivity(localStorage.getItem('phone'), function () {
                _this.$router.push('/marketing/index')
              })
              if (localStorage.getItem('sharerId') == 'undefined' || !localStorage.getItem('sharerId')) {
                this.getSharerId()
              }
            }
          }
        }

      },
      //获取ID
      getSharerId (callback){
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/queryMemberIdByMobile',
          params: {
            mobile: localStorage.getItem('phone')
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data != '用户不存在') {
              localStorage.setItem('sharerId', response.data.data)
            }
            callback && callback(response.data.data)
          }
        })
      },
      //是否报过名
      isJoinActivity (phone, callback) {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiTransaction + 'netcard/presentShoes/join/isJoinActivity',
          params: {
            mobile: phone
          }
        }).then(function (response) {
          if (response) {
            callback && callback(response.data.data )
          }
        })
      },
      hidePop () {
        this.popShow = false
      },
      _initSc () {
        let _this = this
        this.$nextTick(()=>{
          // if (this.showIndex == 1 || this.showIndex == 4) {
            var ic = new smartCaptcha({
              renderTo: '#sc',
              width: '7.4rem',
              height: '1rem',
              default_txt: '获取验证码',
              success_txt: '获取成功，请查收短信',
              fail_txt: '获取失败，请在此点击按钮刷新',
              scaning_txt: '验证码发送中',
              success: function(data) {

                _this.$ajax({
                  method: 'post',
                  url: _this.$apiMember + 'afs/afsValidateWeb',
                  params: {
                    sessionId: data.sessionId,
                    sig: data.sig,
                    token: NVC_Opt.token,
                    scene: NVC_Opt.scene,
                    W5MALLTOKEN: _this.W5MALLTOKEN
                  }
                }).then(function (response) {
                  if (response) {
                    _this.scFlag = true
                    _this.sessionId = data.sessionId
                    _this.sendCode()
                  }
                })
              },
            });
            ic.init();
          // }
        })
      },
      sendCode (callback) {
        let _this = this
        if (!this.isLoginFlag) {
          let reg = /^1[0-9]{10}$/;
          if (!reg.test(this.phone)) {
            this.$message.warning('手机号码格式不正确！');
            return;
          }
        }

        if (this.phone.length != 11) {
          if (this.isLoginFlag) {
            this.getUserData(this.sendCodeAjax(callback))
          }
          return
        }

        if (this.scFlag){
          this.sendCodeAjax(callback)
        }else {
          this.$message.warning('请点击获取验证码按钮')
          return
        }
      },
      sendCodeAjax (callback) {
        let _this = this
        this.$ajax({
          method: 'post',
          url: _this.$apiMember + 'sms/sendCodeByAfs',
          params: {
            sessionId: this.sessionId,
            mobile : this.phone,
            W5MALLTOKEN: this.W5MALLTOKEN
          }
        }).then(function (response) {
          if (response) {
            _this.sendCodeFlag = true
            callback && callback()
          }
        })
      },
      getData () {
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
            this.$message.warning('手机号码格式不正确！');
            return;
          }
        }

        this.isJoinActivity(this.phone, function (flag) {
          if (flag == 1) {
            if (_this.showIndex == 1) {
              localStorage.setItem('phone', _this.phone)
              _this.$message.warning('您已经报名过活动！')
              _this.$router.replace('/marketing/index')
            } else if(_this.showIndex == 4) {
              _this.popShow = true
            }
          }else if (flag == 0) {
            _this.popShow = true
          }
        })


        // if (this.scFlag){
        //   if (this.sendCodeFlag) {
        //     this.popShow = true
        //   } else {
        //     this.sendCode(function () {
        //       _this.popShow = true
        //     })
        //   }
        // }else {
        //   this.$message.warning('请点击获取验证码按钮')
        //   return
        // }
      },
      getTicket () {
        if (this.loadingFlag === false) {
          this.loadingFlag = true
          let _this = this;
          let self = this
          this.$ajax({
            method: 'get',
            url: this.url,
            params:{
              mobile: this.phone,
              vcode: this.code,
              merchant: this.url.split('/')[this.url.split('/').length-1]
            }
          }).then(function (response) {
            _this.loadingFlag = false
            _this.code = ''
            if (response) {
              if (response.data.msg != '您已经超过领取上限') {
                _this.price = response.data.data
                localStorage.setItem('phone',_this.phone)
                _this.getSharerId()
                if (_this.showIndex==1) {
                  _this.$router.replace({
                    path: '/marketing/receiveTicketSuccess',
                    query: {
                      price: response.data.data,
                      sessionId: _this.sessionId,
                      phone: _this.phone,
                      W5MALLTOKEN: _this.W5MALLTOKEN
                    }
                  })
                } else if(_this.showIndex==4) {
                  _this.$router.replace({
                    path: '/marketing/receiveTicketSuccess',
                    query: {
                      price: response.data.data,
                      sessionId: _this.sessionId,
                      phone: _this.phone,
                      W5MALLTOKEN: _this.W5MALLTOKEN,
                      show_index: 2
                    }
                  })
                }



              } else {
                _this.$message.error(response.data.msg)
              }
            }
          }).catch(function (reason) {
            _this.loadingFlag = false
            // _this.$message.error('系统出错~')

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
    position: relative;
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
    margin-top: 1rem;
  }
  .phone {
    width: 7.2rem;
    height: 1.17rem;
    background: #e6e6e6;
    border: none;
    outline: none;
    text-align: center;
    font-size: .426rem;
    color: #333;
    border-radius: 0;
  }
  input::placeholder{
    color: rgb(153,153,153);
  }
  .submitBtn {
    text-align: center;
    margin-top: .26rem;
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
    padding-top: .93rem;
    font-size: 0;
    position: relative;
    text-align: center;
  }
  .template2Img {
    width: 5.9rem;
    margin-left: -0.2rem;
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
    color: #fff;
    text-align: center;
    margin-top: .3rem;
  }
  #sc {
    margin: .26rem auto 0;
    width: 7.4rem;
  }
  .margin-1 {
    margin-top: 1rem;
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
    z-index: 9999;
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
    /*display: flex;*/
    /*justify-content: space-between;*/
    margin-top: .46rem;
  }
  .popInput {
    border: 1px solid #b5b5b5;
    width: 100%;
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
  .price {
    position: absolute;
    top: 1.4rem;
    padding-left: -0.2rem;
    width: 100%;
    left: 0;
    z-index: 10;
    font-size: .53rem;
    color: #ff3050;
    font-weight: bold;
  }
  input  {
    -webkit-appearance: none;
  }
  .temp2Desc1 span{
    color: #333;
  }
  .temp2Desc2  {
    color: #333;
    font-size: .34rem;
  }
  .desc1 strong {
    color: #ff3050;
  }
  .tamp3Desc1 {
    color: #333;
  }
</style>
