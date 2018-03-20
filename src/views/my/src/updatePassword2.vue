<template lang="pug">
  .updatePassword2
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{titleName}}
    .form
      w-input(v-model="form.mobile", label="新密码：", label-width="2.5rem", placeholder="", input-button=true, :error="message", required) 
      w-input(label="确认新密码：", label-width="2.5rem", placeholder="", input-button=true, :error="message", required)
      button.regButton(@click="$router.push('/my/accountSafety')") 提交                          
</template>
<script>
 
  export default {
    name: 'updatePassword1',
    data () {
      return {
        form: {
          mobile: '',
          password: ''
        },
        title:this.$route.query.routeParams,
        titleName:''
      }
    },
    created (){
      if (this.title == 1) {
        this.titleName = "修改登录密码"
      }
      if (this.title == 2) {
        this.titleName = "修改支付密码"
      }
    },
    mounted () {
 
    },
    methods: {
      
    }
  }
</script>

<style scoped>
  .updatePassword2{
  	height: 100vh;
    background-color: rgb(242,242,242);
  }
  .updatePassword2 .topCenter{
  	font-size: .5rem;
  	font-weight: 400;
  	color: rgb(51,51,51);
  }

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
  .send{
    width: 2rem;
    height: .9rem;
    border-radius: 1rem;
    background: rgb(245,0,87);
    color: white;
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
    font-size: .3rem;
    color: rgb(153,153,153);
    text-indent: 2rem;
  }

</style>
