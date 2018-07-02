<template lang="pug">
  .wrap
    .contentWrapper
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/01_index_1.png")
      .content
        input.phoneInput(type="number", placeholder="请输入手机号登录", v-model="phone")
        .bindBtn(@click="submit")
          img.bindBtnImg(src="../../../../../assets/img/bindMobile1.png")
      transition(name="fade")
        .mask(v-show="popShow", @click="hidePop")
      transition(name="fade")
        .popWrapper(v-show="popShow")
          .popDesc 我们会通过短信的形式，发送验证码至您的手机，请注意查收。
          #sc(ref="sc")
          .popInputWrapper
            input.popInput(type="text", placeholder="请输入验证码", v-model="code")
          .popBtn(@click="checkCode") 立即参与
</template>

<script>
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  export default {
    name: "bindMobile",
    data () {
      return {
        phone: '',
        popShow: false,
        W5MALLTOKEN: '',
        scFlag: false,
        sessionId: '',
        code: ''
      }
    },
    created () {
      this.getToken()
    },
    mounted (){
      document.title = '送耐克活动'
      this.loadShare()
      this._initSc()
    },
    methods: {
      getLocationHref () {
        let href1 = window.location.href.split('/#')
        let href2 = window.location.href.split('/?')
        if (href1.length <= 1) {
          return href2[0]
        } else {
          return href1[0]
        }
      },
      // 分享
      loadShare () {
        console.log(this.getLocationHref())
        let _this = this
        if (localStorage.getItem('sharerId') == 'undefined' || !localStorage.getItem('sharerId')) {
          if (localStorage.getItem('phone') && localStorage.getItem('phone').length === 11) {
            this.getSharerId(function (data) {
              if (data != 'null') {
                _this.$initShare({
                  sharePhoto: _this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + data).replace(/\?*#/, "?#")
                })
              } else {
                _this.$initShare({
                  sharePhoto: _this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: (_this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
                })
              }
            })
          } else {
            this.$initShare({
              sharePhoto: this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
              shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
              shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
              link: (this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
            })
          }
        } else {
          this.$initShare({
            sharePhoto: this.getLocationHref() + '/' + shareImg.split('/w5mall-web/')[1],
            shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
            shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
            link: (this.getLocationHref() + '/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + localStorage.getItem('sharerId')).replace(/\?*#/, "?#")
          })
        }
      },
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
            if (response.data.data != 'null') {
              localStorage.setItem('sharerId', response.data.data)
            }
            callback && callback(response.data.data)
          }
        })
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
      _initSc () {
        let _this = this
        this.$nextTick(()=>{
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
        })
      },
      sendCode () {
        if (this.scFlag){
          this.sendCodeAjax()
        }else {
          this.$message.warning('请点击获取验证码按钮')
          return
        }
      },
      //发送验证码
      sendCodeAjax () {
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

          }
        })
      },
      checkCode () {
        if (this.code.length === 6 ) {
          if (this.scFlag) {
            this.bindAccount()
          } else {
            this.$message.error('请获取点击获取验证码按钮！')
          }

        } else {
          this.$message.error('验证码输入有误！')
        }
      },
      //绑定手机
      bindAccount () {
        let _this = this
        this.$ajax({
          method: 'post',
          url: _this.$apiMember + 'member/bindAccount',
          params: {
            unionId: localStorage.getItem('unionId'),
            mobile : this.phone,
            W5MALLTOKEN: this.W5MALLTOKEN,
            vcode: this.code
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data == 'Already Bind') {
              _this.$message.error('此微信号已绑定过手机号，请输入正确手机号！')
              window.location.reload()
            } else {
              localStorage.setItem('phone', _this.phone)
              _this.joinActivity()
            }
          }
        })
      },
      //参加活动
      joinActivity () {
        let _this = this
        this.$ajax({
          method: 'get',
          url: _this.$apiApp + 'presentShoes/joinActivity',
          params: {
            unionId: localStorage.getItem('unionId')
          }
        }).then(function (response) {
          if (response) {
            _this.$router.push({path: '/marketing/assisting', query: {temp: 2}})
          }
        })
      },
      hidePop () {
        this.popShow = false
      },
      submit () {
        if (!/^1[0-9]{10}$/.test(this.phone)) {
          this.$message.warning('手机号码格式不正确！');
          return;
        }
        this.getSharerId()
      },
      //获取sharerId
      getSharerId (callback){
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/queryMemberIdByMobile',
          params: {
            mobile: this.phone
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data != 'null') {
              localStorage.setItem('sharerId', response.data.data)
              self.bindAccount()
            } else {
              self.popShow = true
            }

          }
        })
      },
    }
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
    padding-bottom: .6rem;
  }
  .phoneInput {
    width: 8.2rem;
    height: 1.17rem;
    text-align: center;
    font-size: .4rem;
    color: #333;
    border-radius: .58rem;
    border: none;
    outline: none;
    margin-top: .66rem;
  }
  .bindBtn {
    font-size: 0;
    margin-top: .48rem;
  }
  .bindBtnImg {
    width: 8.5rem;
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
  .popBtn {
    border-radius: .2rem;
    line-height: .93rem;
    text-align: center;
    color: #fff;
    background: linear-gradient(#ffab8d, #ff3050);
    margin-top: .37rem;
    font-size: .37rem;
  }
  #sc {
    margin: .26rem auto 0;
    width: 7.4rem;
  }
</style>
