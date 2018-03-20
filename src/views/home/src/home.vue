<template lang="pug">
  .homeBox
    nav-bar(background="rgb(245,0,87)")
      .topLeft(slot="left" @click="goToCitySearch()")
        img(src="../../../assets/img/home定位按钮@2x.png")
        span.city {{cityName}}
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称" @focus="jump")
      .topRight(slot="right")
        img(src="../../../assets/img/home扫描@2x.png" @click="$router.push('/scan')")
    slideShow
    .classify
      ul
        li.goodsList(v-for="item in classify" @click="$router.push('/classification')")
          img(v-bind:src="item.imgSrc")
    .poster
      img(src="../../../assets/img/poster.jpg")
    .activities ———— 活动 ————
    .activitiesPic
      ul
        li(@click="$router.push('/activities')")
          img(src="../../../assets/img/p1.jpg")
        li(@click="$router.push('/activities')")
          img(src="../../../assets/img/p2.jpg")
        li(@click="$router.push('/activities')")
          img(src="../../../assets/img/p3.jpg")
        li(@click="$router.push('/activities')")
          img(src="../../../assets/img/p4.jpg")

    .recommend
      img(src="../../../assets/img/my_recommend@2x.png")
    .goodsList
      ul.goods
        li(v-for="item in goodsDetails").details
          ul
            li.img
              img(v-bind:src="item.imgSrc")
            li.goodsMsg
              span {{item.goodsMsg}}
            li.price
              span {{item.price | price-filter}}
            li.region
              span {{item.region}}
              span {{item.buyerNum}} 人已购买
    #returnTop(@click="topFunction()")
      img(src="../../../assets/img/my_top@2x.png")
    .downOver 已到最底部
</template>
<script>
  import myGoods from '../../../assets/img/my_goods.png'
  import classify from '../../../assets/img/分类.jpg'

  export default {
    name: 'home',
    data () {
      return {
        cityName:this.$route.query.routeParams,
        classify:[{"imgSrc":classify},{"imgSrc":classify},{"imgSrc":classify},{"imgSrc":classify},{"imgSrc":classify},{"imgSrc":classify},{"imgSrc":classify},{"imgSrc":classify}],
        goodsDetails:[
          {
            'imgSrc':myGoods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':568,
            'region':'江苏南京',
            'buyerNum':'167'
          },
          {
            'imgSrc':myGoods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':379,
            'region':'浙江杭州',
            'buyerNum':'200'
          },
          {
            'imgSrc':myGoods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':299,
            'region':'安徽合肥',
            'buyerNum':'101'
          },
        ]
      }
    },
    mounted () {
      // 当网页向下滑动 40px 出现"返回顶部" 按钮
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
          if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
              document.getElementById("returnTop").style.display = "block";
          } else {
              document.getElementById("returnTop").style.display = "none";
          }
      };
      var city = document.getElementsByClassName("city")[0];
      if (city.innerText.length == 2) {
        city.style.fontSize = .5 + "rem";
      }
      if (city.innerText.length == 3) {
        city.style.fontSize = .3 + "rem";
      }
      if (city.innerText.length == 4) {
        city.style.fontSize = .4 + "rem";
      }
    },
    methods: {
      // 点击按钮，返回顶部
      topFunction:function () {
        var timer = setInterval(function(){
            var top = document.body.scrollTop || document.documentElement.scrollTop;
            var speed = top / 4;
            if (document.body.scrollTop!=0) {
                document.body.scrollTop -= speed;
            }else {
                document.documentElement.scrollTop -= speed;
            }
            if (top == 0) {
                clearInterval(timer);
            }
        },30);
      },

      jump:function(){
        this.$router.push('/searchHistory');
      },

      goToCitySearch:function(){
        this.$router.push({
          name: '城市搜索',
           query: {
              routeParams: 1
           }
        })
      }


    }
  }
</script>

