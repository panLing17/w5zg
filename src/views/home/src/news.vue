<template lang="pug">
    div.box
      img(src="../../../assets/img/headline.png")
      div
        ul#newsList
          li(v-for="(item,index) in newsData ", @click="$router.push({path: '/home/headlinesDetail',query:{url: item.i_photo}})") <span>必看</span>{{item.i_title}}
</template>

<script>
    export default {
      name: "news",
      props: ['newsData'],
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
            if(parseFloat(e.style.bottom)>=1.2*(n/2-1)){
              e.style.bottom='0';
            }else {
              e.style.bottom=parseFloat(e.style.bottom)+.6+'rem'
            }
          };
          setInterval(fun,4000)
        }
      },
      mounted(){
        // this.animate()
      }
    }
</script>

<style scoped>
  .box{
    height: 1rem;
    padding: 0 5px;
    width: 100%;
    background: white;
    display: flex;
    align-items: center;
  }
  .box>img{
    width: 1.6rem;
    height: .4rem;
    color: #fc8b6d;
    font-size: .4rem;
    text-align: center;
  }
  .box>div{
    flex-grow: 1;
    height: .6rem;
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
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: .37rem;
  }
  .box li span{
    padding: 1px 3px;
    border: solid 1px #F70057;
    font-size: .3rem;
    color: #F70057;
    margin-right: .1rem;
  }
  /*.box>div>ul>li:nth-child(2n+1){*/
    /*border-bottom: #ddd 1px solid;*/
  /*}*/
</style>
