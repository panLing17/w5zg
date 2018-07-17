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
          input.input(type="number", placeholder="原手机号", v-model="userData.mi_phone", readonly="readonly")
        .inputWrapper
          .phoneIcon
            img.icon(src="../../../assets/img/forget3.png")
          input.input(type="password", placeholder="请输入登录密码", v-model="form.loginPwd")
      .rightBtn(@click="nextStep") 下一步
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: 'change-mobile',
    data() {
      return {
        nextStepStatus: true,
        mobileError: '',
        loginPwdError: '',
        form: {
          loginPwd: ''
        }
      }
    },
    computed: mapState(['userData']),
    methods: {
      nextStep() {
        let self = this

        if(this.form.loginPwd.trim().length == ''){
          this.$message.error('密码不能为空！')
          return
        }

        if (!self.nextStepStatus) {
          return
        }
        self.nextStepStatus = false
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'asec/checkMobilePwd',
          params: {
            mobile: this.userData.mi_phone,
            loginPwd: this.form.loginPwd
          }
        }).then(function (response) {
          self.nextStepStatus = true
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
