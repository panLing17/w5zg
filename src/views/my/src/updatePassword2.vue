<template lang="pug">
  .updatePassword2
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{titleName}}
    .form
      w-input(v-model="form.pwd", label="新密码：", label-width="2.5rem",placeholder="请输入密码", :type="passwordType", input-button=true, :error="passwordError", required,@w-blur="checkPwd")
      w-input(v-model="qrPassword",label="确认新密码：", label-width="2.5rem", placeholder="请再次输入密码", :type="passwordType", input-button=true, :error="qrPasswordError", required)
      button.regButton(@click="sureBtn",:class="{regButtonGray:pwdStatus}") 提交
</template>
<script>

  export default {
    name: 'updatePassword2',
    data () {
      return {
        form: {
          pwd: ''
        },
        qrPassword: '',
        passwordError: '',
        qrPasswordError: '',
        pwdStatus: true,
        passwordType: 'password',
        bizzType :this.$route.query.routeParams,
        titleName:''
      }
    },
    created (){
      if (this.bizzType == 1) {
        this.titleName = "修改登录密码"
      }
      if (this.bizzType == 2) {
        this.titleName = "修改支付密码"
      }
    },
    mounted () {

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
        let self = this
        if (self.form.pwd == '') {
          self.phoneError = ''
          self.qrPasswordError = ''
          return
        }

        if(this.pwdStatus){
          return
        }

        if(self.form.pwd != self.qrPassword){
          self.qrPasswordError = $code('269')
          return
        }
        this.pwdStatus = true
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/resetPwdLoginIn',
          params: self.form
        }).then(function (response) {
          if (response && response.data.optSuc) {
            self.$message.success('修改成功')
            // 成功跳转页面
            self.$router.push({path: '/my/accountSafety'})
          } else {
            self.pwdStatus = false
          }
        })
      }
    }
  }
</script>

<style scoped>
  .updatePassword2{
  	height: 100vh;
    background-color: rgb(242,242,242);
  }
  .updatePassword2 .topCenter{
  	font-size: .5rem;
  	font-weight: 400;
  	color: rgb(51,51,51);
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
  .send{
    width: 2rem;
    height: .9rem;
    border-radius: 1rem;
    background: rgb(245,0,87);
    color: white;
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
    font-size: .3rem;
    color: rgb(153,153,153);
    text-indent: 2rem;
  }

</style>
