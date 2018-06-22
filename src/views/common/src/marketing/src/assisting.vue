<template lang="pug">
  .wrapAssisting
    .cont
      .topLogo
        img(src="../../../../../assets/img/user_title.png" @click.prevent="")
      .words
        h1 活动暂未开始
        p 报名满20,000人，立即开始活动
        p 邀请好友关注“万物直供商城”,一起免费领鞋吧~
      .goShopping
        img(src="../../../../../assets/img/user_not_started_btn.png" @click.prevent="")
      .rule
        img(src="../../../../../assets/img/01_index_6.png" @click.prevent="")                 
</template>

<script>

  export default {
      name: "assisting",
      data(){
        return{
          
        }
      },
      computed: {

      },
      created(){

      },
      mounted(){
        document.title = "助力活动";
      },
      methods:{
        
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
    background-color: #ff3050;
  }
  .topLogo{
    padding: 1rem .4rem 0;
  }
  .topLogo img{
    width: 9rem;
  }
  .words{
    margin-top: 1.2rem;
    color: #fff;
    text-align: center;
  }
  .words h1{
    font-size: .8rem;
  }
  .words p{
    font-size: .5rem;
  }
  .words p:nth-child(3){
    font-size: .34rem;
    margin-top: .1rem;
    color: #fec45f;
  }
  .goShopping{
    margin-top: .4rem;
    text-align: center;
  }
  .goShopping img{
    width: 9.4rem;
  }
  .rule{
    margin-top: 1rem;
  }
  .rule img{
    width: 10rem;
  }
  /*内容部分--结束*/
</style>
