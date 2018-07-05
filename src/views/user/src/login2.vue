<template lang="pug">
  .phoneLogin
    <!--nav-bar(background="white")-->
      <!--.topLeft(slot="left", @click="$router.go(-1)")-->
        <!--img(src="../../../assets/img/back@2x.png", style="width:.3rem")-->
      <!--.topCenter(slot="center") 验证码登录-->
      <!--.topRight(slot="right")-->
    .content
      .form
        .phone
          .iconWrapper
            img.icon(:src="!iconFlag.phone?require('../../../assets/img/用户图标@2x.png'):require('../../../assets/img/用户图标-点亮@2x.png')")
          input.input(type="number", placeholder="请输入您的手机号", v-model="form.phone", @input="lightUp")
        .code
          .iconWrapper
            img.icon(:src="!iconFlag.code?require('../../../assets/img/密码2@2x.png'):require('../../../assets/img/密码-点亮@2x.png')")
          input.input(type="text", placeholder="请输入手机验证码", v-model="form.code", @input="lightUp")
          .codeBtn(:style="{background:codeBtn.bg}", @click="sendCode") {{codeBtn.text}}
      .btn(@click="login") 登入 / 注册
      .tips(@click="$refs.agreement.mShow()") 《万物直供用户协议》
    transition(name="fade")
      .mask(v-if="popShow.code", @click="hidePop")
    <!--transition(name="fade")-->
      <!--.popWrapper(v-if="popShow.code")-->
        <!--.close(@click.stop="hidePop")-->
        <!--.popContent-->
          <!--.imgWrapper-->
            <!--img.codeImg(:src="codeUrl")-->
          <!--.refresh(@click="getImgCode")-->
            <!--img.refreshImg(src="../../../assets/img/refresh@2x.png")-->
        <!--.inputWrapper-->
          <!--ul.inputList(@click="codeFocus")-->
            <!--li.inputItem {{codeItem[0]}}-->
            <!--li.inputItem {{codeItem[1]}}-->
            <!--li.inputItem {{codeItem[2]}}-->
            <!--li.inputItem {{codeItem[3]}}-->
          <!--input.trueInput(ref="trueInput", @input="writeCode", v-model="code")-->
    agreement(ref="agreement")
    transition(name="fade")
      .popWrapper(v-show="popShow.code")
        .close(@click.stop="hidePop")
        .popContent
          #sc
</template>

