<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 注册
      .topRight(slot="right")
    .form
      w-input(label="新密码：", label-width="2rem", placeholder="请输入密码", :type="passwordType", v-model="form.pwd", required,:error="passwordError",@blur="checkPwd")
      w-input(label="确认密码：", label-width="2rem", placeholder="请再次输入密码", :type="passwordType", v-model="qrPassword", required,:error="qrPasswordError")
      button.regButton(@click="sureBtn") 确定
</template>

<script>
  export default {
    name: 'register',
    data () {
      return {
        showPassword: false,
        passwordType: 'password',
        qrPassword: '',
        passwordError: '',
        qrPasswordError: '',
        pwdStatus: false,
        form: {
          mobile: '',
          pwd: '',
          checkCode: '',
          regWay: '103'
        }
      }
    },
    mounted () {
      this.form.mobile = this.$route.query.mobile
      this.form.checkCode = this.$route.query.vcode
    },
    methods: {
      checkPwd () {
        //校验规则 正则表达式  只允许输入 数字跟字母
        var reg = /^[A-Za-z0-9]{6,32}$/;
        if(!reg.test(this.form.password)){
          this.passwordError = '密码必须由6-16位字母、数字组成'
          return
        }
        this.passwordError = ''
        this.pwdStatus = true
      },
      sureBtn () {
        console.log(this.form.mobile)
        console.log(this.form.checkCode)
        let self = this
        if (self.form.mobile == '' || self.form.password == '') {
          self.phoneError = ''
          self.checkCodeError = ''
          return
        }

        if(!this.pwdStatus){
          return
        }

        if(self.form.pwd != self.qrPassword){
          self.qrPasswordError = '新密码”与“确认密码”不一致！'
        }
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/register',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            // 成功跳转页面
            self.$router.push({path: '/regOver'})
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
  .tips{
    margin-top: .2rem;
    font-size: .3rem;
    color: rgb(153,153,153);
  }
</style>
