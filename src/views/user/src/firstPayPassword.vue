<template lang="pug">
  .loginBox
    nav-bar(background="white")
      .topLeft(slot="left")
      .topCenter(slot="center") 设置支付密码
      .topRight(slot="right")
    .form
      w-input(label-width="0", placeholder="请输入支付密码", v-model="pwd", :error="firstError")
      w-input(label-width="0", placeholder="请再次输入密码", :type="passwordType", v-model="repeat", :error="repeatError")
      button.loginButton(@click="submit") 确认
</template>

<script>
  import {mapState} from 'vuex';
  export default {
    name: 'first-pay-password',
    computed: mapState(['userData']),
    data () {
      return {
        pwd: '',
        repeat: '',
        firstError: '',
        repeatError: ''
      }
    },
    mounted () {
    },
    watch:{
      pwd () {
        if (this.pwd === this.repeat) {
          this.firstError  = ''
          this.repeatError = ''
        }
      },
      repeat () {
        if (this.pwd === this.repeat) {
          this.firstError  = ''
          this.repeatError = ''
        }
      }
    },
    methods: {
      submit () {
        if (this.pwd !== this.repeat) {
          this.firstError  = '请输入六位相同密码'
          this.repeatError = '请输入六位相同密码'
          return
        }
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/firstSetPayPwd',
          params: {
            payPwd: self.pwd
          },
        }).then(function (response) {
          self.$router.go(-1)
          if (response.data.optSuc) {
            self.$message.success(response.data.msg)
          }
        })
        // this.$store.dispatch('login',this.form)
      }
    }
  }
</script>

<style scoped>
  .form{
    margin-top: 1.3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .passwordSwitch{
    position: relative;
    display: flex;
    height: .8rem;
    align-items: center;
  }
  .passwordSwitch img{
    width: .6rem;
  }
  .loginButton {
    margin-top: 1rem;
    width: 7rem;
    height: 1rem;
    background-color: rgb(245,0,87);
    color: white;
    border: none;
    outline: none;
    border-radius: .5rem;
  }
  .bottomButton {
    margin-top: 3rem;
    width: 100%;

    left: 0;
    display: flex;
    justify-content: center;
  }
  .forgetPassword {
    width: 2.5rem;
    display: flex;
    justify-content: space-between;
  }
</style>
