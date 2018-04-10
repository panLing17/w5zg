<template lang="pug">
  .updatePassword1
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{titleName}}
    .form
      w-input(v-model="userData.mi_phone", label="手机号码：", label-width="2.5rem")
      w-input(v-model="form.gCode",label="验证码：", label-width="2.5rem", placeholder="请输入验证码", input-button=true, :error="gCodeError", required, button-cover)
        img.aplaceholder(slot="button", @click="getPicCode", :src="url")
      w-input(v-model="form.vcode", label="手机验证码：", label-width="2.5rem", placeholder="请输入手机验证码", :error="checkCodeError", input-button=true, required, button-cover)
        .inputButton(slot="button", @click="getPhoneCode", v-show="sendMsg" ,:class="{inputButtonGray:sendMsgStatus}") 获取验证码
        .inputButton(slot="button", v-show="!sendMsg",style="background-color:gray") {{countDown}}
      p.tips 系统将向您的手机号发送短信验证码
      button.regButton(@click="nextStep",:class="{regButtonGray:nextStepStatus}") 下一步
</template>
<script>
  import {mapState} from 'vuex'

  export default {
    name: 'updatePassword1',
    data() {
      return {
        form: {
          gCode: '',
          vcode: '',
          type: '3'
        },
        version: 1,
        url: this.$apiMember + 'member/picCode/150/75/60',
        title: this.$route.query.routeParams,
        sendMsgStatus: false,
        nextStepStatus: true,
        countDown: 60,
        gCodeError: '',
        checkCodeError: '',
        sendMsg: true,
        titleName: ''
      }
    },
    computed: mapState(['userData']),
    created() {
      if (this.title == 1) {
        this.titleName = "修改登录密码"
        this.form.type = '3'
      }
      if (this.title == 2) {
        this.titleName = "修改支付密码"
        this.form.type = '4'
      }
    },
    mounted() {
    },
    methods: {
      getPicCode() {
        this.version += 1
        this.url = this.$apiMember + 'member/picCode/150/75/60?v=' + this.version
      },
      getPhoneCode() {
        // 发送验证码
        let self = this
        if (self.form.gCode == '') {
          self.gCodeError = ''
          return
        }

        if (self.sendMsgStatus) {
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'sms/sendCodeLoginIn',
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
          } else {
            self.getPicCode()
          }
        })
      },
      nextStep() {
        let self = this
        if (self.form.vcode == '' || self.nextStepStatus) {
          self.checkCodeError = ''
          return
        }

        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/validationLoginIn',
          params: self.form
        }).then(function (response) {
          if (response.data.optSuc) {
            // 成功跳转页面
            self.$router.push({name: '修改登录登录密码与支付密码验证码验证', query: {routeParams:self.title}})
          }
        })
      }
    }
  }
</script>

<style scoped>
  .updatePassword1 {
    height: 100vh;
    background-color: rgb(242, 242, 242);
  }

  .updatePassword1 .topCenter {
    font-size: .5rem;
    font-weight: 400;
    color: rgb(51, 51, 51);
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

  .form {
    margin-top: 1.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .send {
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
    font-size: .3rem;
    color: rgb(153, 153, 153);
    text-indent: 2rem;
  }

  .aplaceholder {
    width: 2rem;
    background-color: rgb(245, 0, 87);
  }
</style>
