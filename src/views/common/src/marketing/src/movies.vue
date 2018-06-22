<template lang="pug">
  .wrapMovies
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png",  @click="$router.go(-1)")
      .topCenter(slot="center") 观看视频领福利
      .topRight(slot="right")
        img(src="../../../../../assets/img/diandian.png")
    .cont
      .contLogo
        img(src="../../../../../assets/img/topWords.png")
      .wrapVideo
        video(src="../../../../../assets/img/movie.mp4" controls="controls")  
      .words
        p 完成观看视频任务, 了解<span>工会福利券</span>有何好处
        p 下一步可领取福利hhhhhh    
</template>

<script>

  export default {
      name: "movies",
      data(){
        return{

        }
      },
      computed: {

      },
      created(){

      },
      mounted(){
        document.title = "观看视频领福利";
      },
      methods:{
 
      }
    }
</script>

<style scoped>
  .wrapMovies{
    background-color: #e6e6e6;
  }
  .topLeft{
    margin-left: .1rem;
  }
  .topLeft img{
    width: .3rem;
  }
  .topCenter{
    width: 4rem;
    font-size: .5rem;
    font-weight: 400;
    text-align: center;
  }
  .topRight{
    margin-right: .1rem;
  }
  .topRight img{
    vertical-align: middle;
    width: .7rem;
  }
  /*中间内容部分--开始*/
  .cont{
    width: 100%;
    min-height: 100vh;
    background: url('../../../../../assets/img/backgrounds.png') no-repeat #e6e6e6;
    background-size: 100%;
  }
  .contLogo{
    width: 100%;
    padding: 1rem .5rem 0;
  }
  .contLogo img{
    width: 100%;
  }
  .wrapVideo{
    width: 100%;
    text-align: center;
    margin-top: .8rem;
  }
  video{
    height: 7rem;
  }
  .words{
    margin-top: .4rem;
  }
  .words p{
    text-align: center;
    font-size: .4rem;
  }
  .words p span{
    color: #ff3050;
  }
  .words p:nth-child(2){
    margin-top: .2rem;
  }
  /*中间内容部分--结束*/
</style>
