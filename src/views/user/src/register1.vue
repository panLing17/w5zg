<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 注册
      .topRight(slot="right")
    .form
      w-input(label="手机号：", label-width="2.5rem", placeholder="请输入手机号", v-model="form.mobile", required, @blur="checkPhoneRepeat", :error="phoneError")
      w-input(v-model="form.gCode", label="验证码：", label-width="2.5rem", placeholder="请输入验证码", input-button=true, required, button-cover,:error="gCodeError")
        img.valiImg(slot="button", @click="getPicCode", :src="url")
      w-input(v-model="form.vcode", label="手机验证码：", label-width="2.5rem", placeholder="请输入手机验证码", :error="checkCodeError", input-button=true, required, button-cover)
        .inputButton(slot="button", @click="getPhoneCode", v-show="sendMsg" ,:class="{inputButtonGray:sendMsgStatus}") 获取验证码
        .inputButton(slot="button", v-show="!sendMsg",style="background-color:gray") {{countDown}}
      button.regButton(@click="nextStep",:class="{regButtonGray:nextStepStatus}") 下一步
      p.tips 点击注册,表示同意《万物直供用户协议》
</template>

<script>
  export default {
    name: 'register',
    data() {
      return {
        phoneError: '',
        gCodeError: '',
        checkCodeError: '',
        sendMsg: true,
        version: 1,
        countDown: 60,
        sendMsgStatus: true,
        nextStepStatus: true,
        passwordType: 'password',
        url: this.$apiMember + 'member/picCode/150/75/60',
        form: {
          mobile: '',
          gCode: '',
          vcode: '',
          type: '1'
        }
      }
    },
    methods: {
      getPicCode() {
        this.version += 1
        this.url = this.$apiMember + 'member/picCode/150/75/60?v=' + this.version
      },
      checkPhoneRepeat() {
        let self = this
        let reg = /^1[0-9]{10}$/;
        if (self.form.mobile == '') {
          self.phoneError = ''
          return
        }

        if(!reg.test(self.form.mobile)){
          self.phoneError = '手机号格式错误!'
          return
        }else{
          self.phoneError = ''
        }


        // 发送ajax请求校验手机号重复
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/mobile/isExist',
          params: self.form
        }).then(function (response) {
          // 提示用户信息
          if (response.data.optSuc) {
            self.sendMsgStatus = false
          }
        })
      },
      getPhoneCode() {
        // 发送验证码
        let self = this
        if (self.form.mobile == '' || self.form.gCode == '') {
          self.phoneError = ''
          self.gCodeError = ''
          return
        }

        if(self.sendMsgStatus){
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'sms/sendCode',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            self.nextStepStatus = false
            // 成功则开始读秒
            self.sendMsg = false
            let interval = window.setInterval(function () {
              if ((self.countDown--) <= 0) {
                self.countDown = 60
                self.sendMsg = true
                window.clearInterval(interval)
              }
            }, 1000)
          }
        })
      },
      nextStep() {
        let self = this
        if (self.form.mobile == '' || self.form.checkCode == '' || self.nextStepStatus) {
          self.phoneError = ''
          self.checkCodeError = ''
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/validation',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            // 成功跳转页面
            self.$router.push({path: '/register2', query: {mobile: self.form.mobile,vcode: self.form.vcode}})
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

  .inputButtonGray {
    background: rgb(192, 192, 192) !important;
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

  .valiImg {
    width: 2rem
  }
</style>
