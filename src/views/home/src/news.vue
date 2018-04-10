<template lang="pug">
    div.box( @click="$router.push('/news')")
      img(src="../../../assets/img/HEADLINE@3x.png")
      div
        ul#newsList
          li(v-for="(item,index) in newsData ") {{item.i_title}}
</template>

<script>
    export default {
        name: "news",
        props: ['newsData'],
        data(){
          return{
            list:[
              {
                label:'新闻'
              },{
                label:'新闻'
              },{
                label:'新闻'
              },
              {
                label:'新闻'
              },
              {
                label:'新闻'
              },
              {
                label:'新闻'
              },
              {
                label:'新闻'
              }
            ]
          }
        },
      watch: {
        newsData: function () {
          this.animate()
        }
      },
      methods:{
        animate(){
          let n=this.newsData.length;
          let e=document.getElementById('newsList');
          e.style.bottom='0';
          let fun=function () {
            e.style.bottom=parseFloat(e.style.bottom)+1.2+'rem'
            if(parseFloat(e.style.bottom)>1.2*n/2){
              e.style.bottom='0';
            }
          };
          setInterval(function(){
            fun()
          },4000)
        }
      },
      mounted(){
        this.animate()
      }
    }
</script>

<style scoped>
  .box{
    height: 1.4rem;
    padding: 0 5px;
    width: 100%;
    background: white;
    display: flex;
    align-items: center;
  }
  .box>img{
    width: 1.6rem;
    height: 1.2rem;
    color: #fc8b6d;
    font-size: .4rem;
    text-align: center;
  }
  .box>div{
    flex-grow: 1;
    height: 1.2rem;
    overflow: hidden;
    padding-left: 8px;
  }
  .box>div>ul{
    position: relative;
    transition: bottom .5s;
  }
  .box>div>ul>li{
    height: .6rem;
    line-height: .6rem;
    color: #666;
  }
  .box>div>ul>li:nth-child(2n+1){
    border-bottom: #ddd 1px solid;
  }
</style>
