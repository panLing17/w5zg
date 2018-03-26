<template lang="pug">
  .loginBox
    nav-bar(background="white")
      .topLeft(slot="left")
      .topCenter(slot="center") 登录
      .topRight(slot="right")
    .form
      w-input(label-width="0", placeholder="请输入手机号", v-model="form.mobile")
      w-input(label-width="0", placeholder="请输入密码", input-button=true, :type="passwordType", v-model="form.pwd")
        div(slot="button").passwordSwitch
          transition(name="fade", mode="in-out")
            img(src="../../../assets/img/visible@2x.png", v-if="showPassword", @click="passwordSwitch(false)", style="position:absolute;right:0")
          transition(name="fade", mode="in-out", style="position:absolute;right:0")
            img(src="../../../assets/img/invisible@2x.png", v-if="!showPassword", @click="passwordSwitch(true)", style="position:absolute;right:0")
      button.loginButton(@click="login") 登录
      .bottomButton
        ul.forgetPassword
          li(@click="$router.push('/forget1')") 忘记密码
          li |
          li(@click="$router.push('/register1')") 注册
</template>

<script>
  import {mapState} from 'vuex';
  export default {
    name: 'login',
    computed: mapState(['userData']),
    data () {
      return {
        showPassword: false,
        passwordType: 'password',
        form: {
          mobile: '',
          pwd: ''
        }
      }
    },
    mounted () {
    },
    methods: {
      passwordSwitch (show) {
        if (show) {
          this.showPassword = true
          this.passwordType = 'text'
        } else {
          this.showPassword = false
          this.passwordType = 'password'
        }
      },
      login () {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/login',
          params: self.form,
        }).then(function (response) {
          // 储存登录信息
          self.$store.commit('userDataChange',response.data.data)
          // 本地储token
          localStorage.setItem('token',response.data.data.W5MALLTOKEN)
          // 跳转至首页
          self.$router.push('/my')
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
    position: absolute;
    width: 100%;
    bottom: 3rem;
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