<script>
  import BScroll from 'better-scroll'
  import Agreement from '@/views/common/src/agreement'
  export default {
    name: "login2",
    components: {
      Agreement
    },
    data () {
      return {
        loginFlag: true,
        phoneReg: /^1[0-9]{10}$/,
        codeFlag: true,
        W5MALLTOKEN:'',
        codeItem: [],
        code: '',
        popShow: {
          tips: false,
          code: false
        },
        codeUrl: '',
        version: 0,
        iconFlag: {
          phone: false,
          code: false,
        },
        codeBtn: {
          text: '发送验证码',
          bg: 'rgb(245,0,87)'
        },
        form: {
          phone: '',
          code: ''
        },
        scFlag: false,
        sessionId: '',
        sendCodeFlag: false

      }
    },
    created () {
      this.getToken()
    },
    mounted () {
      this._initSc()
    },
    methods: {
      _initSc () {
        let _this = this
        this.$nextTick(()=>{
          var ic = new smartCaptcha({
            renderTo: '#sc',
            width: '6.5rem',
            height: '1rem',
            default_txt: '获取验证码',
            success_txt: '获取成功，请查收短信',
            fail_txt: '获取失败，请在此点击按钮刷新',
            scaning_txt: '验证码发送中',
            success: function(data) {
              if (!_this.scFlag) {
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
                    _this.sendCodeAjax()
                  }
                })
              }
            }
          });
          ic.init();
        })
      },
      sendCodeAjax (callback) {
        let _this = this
        this.$ajax({
          method: 'post',
          url: _this.$apiMember + 'sms/sendCodeByAfs',
          params: {
            sessionId: this.sessionId,
            mobile : this.form.phone,
            W5MALLTOKEN: this.W5MALLTOKEN
          }
        }).then(function (response) {
          _this.popShow.code = false
          if (response) {
            _this.sendCodeFlag = true
            callback && callback()
          }
        })
      },
      openTips () {
        this.popShow.tips=true
        this.$nextTick(()=>{
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.agreementWrapper, {
              click: true
            })
          }
        })
      },
      hidePop () {
        this.popShow.code = false
        this.code = ''
        this.codeItem = []
      },
      login () {
        if (!this.phoneReg.test(this.form.phone)) {
          this.$message.error('手机号码格式不正确！');
          return
        }
        if (this.form.code.trim().length!=6) {
          this.$message.error('请输入正确手机验证码！');
          return
        }
        if (!this.scFlag) {
          this.$message.error('请点击获取验证码按钮！');
          return
        }
        if (!this.loginFlag) {
          return
        }
        this.loginFlag = false
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/register',
          params: {
            mobile: this.form.phone,
            pwd: this.form.code,
            checkCode: this.form.code,
            regWay: '103'
          }
        }).then(function (response) {
          self.loginFlag = true
          if (response && response.data.optSuc) {
            localStorage.setItem('token',response.data.data)
            self.$router.push('/my')
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
            // self.getImgCode()
          }
        })
      },
      // writeCode () {
      //   if (this.code.trim().length > 4) {
      //     this.code = this.code.substring(0,4)
      //     return
      //   }
      //   this.codeItem = this.code.split('')
      //   if (this.code.trim().length === 4) {
      //     if (!this.codeFlag) {
      //       return
      //     }
      //     this.codeFlag = false
      //     let self = this
      //     self.$ajax({
      //       method: 'post',
      //       url: self.$apiMember + 'sms/sendCode',
      //       params: {
      //         mobile: this.form.phone,
      //         gCode: this.code,
      //         W5MALLTOKEN: this.W5MALLTOKEN
      //       }
      //     }).then(function (response) {
      //       self.code = ''
      //       self.codeItem = []
      //       if (response && response.data.optSuc) {
      //         self.$message.success($code('2612'))
      //         self.popShow.code = false
      //         self.codeBtn.bg = '#999'
      //         let count = 60;
      //         self.codeBtn.text = count+'s'
      //         let timer = setInterval(()=> {
      //           count--;
      //           self.codeBtn.text = count+'s'
      //           if (count===0) {
      //             self.codeBtn.bg = 'rgb(245,0,87)'
      //             self.codeBtn.text = '重新发送'
      //             self.codeFlag = true
      //             clearInterval(timer)
      //           }
      //         },1000)
      //       }else{
      //         self.getImgCode()
      //         self.codeFlag = true
      //       }
      //     })
      //   }
      // },
      // codeFocus () {
      //   this.$nextTick(() => {
      //     this.$refs.trueInput.focus()
      //   })
      // },
      // getImgCode () {
      //   this.version += 1
      //   this.codeUrl = this.$apiMember + 'member/picCode/150/75/60?v=' + this.version + '&W5MALLTOKEN=' + this.W5MALLTOKEN
      // },
      sendCode () {
        if (!this.phoneReg.test(this.form.phone)) {
          this.$message.error('手机号码格式不正确！');
          return;
        }
        this.popShow.code = true
        // this.codeFocus()

      },
      lightUp () {
        if (this.phoneReg.test(this.form.phone)) {
          this.iconFlag.phone = true
        }else {
          this.iconFlag.phone = false
        }
        if(this.form.code.length === 6) {
          this.iconFlag.code = true
        }else {
          this.iconFlag.code = false
        }
      }
    }
  }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:#999;
  }
  .phoneLogin {
    background: rgb(242,242,242);
    width: 100%;
    position: absolute;
    z-index: 100;
  }
  .content {
    background: #fff;
    height: calc(100vh - 1.3rem);
  }
  .form {
    padding: 1.5rem 1rem 0;
  }
  .phone, .code {
    height: 1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
  }
  .iconWrapper {
    flex: none;
    width: 1rem;
  }
  .phone .icon {
    width: .4rem;
  }
  .input {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    color: rgb(51,51,51);
    font-size: .4rem;
  }
  .code {
    margin-top: 1.2rem;
  }
  .codeBtn {
    flex: none;
    width: 2.26rem;
    height: 100%;
    line-height: 1rem;
    color: #fff;
    text-align: center;
    border-radius: .2rem;
    font-size: .4rem;
  }
  .code .icon {
    width: .46rem;
  }
  .btn {
    margin: 2.37rem auto 0;
    width: 6rem;
    height: 1rem;
    font-size: .4rem;
    color: #fff;
    text-align: center;
    line-height: 1rem;
    background: rgb(245,0,87);
    border-radius: .6rem;
  }
  img {
    pointer-events: none;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, .5);
    z-index: 10;
  }
  .popWrapper {
    width: 8rem;
    border-radius: .21rem;
    position: absolute;
    top: 3rem;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    z-index: 20;
  }
  .close {
    width: .63rem;
    height: .63rem;
    position: absolute;
    top: 0;
    right: 0;
    background: url("../../../assets/img/cancle@2x.png") no-repeat center center;
    background-size: .37rem .37rem;
  }
  .popContent {
    margin-top: .8rem;
    /*display: flex;*/
    /*align-items: center;*/
    padding-bottom: .8rem;
  }
  .imgWrapper {
    flex: 1;
    font-size: 0;
    text-align: right;
  }
  .codeImg {

  }
  .refresh {
    flex: none;
    padding: .26rem .85rem .26rem .26rem;
  }
  .refreshImg {
    width: .48rem;
    height: .48rem;
  }
  .inputWrapper {
    margin-top: .2rem;
    padding-bottom: .4rem;
    position: relative;
    text-align: center;
  }
  .inputList {
    height: 1rem;
    display: flex;
    justify-content: center;
  }
  .inputItem {
    width: .8rem;
    border-bottom: 1px solid rgb(153,153,153);
    margin-right: .4rem;
    font-size: .4rem;
    line-height: 1rem;
    text-align: center;
  }
  .inputItem:last-child {
    margin: 0;
  }
  .trueInput {
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 1rem;
    opacity: 0;
    color:transparent;
    text-indent: -999em;
    margin-left: -100%;
  }
  .tips {
    margin-top: 2rem;
    font-size: .3rem;
    color: #999;
    text-align: center;
  }
  .agreementWrapper {
    position: absolute;
    top: 3rem;
    left: 10%;
    background: #fff;
    width: 80%;
    height: 70%;
    z-index: 200;
    border-radius: .1rem;
    overflow: hidden;
  }
  .wrapper {
    height: calc(100% - 1rem);
  }
  .agreementHeader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1rem;
    text-align: center;
    font-size: .4rem;
    font-weight: bold;
    line-height: 1rem;
    background: #fff;
    z-index: 10;
  }
  .agreementClose {
    position: absolute;
    top: .1rem;
    right: 11%;
    width: .5rem;
    height: .5rem;
    background: url("../../../assets/img/cancle@3x.png") no-repeat center center;
    background-size: .3rem .3rem;
  }
  .agreementContent {
    margin-top: 1rem;
    width: 100%;
    /*height: calc(100% - 1rem);*/
    overflow: auto;
    line-height: 1.5;
    padding: 0 .2rem;
    text-align: justify;
    word-wrap:break-word;
    word-break:break-all;
    font-size: .32rem;
  }
  .section {
    text-indent: 2em;
  }
  .title1 {
    text-indent: 2em;
    font-weight: bold;
  }
  .title2 {
    font-weight: bold;
    margin-right: .1rem;
  }
  #sc {
    margin: .1rem auto 0;
    width: 6.5rem;
  }
  input  {
    -webkit-appearance: none;
  }
  .codeInput {
    width: 6.5rem;
    height: 1rem;
    margin: 0 auto;
    border: 1px solid #ddd;
    outline: none;
    padding-left: .5rem;
  }
</style>
