<template lang="pug">
  .registerBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 注册
      .topRight(slot="right")
    .form
      w-input(label="登入密码：", label-width="2rem", placeholder="", :type="passwordType", v-model="form.password", required)
      w-input(label="确认密码：", label-width="2rem", placeholder="", :type="passwordType", v-model="form.password", required)
      w-input(v-model="form.mobile", label="验证码：", label-width="2rem", placeholder="", input-button=true, :error="message", required, button-cover)
        .inputButton(slot="button")
      button.regButton(@click="$router.push('/regOver')") 确定
</template>

<script>
  export default {
    name: 'register',
    data () {
      return {
        showPassword: false,
        passwordType: 'password',
        form: {
          mobile: '',
          password: ''
        }
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
