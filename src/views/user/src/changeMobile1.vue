<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 更换手机号
      .topRight(slot="right")
    .form
      w-input(label="原手机号：", label-width="1.8rem", placeholder="请输入原手机号", v-model="form.mobile", @blur="resetBtn",:error="mobileError")
      w-input(label="登录密码：", label-width="1.8rem", placeholder="请输入登录密码", :type="passwordType", v-model="form.loginPwd",:error="loginPwdError")
      button.regButton(@click="nextStep",:class="{regButtonGray:nextStepStatus}") 下一步

</template>

<script>
  export default {
    name: 'change-mobile',
    data() {
      return {
        passwordType: 'password',
        nextStepStatus: true,
        mobileError: '',
        loginPwdError: '',
        form: {
          mobile: '',
          loginPwd: ''
        }
      }
    },
    methods: {
      resetBtn() {
        let self = this
        let reg = /^1[0-9]{10}$/

        if (!reg.test(self.form.mobile)) {
          self.mobileError = $code('261')
          self.nextStepStatus = true
          return
        }
        self.nextStepStatus = false
        self.mobileError = ''
      },
      nextStep() {
        let self = this

        if(self.form.loginPwd == ''){
          self.loginPwdError = $code('2611')
          return
        }else{
          self.mobileError = ''
        }

        if (self.nextStepStatus) {
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'asec/checkMobilePwd',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            // 成功跳转页面
            self.$router.push({name: '更换手机号2'})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .registerBox {
    min-height: 100vh;
    background: rgb(242, 242, 242);
  }

  .form {
    margin-top: 1.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .inputButton {
    width: 2rem;
    height: .9rem;
    border-radius: 1rem;
    background: rgb(245, 0, 87);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .regButton {
    margin-top: 1rem;
    width: 7rem;
    height: 1rem;
    background-color: rgb(245, 0, 87);
    color: white;
    font-size: .4rem;
    border: none;
    outline: none;
    border-radius: .5rem;
  }

  .regButtonGray {
    background-color: rgb(192, 192, 192) !important;
  }

  .tips {
    margin-top: .2rem;
    font-size: .3rem;
    color: rgb(153, 153, 153);
  }

  .aplaceholder {
    width: 2rem;
    height: 1rem;
    background-color: rgb(245, 0, 87);
  }
</style>
