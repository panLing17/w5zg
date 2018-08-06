<template lang="pug">
  .loginBox
    <!--nav-bar(background="white")-->
      <!--.topLeft(slot="left")-->
      <!--.topCenter(slot="center") 登录-->
      <!--.topRight(slot="right")-->
    <!--.form-->
      <!--w-input(label-width="0", placeholder="请输入手机号", v-model="form.mobile")-->
      <!--w-input(label-width="0", placeholder="请输入密码", input-button=true, :type="passwordType", v-model="form.pwd")-->
        <!--div(slot="button").passwordSwitch-->
          <!--transition(name="fade", mode="in-out")-->
            <!--img(src="../../../assets/img/visible@2x.png", v-if="showPassword", @click="passwordSwitch(false)", style="position:absolute;right:0")-->
          <!--transition(name="fade", mode="in-out", style="position:absolute;right:0")-->
            <!--img(src="../../../assets/img/invisible@2x.png", v-if="!showPassword", @click="passwordSwitch(true)", style="position:absolute;right:0")-->
      <!--button.loginButton(@click="login") 登录-->
      <!--.bottomButton-->
        <!--ul.forgetPassword-->
          <!--li(@click="$router.push('/forget1')") 忘记密码-->
          <!--li |-->
          <!--li(@click="$router.push('/register1')") 注册-->
    .content
      .form
        .phone
          .iconWrapper
            img.icon(:src="!iconFlag.phone?require('../../../assets/img/用户图标@2x.png'):require('../../../assets/img/用户图标-点亮@2x.png')")
          input.input(type="number", placeholder="请输入您的手机号", v-model="form.mobile", @input="lightUp")
        .code
          .iconWrapper
            img.icon(:src="!iconFlag.code?require('../../../assets/img/密码2@2x.png'):require('../../../assets/img/密码-点亮@2x.png')")
          input.input(type="password", placeholder="请输入密码", v-model="form.pwd", @input="lightUp")
      .btn(@click="login") 登入
      .forget(@click="$router.push('/forget1')") 忘记密码
</template>

<script>
  import {mapState} from 'vuex';
  import {getUserData} from 'assets/js/mixin'

  export default {
    name: 'login1',
    mixins: [getUserData],
    computed: mapState(['userData']),
    data () {
      return {
        showPassword: false,
        passwordType: 'password',
        form: {
          mobile: '',
          pwd: ''
        },
        iconFlag: {
          phone: false,
          code: false,
        },
        phoneReg: /^1[0-9]{10}$/
      }
    },
    mounted () {
    },
    methods: {
      // passwordSwitch (show) {
      //   if (show) {
      //     this.showPassword = true
      //     this.passwordType = 'text'
      //   } else {
      //     this.showPassword = false
      //     this.passwordType = 'password'
      //   }
      // },

      login () {
        if (!this.phoneReg.test(this.form.mobile)) {
          this.$message.error('手机号格式不正确！')
          return
        }
        if (this.form.pwd.length<6) {
          this.$message.error('密码个数需大于6')
          return
        }
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/login',
          params: self.form,
        }).then(function (response) {
          if (response) {
            self.getUserData()
            // 本地储token
            localStorage.setItem('token',response.data.data)
            // 跳转至首页
            self.$router.go(-1)
          }
        })
        // this.$store.dispatch('login',this.form)
      },


      lightUp () {
        if (this.phoneReg.test(this.form.mobile)) {
          this.iconFlag.phone = true
        }else {
          this.iconFlag.phone = false
        }
        if(this.form.pwd.length >= 6) {
          this.iconFlag.code = true
        }else {
          this.iconFlag.code = false
        }
      }



    }

  }
</script>

<style scoped>
  /*.form{*/
    /*padding-top: 1.3rem;*/
    /*display: flex;*/
    /*flex-direction: column;*/
    /*align-items: center;*/
  /*}*/
  /*.passwordSwitch{*/
    /*position: relative;*/
    /*display: flex;*/
    /*height: .8rem;*/
    /*align-items: center;*/
  /*}*/
  /*.passwordSwitch img{*/
    /*width: .6rem;*/
  /*}*/
  /*.loginButton {*/
    /*margin-top: 1rem;*/
    /*width: 7rem;*/
    /*height: 1rem;*/
    /*background-color: rgb(245,0,87);*/
    /*color: white;*/
    /*border: none;*/
    /*outline: none;*/
    /*border-radius: .5rem;*/
  /*}*/
  /*.bottomButton {*/
    /*margin-top: 3rem;*/
    /*width: 100%;*/

    /*left: 0;*/
    /*display: flex;*/
    /*justify-content: center;*/
  /*}*/
  /*.forgetPassword {*/
    /*width: 2.5rem;*/
    /*display: flex;*/
    /*justify-content: center;*/
  /*}*/
  input::-webkit-input-placeholder{
    color:#999;
  }
  .phoneLogin {
    background: rgb(242,242,242);
    width: 100%;
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
  .forget {
    text-align: center;
    margin-top: 2rem;
    font-size: .26rem;
  }
</style>
