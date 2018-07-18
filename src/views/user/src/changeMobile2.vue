<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 更换手机号
      .topRight(slot="right")
    .content
      .form
        .inputWrapper
          .phoneIcon
            img.icon(src="../../../assets/img/forget2.png")
          input.input(type="number", placeholder="请输入手机号", v-model="form.phone")
        .validateWrapper
          #sc(v-if="showSc")
          .timer(v-show="!showSc") {{timerText}}
        .inputWrapper
          .phoneIcon
            img.icon(src="../../../assets/img/forget1.png")
          input.input(type="text", placeholder="请输入验证码", v-model="form.code")
      .rightBtn(@click="right") 提交
</template>

<script>
  export default {
    name: 'changeMobile2',
    data () {
      return {
        scFlag: false,
        sessionId: '',
        sendCodeFlag: false,
        showSc: true,
        status: true,
        timerText: '',
        form: {
          phone: '',
          code: ''
        }
      }
    },
    mounted () {
      this._initSc()
    },
    destroyed () {
      this.timer && clearInterval(this.timer)
    },
    methods: {
      right () {
        if (!/^1[0-9]{10}$/.test(this.form.phone)) {
          this.$message.error('手机号码格式不正确！')
          return
        }
        let self = this
        this._checkPhone((flag) =>{
          if (flag) {
            if (this.form.code.length!=6) {
              this.$message.error('手机验证码格式不正确！')
              return
            }

            if (!this.status) {
              return
            }
            this.status = false
            self.$ajax({
              method: 'post',
              url: self.$apiMember + 'asec/changeMobileAfs',
              params: {
                mobile: this.form.phone,
                vcode: this.form.code,
                sessionId: this.sessionId
              }
            }).then(function (response) {
              self.status = true
              if (response && response.data.optSuc) {
                self.$message.success('修改成功')
                self._getUserData()
                // 成功跳转页面
                self.$router.push({path: '/my/accountSafety'})
              }
            })
          }
        })
      },
      _getUserData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          if (response) {
            self.$store.commit('userDataChange',response.data.data)
          }
        })
      },
      _checkPhone (callback) {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/mobile/isExist',
          params: {
            mobile: this.form.phone,
            type: '1'
          }
        }).then(function (response) {
          callback && callback(Boolean(response.data.data))
        }).catch(function () {
          callback && callback(false)
        })
      },
      _initSc () {
        let _this = this
        this.$nextTick(()=>{
          var ic = new smartCaptcha({
            renderTo: '#sc',
            width: '9.2rem',
            height: '1.17rem',
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
                    scene: NVC_Opt.scene
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
      sendCodeAjax () {
        if (!/^1[0-9]{10}$/.test(this.form.phone)) {
          this.$message.error('手机号码格式不正确！')
          this.scFlag = false
          this.showSc = false
          this.$nextTick(() => {
            this.showSc = true
            this._initSc()
          })
          return
        }
        this._checkPhone((flag) => {
          if (flag) {
            let _this = this
            this.$ajax({
              method: 'post',
              url: _this.$apiMember + 'sms/sendCodeByAfs',
              params: {
                sessionId: this.sessionId,
                mobile : this.form.phone
              }
            }).then(function (response) {
              if (response) {
                _this.showSc = false
                _this.sendCodeFlag = true
                let count = 60
                _this.timerText = count + 's'
                _this.timer && clearInterval(_this.timer)
                _this.timer = setInterval(()=>{
                  count--
                  if (count <= 0) {
                    clearInterval(_this.timer)
                    _this.showSc = true
                    _this.scFlag = false
                    _this._initSc()
                  } else {
                    _this.timerText = count + 's'
                  }

                }, 1000)
              }
            })
          } else {
            this.scFlag = false
            this.showSc = false
            this.$nextTick(() => {
              this.showSc = true
              this._initSc()
            })
          }
        })

      }
    }
  }
</script>

<style scoped>
  .registerBox {
    min-height: 100vh;
    background: rgb(242,242,242);
  }
  input::placeholder{
    color: rgb(153,153,153);
  }
  input  {
    -webkit-appearance: none;
  }
  .form {
    padding: .53rem .4rem .26rem;
  }
  .inputWrapper {
    height: 1.17rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 .13rem 0;
    margin-bottom: .26rem;
  }
  .icon {
    width: .64rem;
  }
  .phoneIcon {
    flex: none;
  }
  .input {
    flex: 1;
    height: 100%;
    border: none;
    outline: none;
    margin-left: .13rem;
    font-size: 13px;
    color: #333;
  }
  .validateWrapper {
    margin-bottom: 0.26rem;
  }
  #sc {
    width: 9.2rem;
    margin: 0;
  }
  .timer {
    text-align: center;
    color: #999;
    font-size: 13px;
    line-height: 1.17rem;
  }
  .rightBtn {
    width: 6.9rem;
    height: 1rem;
    color: #fff;
    background-color: rgb(245,0,87);
    font-size: 14px;
    margin: 0 auto;
    border-radius: .5rem;
    text-align: center;
    line-height: 1rem;
  }
</style>
