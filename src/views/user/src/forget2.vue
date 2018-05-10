<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 忘记密码
      .topRight(slot="right")
    .form
      w-input(label="手机验证码：", label-width="2.5rem", placeholder="请输入手机验证码", v-model="form.vcode", @blur="checkVcode", :error="vcodeError" required)
      w-input(label="输入新密码：", label-width="2.5rem", placeholder="请输入新密码",:type="passwordType", v-model="form.pwd", required,:error="passwordError",@blur="checkPwd")
      w-input(label="确认新密码：", label-width="2.5rem", placeholder="请再次输入新密码",:type="passwordType", v-model="qrPassword", required, :error="qrPasswordError")
      button.regButton(@click="sureBtn",:class="{regButtonGray:pwdStatus}") 确定
</template>

<script>
  export default {
    name: 'register',
    data () {
      return {
        passwordType: 'password',
        qrPassword: '',
        passwordError: '',
        qrPasswordError: '',
        pwdStatus: true,
        form: {
          mobile: '',
          pwd: '',
          vcode: ''
        },
        vcodeError: ''
      }
    },
    computed: {
      password () {
        return this.form.pwd
      },
      vcode () {
        return this.form.vcode
      }
    },
    mounted () {
      this.form.mobile = this.$route.query.mobile
    },
    watch:{
      password () {
        this.allCheck()
      },
      vcode () {
        this.allCheck()
      },
      pwdStatus () {
        this.allCheck()
      }
    },
    methods: {
      allCheck () {
        if (this.form.pwd === this.qrPassword && this.form.vcode.length>3 && this.qrPassword.length>5) {
          this.pwdStatus = false
        } else {
          this.pwdStatus = true
        }
      },
      checkPwd () {
        // 校验规则 正则表达式  只允许输入 数字跟字母
        var reg = /^\S{6,20}$/;
        if(!reg.test(this.form.pwd)){
          this.passwordError = $code('268')
          return
        }
        this.passwordError = ''
        this.pwdStatus = false
      },
      checkVcode () {
        if (this.form.vcode.length<4) {
          this.vcodeError = '请输入正确验证码'
        } else {
          this.vcodeError = ''
        }
      },
      sureBtn () {
        let self = this
        if (self.form.mobile == '' || self.form.pwd == '' || self.form.vcode == '') {
          self.phoneError = ''
          self.checkCodeError = ''
          return
        }

        if (this.pwdStatus) {
          return
        }

        if(self.form.pwd != self.qrPassword){
          self.qrPasswordError = $code('269')
          return
        }
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/resetPassword',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            // 成功跳转页面
            self.$router.push({path: '/my'})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .registerBox{
    min-height: 100vh;
    background: rgb(242,242,242);
  }
  .form{
    margin-top: 1.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .inputButton{
    width: 2rem;
    height: .9rem;
    background: #666;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .regButton {
    margin-top: 1rem;
    width: 7rem;
    height: 1rem;
    background-color: rgb(245,0,87);
    color: white;
    font-size: .4rem;
    border: none;
    outline: none;
    border-radius: .5rem;
  }
  .regButtonGray {
    background-color: rgb(192, 192, 192) !important;
  }
  .tips{
    margin-top: .2rem;
    font-size: .3rem;
    color: rgb(153,153,153);
  }
</style>