<style scoped>
  .homeBox {
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
    vertical-align: middle;
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
  }
  .topRight{
    margin-right: .1rem;
  }
  .topRight img{
    width: .7rem;
    vertical-align: middle;
  }
  /*顶部搜索--结束*/
  /*商品分类--开始*/
  .classify{
    /*height: 6rem;*/
    background-color: #fff;
    padding: .4rem .6rem;
  }
  .classify ul{
    height: 4.55rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-around;
  }
  .classify li.goodsList{
    width: 2rem;
    height: 2rem;
    background-color: #fff;
  }
  .classify li.goodsList img{
    width: 100%;
  }
  .classify .name{
    width: 100%;
    text-align: center;
  }
  /*商品分类--结束*/
  /*广告--开始*/
  .poster{
    background-color: #fff;
    margin-top: .2rem;
    padding: 0 .3rem;
  }
  .poster img{
    width: 100%;
  }
  /*广告--结束*/
  /*活动--开始*/
  .activities{
    height: 1rem;
    text-align: center;
    font-size: .4rem;
    line-height: 1rem;
    color: rgb(195,195,195);
  }
  .activitiesPic{
    background-color: #fff;
    /*height: 5rem;*/
  }
  .activitiesPic ul{
    display: flex;
    flex-wrap: wrap;
  }
  .activitiesPic ul li{
    width: 50%;
    /*height: 2.5rem;*/
  }
  /*.activitiesPic ul li:nth-child(1){
    border-right: .25px dashed rgb(120,120,120);
    border-bottom: .25px dashed rgb(120,120,120);
  }
  .activitiesPic ul li:nth-child(2){
    border-left: .25px dashed rgb(120,120,120);
    border-bottom: .25px dashed rgb(120,120,120);
  }
  .activitiesPic ul li:nth-child(3){
    border-top: .25px dashed rgb(120,120,120);
    border-right: .25px dashed rgb(120,120,120);
  }
  .activitiesPic ul li:nth-child(4){
    border-top: .25px dashed rgb(120,120,120);
    border-left: .25px dashed rgb(120,120,120);
  }*/
  .activitiesPic ul li img{
    width: 100%;
    /*height: 2.5rem;*/
  }
  /*活动--结束*/
  /*我的推荐--开始*/
  .recommend{
    height: 1rem;
    line-height: 1.2rem;
    text-align: center;
  }
  .recommend img{
    width: 5rem;
  }
  /*我的推荐--结束*/
  /*商品列表--开始*/
  .goodsList{
    padding: 0 .3rem .4rem 0;
    background-color: #fff;
  }
  .goodsList ul.goods{
    display: flex;
    flex-wrap: wrap;
  }
  .goodsList ul.goods li.details{
    width: 4.5rem;
    border: 1px solid rgb(153,153,153);
    border-radius: .3rem;
    margin: .4rem 0 0 .35rem;
    padding-bottom: .2rem;
  }
  .goodsList ul.goods li.details img{
    border-top-left-radius: .3rem;
    border-top-right-radius: .3rem;
    width: 4.46rem;
  }

  .goodsList li.details li.goodsMsg{
    font-size: .4rem;
    padding: 0 .2rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .goodsList li.details li.price{
    font-weight: bold;
    color: rgb(245,0,87);
    font-size: .4rem;
    margin-top: .2rem;
    padding: 0 .15rem;
  }
  .goodsList li.details li.region{
    margin-top: .2rem;
    padding: 0 .2rem;
    display: flex;
    justify-content: space-between;
    color: rgb(153,153,153);
    font-size: .3rem;
  }
  /*商品列表--结束*/
  /*返回顶部的样式--开始*/
  #returnTop{
    width: 1.5rem;
    position: fixed;
    right: .3rem;
    bottom: 2rem;
    display: none;
  }
  #returnTop img{
    width: 1.5rem;
    vertical-align: top;
  }
  /*返回顶部的样式--开始*/
  /*已到最底部--开始*/
  .downOver{
    text-align: center;
  }
  /*已到最底部--结束*/
</style>
