<template lang="pug">
  .loginBox
    .content
      .form
        .phone
          .iconWrapper
            img.icon(:src="!iconFlag.phone?require('../../../assets/img/login/Icon_phone@2x.png'):require('../../../assets/img/login/Icon_phone_checked@2x.png')")
          input.input(type="number", pattern="1[0-9]{10}", placeholder="手机号", v-model="form.mobile", @input="lightUp")
          .iconWrapper(v-show="form.mobile.length", @click="clear(1)")
            img.icon(src="../../../assets/img/login/Icon_del@2x.png")
        .code
          .iconWrapper
            img.icon(:src="!iconFlag.code?require('../../../assets/img/login/Icon_lock@2x.png'):require('../../../assets/img/login/Icon_unlock@2x.png')")
          input.input(:type="passwordType", placeholder="密码", v-model="form.pwd", @input="lightUp")
          .iconWrapper(v-show="form.pwd.length", @click="clear(2)", style="margin-right: .32rem;")
            img.icon(src="../../../assets/img/login/Icon_del@2x.png")
          .iconWrapper(@click="showPasswordFn")
            img.icon(:src="passwordType=='password'?require('../../../assets/img/login/Icon_eye_unlook@2x.png'):require('../../../assets/img/login/Icon_eye@2x.png')")
        .forget(@click="$router.push('/forget1')") 忘记密码
      .btn(@click="login") 登入
      .call 客服电话: 4008-947-999
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
        passwordType: 'password',
        form: {
          mobile: '',
          pwd: ''
        },
        iconFlag: {
          phone: false,
          code: false,
        },
        phoneReg: /^1[0-9]{10}$/,
        prevUrl: ''
      }
    },
    beforeRouteEnter (to, from, next) {
      next(vm => {
        vm.prevUrl = from.path
      })
    },
    mounted () {
    },
    methods: {
      clear(i) {
        if (i===1) {
          this.form.mobile = ''
        } else {
          this.form.pwd=''
        }
        this.lightUp()
      },
      showPasswordFn() {
        this.passwordType = this.passwordType == 'password'? 'text':'password'
      },
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
            if (self.prevUrl === '/forget1') {
              self.$router.push('/my')
            } else {
              self.$router.go(-1)
            }

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
    width: 8rem;
    height: calc(100vh - 1.3rem);
    margin: 0 auto;
    position: relative;
  }
  .form {
    padding-top: 1.33rem;
  }
  .phone, .code {
    height: 1.17rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #999;
  }
  .iconWrapper {
    flex: none;
  }

  .input {
    margin-left: .19rem;
    flex: 1;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    color: rgb(51,51,51);
    font-size: .4rem;
  }
  .code {
    margin-top: .4rem;
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
  .icon {
    width: .64rem;
  }
  .btn {
    margin: .42rem auto 0;
    width: 6.9rem;
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
    text-align: right;
    margin-top: .21rem;
    font-size: .32rem;
    line-height: .64rem;
    color: #777;
  }
  .call {
    font-size:.32rem;
    color:rgba(102,102,102,1);
    width: 100%;
    text-align: center;
    margin-top: 6.9rem;
  }
</style>
