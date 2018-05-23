<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 注册
      .topRight(slot="right")
    .form
      w-input(label="新密码：", label-width="2rem", placeholder="必须是6-20个英文字母、数字或符号", :type="passwordType", v-model="form.pwd", required,:error="passwordError",@w-blur="checkPwd")
      w-input(label="确认密码：", label-width="2rem", placeholder="请再次输入密码", :type="passwordType", v-model="qrPassword", required,:error="qrPasswordError")
      button.regButton(@click="sureBtn",:class="{regButtonGray:pwdStatus}") 提交
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
        pwdStatus: true,
        // 提交成功flag，true可以下一步，false不可以
        submitButtonFlag: false,
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
        this.pwdStatus = true
        //校验规则 正则表达式  只允许输入 数字跟字母
        var reg = /^\S{6,20}$/;
        if(!reg.test(this.form.pwd)){
          this.passwordError = $code('268')
          return
        }
        this.passwordError = ''
        this.pwdStatus = false
      },
      sureBtn () {
        if (!this.submitButtonFlag) {
          this.$message.warning('网络请求中，请稍后')
          return
        } else {
          this.submitButtonFlag = true
        }
        let self = this
        if (self.form.mobile == '' || self.form.pwd == '') {
          self.phoneError = ''
          self.checkCodeError = ''
          return
        }

        if(this.pwdStatus){
          return
        }

        if(self.form.pwd != self.qrPassword){
          self.qrPasswordError = $code('269')
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/register',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            localStorage.setItem('token',response.data.data)
            self.getTicket()
          }
        })
      },
      // 注册成功送现金券
      getTicket () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiTransaction + 'netcardrule/reg/present',
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.getTicket2(response.data.data)
          }
        })
      },
      getTicket2 (url) {
        let self = this
        self.$ajax({
          method: 'get',
          url: url,
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.$store.commit('setTicketMoney', response.data.data)
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
  .regButtonGray {
    background-color: rgb(192, 192, 192) !important;
  }
  .tips{
    margin-top: .2rem;
    font-size: .3rem;
    color: rgb(153,153,153);
  }
</style>
