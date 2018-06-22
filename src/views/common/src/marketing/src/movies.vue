<template lang="pug">
  .wrapMovies
    .cont
      .contLogo
        img(src="../../../../../assets/img/topWords.png")
      .wrapVideo
        video(src="../../../../../assets/img/movie.mp4")  
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
