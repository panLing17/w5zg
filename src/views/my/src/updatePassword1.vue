<template lang="pug">
  .updatePassword1
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{titleName}}
    .content
      .form
        .inputWrapper
          .phoneIcon
            img.icon(src="../../../assets/img/forget2.png")
          input.input(type="number", placeholder="请输入手机号", v-model="userData.mi_phone", readonly="readonly")
        .validateWrapper
          #sc(v-if="showSc")
          .timer(v-show="!showSc") {{timerText}}
        .inputWrapper
          .phoneIcon
            img.icon(src="../../../assets/img/forget1.png")
          input.input(type="text", placeholder="请输入验证码", v-model="form.code")
        .inputWrapper
          .phoneIcon
            img.icon(src="../../../assets/img/forget3.png")
          input.input(type="password", placeholder="新密码", v-model="form.pwd")
        .inputWrapper
          .phoneIcon
            img.icon(src="../../../assets/img/forget3.png")
          input.input(type="password", placeholder="确认密码", v-model="form.rightPwd")
      .rightBtn(@click="right") 确认
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    name: 'updatePassword1',
    data() {
      return {
        scFlag: false,
        sessionId: '',
        sendCodeFlag: false,
        showSc: true,
        status: true,
        timerText: '',
        form: {
          code: '',
          pwd: '',
          rightPwd: ''
        }
      }
    },
    computed: mapState(['userData']),

    created () {
      if (this.$route.query.routeParams == 1) {
        this.titleName = "修改登录密码"
        this.form.type = '3'
      } else if (this.$route.query.routeParams == 2) {
        this.titleName = "修改支付密码"
        this.form.type = '4'
      }
    },
    destroyed () {
      this.timer && clearInterval(this.timer)
    },
    mounted() {
      this._initSc()
    },
    methods: {
      right () {
        // 验证
        if (!/^1[0-9]{10}$/.test(this.userData.mi_phone)) {
          this.$message.error('手机号码格式不正确！')
          return
        }
        if (this.form.code.length!=6) {
          this.$message.error('手机验证码格式不正确！')
          return
        }
        if (!/^\S{6,20}$/.test(this.form.pwd)) {
          this.$message.error('密码只能6-20位字母与数字组合！')
          return
        }
        if (this.form.pwd!=this.form.rightPwd) {
          this.$message.error('两次密码输入不一致！')
          return
        }
        let self = this
        if (!this.status) {
          return
        }
        this.status = false

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/validationLoginIn',
          params: {
            vcode: this.form.code,
            type: this.form.type
          }
        }).then(function (response) {
          if (response.data.optSuc) {
            self.$ajax({
              method: 'post',
              url: self.$apiMember + 'member/resetPwdLoginIn',
              params: {
                pwd: self.form.pwd
              }
            }).then(function (response) {
              self.status = true
              if (response && response.data.optSuc) {
                self.$message.success('修改成功')
                // 成功跳转页面
                self.$router.push({path: '/my/accountSafety'})
              }
            })
          }
        }).catch(function () {
          self.status = true
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
        if (!/^1[0-9]{10}$/.test(this.userData.mi_phone)) {
          this.$message.error('手机号码格式不正确！')
          this.scFlag = false
          this.showSc = false
          this.$nextTick(() => {
            this.showSc = true
            this._initSc()
          })
          return
        }
        let _this = this
        this.$ajax({
          method: 'post',
          url: _this.$apiMember + 'sms/sendCodeByAfs',
          params: {
            sessionId: this.sessionId,
            mobile : this.userData.mi_phone
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
      },
    }
  }
</script>

<style scoped>
  .updatePassword1 {
    height: 100vh;
    background-color: rgb(242, 242, 242);
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
