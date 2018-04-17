<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 忘记密码
      .topRight(slot="right")
    .form
      w-input(label="手机号：", label-width="1.8rem", placeholder="请输入手机号", @blur="checkPhone", v-model="form.mobile", :error="phoneError")
      w-input(label="验证码：", label-width="1.8rem", placeholder="请输入验证码", v-model="form.gCode", input-button="true", button-cover)
        img.aplaceholder(slot="button", @click="getPicCode", :src="url")
      button.regButton(@click="nextStep", :class="{regButtonGray:nextStepStatus}") 下一步
</template>

<script>
  export default {
    name: 'register',
    data() {
      return {
        showPassword: false,
        passwordType: 'password',
        nextStepStatus: true,
        phoneError: '',
        passwordError: '',
        version: 1,
        url: this.$apiMember + 'member/picCode/150/75/60',
        form: {
          mobile: '',
          gCode: ''
        }
      }
    },
    methods: {
      getPicCode() {
        this.version += 1
        this.url = this.$apiMember + 'member/picCode/150/75/60?v=' + this.version
      },
      checkPhone() {
        let self = this
        self.nextStepStatus = true
        let reg = /^1[0-9]{10}$/;
        if (self.form.mobile == '') {
          self.phoneError = ''
          return
        }

        if (!reg.test(self.form.mobile)) {
          self.phoneError = $code('261')
          return
        } else {
          self.phoneError = ''
        }

        // 发送ajax请求校验手机号重复
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/mobile/isExistTrue',
          params: self.form
        }).then(function (response) {
          // 提示用户信息
          if (response.data.optSuc) {
            self.nextStepStatus = false
          }
        })

      },
      nextStep() {
        let self = this
        if (self.form.mobile == '' || self.form.gCode == '' || self.nextStepStatus) {
          self.phoneError = ''
          self.checkCodeError = ''
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'sms/sendCode',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            // 成功跳转页面
            self.$router.push({path: '/forget2', query: {mobile: self.form.mobile}})
          } else {
            self.getPicCode()
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
    background-color: rgb(245, 0, 87);
  }
</style>
