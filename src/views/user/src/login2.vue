<template lang="pug">
  .phoneLogin
    .content
      .form
        .phone
          .iconWrapper
            img.icon(:src="!iconFlag.phone?require('../../../assets/img/login/Icon_phone@2x.png'):require('../../../assets/img/login/Icon_phone_checked@2x.png')")
          input.input(type="number", pattern="1[0-9]{10}", placeholder="手机号", v-model="form.phone", @input="lightUp")
          .iconWrapper(v-show="form.phone.length", @click="clear")
            img.icon(src="../../../assets/img/login/Icon_del@2x.png")
        .zhinengWrapper
          #sc(v-if="showSC")
          .timer(v-show="!showSC")  {{timerNum}} 秒后可重新获取
        .code
          .iconWrapper
            img.icon(:src="!iconFlag.code?require('../../../assets/img/login/Icon_editor@2x.png'):require('../../../assets/img/login/Icon_editor_checked@2x.png')")
          input.input(type="text", placeholder="验证码", v-model="form.code", @input="lightUp")
      .btn(@click="login") 登入 / 注册
      .tips(@click="$refs.agreement.mShow()") 用户注册代表同意<span>《万物直供用户协议》</span>
      .call 客服电话: 4008-947-999
    transition(name="fade")
      .mask(v-if="popShow.code", @click="hidePop")
    agreement(ref="agreement")
</template>

<script>
  import BScroll from 'better-scroll'
  import Agreement from '@/views/common/src/agreement'
  import {getUserData} from 'assets/js/mixin'
  export default {
    name: "login2",
    mixins: [getUserData],
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
        form: {
          phone: '',
          code: ''
        },
        scFlag: false,
        sessionId: '',
        sendCodeFlag: false,
        showSC: true,
        timer: null,
        timerNum: 60
      }
    },
    created () {
      this.getToken()
    },
    mounted () {
      this._initSc()
    },
    beforeDestroy () {
      if (this.timer) {
        clearInterval(this.timer)
      }
    },
    methods: {
      clear() {
        this.form.phone = ''
        this.lightUp()
      },
      _initSc () {
        let _this = this
        this.$nextTick(()=>{
          var ic = new smartCaptcha({
            renderTo: '#sc',
            width: '8rem',
            height: '1.2rem',
            default_txt: '获取验证码',
            success_txt: '获取成功，请查收短信',
            fail_txt: '点击按钮刷新',
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
                      _this.showSC = false
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
      sendCodeAjax () {
        let _this = this
        if (!this.phoneReg.test(this.form.phone)) {
          this.scFlag = false
          this.$notify({
            content: '手机号格式不正确',
            bottom: 4
          })
          this.$nextTick(()=>{
            this.showSC = true
            this._initSc()
          })
        } else {
          this.$ajax({
            method: 'post',
            url: _this.$apiMember + 'sms/sendCodeByAfs',
            params: {
              sessionId: this.sessionId,
              mobile: this.form.phone,
              W5MALLTOKEN: this.W5MALLTOKEN
            }
          }).then(function (response) {
            _this.popShow.code = false
            if (response) {
              _this.$notify({
                content: '验证码已发送，请稍后',
                bottom: 4
              })
              _this.sendCodeFlag = true
              //倒计时
              let count = 60
              if (_this.timer) {
                clearInterval(_this.timer)
              }
              _this.timer = setInterval(() => {
                count--
                if (count < 0) {
                  clearInterval(_this.timer)
                  _this.showSC = true
                  _this.scFlag = false
                  _this.timerNum = 60
                  _this._initSc()
                } else {
                  _this.timerNum = count
                }

              }, 1000)
            } else {
              _this.showSC = true
            }
          })
        }
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
        if (this.form.code.trim().length!=4) {
          this.$message.error('请输入正确手机验证码！');
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
            self.getUserData()
            localStorage.setItem('token',response.data.data)
            self.$router.go(-1)
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
      sendCode () {
        if (!this.phoneReg.test(this.form.phone)) {
          this.$message.error('手机号码格式不正确！');
          return;
        }
        if (this.showSC) {
          this.popShow.code = true
        }

      },
      lightUp () {
        if (this.phoneReg.test(this.form.phone)) {
          this.iconFlag.phone = true
        }else {
          this.iconFlag.phone = false
        }
        if(this.form.code.length === 4) {
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
    background: #fff;
    width: 100%;
    position: absolute;
    z-index: 100;
  }
  .content {
    background: #fff;
    width: 8rem;
    margin: 0 auto;
    height: calc(100vh - 1.3rem);
    position: relative;
  }
  .form {
    padding: .8rem 0 0;
  }
  .phone, .code {
    height: 1.17rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #999;
  }
  .iconWrapper {
    flex: none;
  }

  .input {
    margin-left: .19rem;
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    color: rgb(51,51,51);
    font-size: .37rem;
  }
  .code {
    margin-top: .21rem;
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
  .icon {
    width: .64rem;
  }
  .btn {
    margin: 1rem auto 0;
    width: 6.9rem;
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
    /*width: 8rem;*/
    width: 300px;
    /*border-radius: .21rem;*/
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
    margin-top: .53rem;
    font-size: .29rem;
    color: #333;
    text-align: center;
  }
  .tips span {
    color: #f70057;
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
  .zhinengWrapper {
    margin-top: .42rem;
    width: 8rem;
    height: 1.2rem;
  }
  #sc {
    margin: 0 auto;
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
  .call {
    font-size:.32rem;
    color:rgba(102,102,102,1);
    margin-top: 4.5rem;
    width: 100%;
    text-align: center;
  }
  .timer {
    width: 100%;
    height: 100%;
    background: #ccc;
    color: #fff;
    font-size: .37rem;
    line-height: 1.2rem;
    text-align: center;
  }
</style>
