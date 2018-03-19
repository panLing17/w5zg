<template lang="pug">
  .page
    nav-bar
      .topLeft(slot="left" @click="$router.push('/citySearch')")
        img(src="../../../assets/img/page三角0.png")
        span.city {{cityName}}
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称" @focus="jump")
        img(src="../../../assets/img/home扫描@2x.png" @click="$router.push('/scan')")
      .topRight(slot="right")
        img(src="../../../assets/img/scanSuccess消息.png")
    .content   
</template>

<script>
  export default {
    name: "page" ,
    data(){
      return {

      }
    },
    mounted(){

    },
    methods:{

    }
  }
</script>

<style scoped>
  .page{
    width: 100%;
    background: rgb(238,238,238);
    padding-bottom: 2rem;
  }
  /*顶部搜索--开始*/
  .topLeft{
    width: 1.8rem;
  }
  .topLeft img{
    width: .4rem;
    vertical-align: bottom;
    margin-left: .1rem;
  }
  .topLeft .city{
    width: 1rem; 
    display: inline-block;
    vertical-align: middle;
    font-size: .5rem;
    font-weight: 400;
    color: #fff;
    margin-left: .2rem;
    word-break: break-all;
  }
  .topCenter{
    margin-left: .1rem;
    position: relative;
  }
  .topCenter img{
    width: .6rem;
    position: absolute;
    top: .15rem;
    right: .25rem;
  }
  .topRight{
    margin-right: .1rem;
  }
  .topRight img{
    width: .7rem;
    vertical-align: middle;
  }
  /*顶部搜索--结束*/
</style>
