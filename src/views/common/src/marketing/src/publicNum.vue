<template lang="pug">
  .wrapPublicNum
    .cont
      .message(ref="kaka")
        p 领鞋方法已通过<span>短信方式</span>发送至
        p 您的手机，请注意查看
      .qrCode
        img(src="../../../../../assets/img/qRcode.png")
      .words
        p 关注万物直供公众号
        p 进入商城，立即用券
      .words(v-if="false")
        p 持续关注公众号，
        p 可查看领鞋进展！            
</template>

<script>

  export default {
      name: "publicNum",
      data(){
        return{

        }
      },
      computed: {

      },
      created(){

      },
      mounted(){
        document.title = "关注公众号";
        this.change();
      },
      methods:{
        change(){
          this.$refs.kaka.style.opacity = '0';
        }
      }
    }
</script>

<style scoped>
  .wrapPublicNum{
    background-color: #e6e6e6;
  }
  /*内容部分--开始*/
  .cont{
    width: 100%;
    min-height: 100vh;
    background: url('../../../../../assets/img/backgrounds.png') no-repeat;
    background-size: 100%;
    padding-top: 1.5rem;
  }
  .message{
    color: #fff;
    font-size: .45rem;
    text-align: center;
  }
  .message p:nth-child(2){
    margin-top: .1rem;
  }
  .message p span{
    color: #ffe100;
  }
  .qrCode{
    padding-top: 1rem;
    text-align: center;
  }
  .qrCode img{
    width: 6rem;
  }
  .words{
    padding-top: .2rem;
    font-size: .4rem;
    text-align: center;
    color: #ff3050;
  }
  .words p{
    margin-top: .2rem;
  }
  /*内容部分--结束*/
</style>
