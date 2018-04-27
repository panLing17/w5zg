<template lang="pug">
  .phoneLogin
    nav-bar(background="white")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 验证码登录
      .topRight(slot="right")
    .content
      .form
        .phone
          .iconWrapper
            img.icon(:src="!iconFlag.phone?require('../../../assets/img/用户图标@2x.png'):require('../../../assets/img/用户图标-点亮@2x.png')")
          input.input(type="number", placeholder="请输入您的手机号", v-model="form.phone", @input="lightUp")
        .code
          .iconWrapper
            img.icon(:src="!iconFlag.code?require('../../../assets/img/密码2@2x.png'):require('../../../assets/img/密码-点亮@2x.png')")
          input.input(type="text", placeholder="请输入手机验证码", v-model="form.code", @input="lightUp")
          .codeBtn(:style="{background:codeBtn.bg}", @click="sendCode") {{codeBtn.text}}
      .btn 登入
</template>

<script>
  export default {
    name: "login2",
    data () {
      return {
        iconFlag: {
          phone: false,
          code: false
        },
        codeBtn: {
          text: '发送验证码',
          bg: 'rgb(245,0,87)'
        },
        form: {
          phone: '',
          code: ''
        }

      }
    },
    methods: {
      sendCode () {
        let reg = /^1[3|4|5|8|9][0-9]\d{8}$/;
        if (!reg.test(this.form.phone)) {
          this.$message.error('手机号码格式不正确！');
          return;
        }
        this.codeBtn.bg = '#999'
        let count = 60;
        this.codeBtn.text = count+'s'
        let _this = this
        let timer = setInterval(()=> {
          count--;
          _this.codeBtn.text = count+'s'
          if (count===0) {
            _this.codeBtn.bg = 'rgb(245,0,87)'
            _this.codeBtn.text = '重新发送'
            clearInterval(timer)
          }
        },1000)
      },
      lightUp () {
        let reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(17[0-9])|(18[0-9]))\d{8}$/;
        if (reg.test(this.form.phone)) {
          this.iconFlag.phone = true
        }else {
          this.iconFlag.phone = false
        }
        if(this.form.code.length === 4) {
          this.iconFlag.code = true
        }else {
          this.iconFlag.code = false
        }
      }
    }
  }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:#999;
  }
  .phoneLogin {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .content {
    background: #fff;
    height: calc(100vh - 1.3rem);
  }
  .form {
    padding: 1.5rem 1rem 0;
  }
  .phone, .code {
    height: 1rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
  }
  .iconWrapper {
    flex: none;
    width: 1rem;
  }
  .phone .icon {
    width: .4rem;
  }
  .input {
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    color: rgb(51,51,51);
    font-size: .4rem;
  }
  .code {
    margin-top: 1.2rem;
  }
  .codeBtn {
    flex: none;
    width: 2.26rem;
    height: 100%;
    line-height: 1rem;
    color: #fff;
    text-align: center;
    border-radius: .2rem;
    font-size: .4rem;
  }
  .code .icon {
    width: .46rem;
  }
  .btn {
    margin: 2.37rem auto 0;
    width: 6rem;
    height: 1rem;
    font-size: .4rem;
    color: #fff;
    text-align: center;
    line-height: 1rem;
    background: rgb(245,0,87);
    border-radius: .6rem;
  }
  img {
    pointer-events: none;
  }
</style>
