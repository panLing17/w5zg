<template lang="pug">
  .page
    nav-bar
      .topLeft(slot="left" @click="goToCitySearch")
        img(src="../../../assets/img/page三角0.png")
        span.city {{cityName}}
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称")
        img(src="../../../assets/img/home扫描@2x.png" @click="$router.push('/scan')")
      .topRight(slot="right")
        img(src="../../../assets/img/scanSuccess消息.png")
    .content
      .left
        ul
          li(v-for="(item,index) in pageName" :class="{active:index == num}" @click="tab(index)") {{item}}
      .right
        ul(v-for="(item,index) in productList" v-show="index == num").tabs
          li(v-for="items in item.kind").tabsList
            .title
              span.point
              span.letter {{items.title}}
            ul.listOfGoods
              li(v-for="list in items.goods")
                img(:src="list.img")
                .words {{list.words}}

</template>

<script>
  import jacket from '../../../assets/img/page_jacket.png'
  import downCoat from '../../../assets/img/page_downCoat.png'
  import coat from '../../../assets/img/page_coat.png'
  export default {
    name: "page",
    data(){
      return {
        num:0,
        cityName:this.$route.query.routeParams,
        pageName:["运动","男装","女装","鞋子","箱包"],
        productList:[
          {
            kind:[
              {
                title:"运动服",
                goods:[
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"}
                ]
              },
              {
                title:"运动男装",
                goods:[
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"}
                ]
              }
            ] 
          },
          {
            kind:[
              {
                title:"男装外衣",
                goods:[
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"}
                ]
              },
              {
                title:"男装上衣",
                goods:[
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"}
                ]
              }
            ]
          },
          {
            kind:[
              {
                title:"女装外衣",
                goods:[
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"}
                ]
              },
              {
                title:"女装上衣",
                goods:[
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"}
                ]
              }
            ]
          },
          {
            kind:[
              {
                title:"跑步鞋",
                goods:[
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"},
                  {img:jacket,words:"休闲上衣"}
                ]
              },
              {
                title:"篮球鞋",
                goods:[
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"}
                ]
              }
            ]
          },
          {
            kind:[
              {
                title:"双肩包",
                goods:[
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"},
                  {img:downCoat,words:"休闲上衣"}
                ]
              },
              {
                title:"单肩包",
                goods:[
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"},
                  {img:coat,words:"休闲上衣"}
                ]
              }
            ]
          }
        ]
      }
    },
    mounted(){
      window.onscroll = function() {};

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
    methods:{
      goToCitySearch:function(){
        this.$router.push({
           name: '城市搜索',
           query: {
              routeParams: 2
           }    
        });
      },

      tab(index){
        this.num = index;
        document.documentElement.scrollTop = 0;
      }
    }
  }
</script>

<style scoped>
  .active{
    background-color: #fff;
    color: rgb(244,0,87) !important;
  }
  .page{
    width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
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
    color: rgb(52,52,52);
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
  /*中间内容部分左边--开始*/
  .content{
    display: flex;
    height: inherit;
    position: relative;
    padding-bottom: 2rem;
  }
  .content .left{
    width: 21%;
    height: 100%;
    position: fixed;
    top: 1.3rem;
    left: 0;
    bottom: 0;
    background-color: rgb(242,242,242);
  }
  .content .left ul li{
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .45rem;
    font-weight: bold;
    border-bottom: 1px solid #fff;
  }
  /*中间内容左边--结束*/
  /*中间内容右边--开始*/
  .right{
    width: 79%;
    height: inherit;
    background-color: #fff;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
  }
  .right ul.tabs{
    padding-top: .45rem;
    padding-bottom: 2rem;
  }
  .right ul.tabs .title{
    font-size: .4rem;
  }
  .right ul.tabs .title span.point{
    display: inline-block;
    width: .25rem;
    height: .25rem;
    background-color: rgb(244,0,87);
    border-radius: 50%;
    vertical-align: middle;
    margin: -.1rem .3rem 0 .3rem;
  }
  .right ul.tabs ul.listOfGoods{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: .5rem;
    padding: 0 .3rem;
  }
  .right ul.tabs ul.listOfGoods li{
    width: 1.9rem;
    margin-bottom: .4rem;
  }
  .right ul.tabs ul.listOfGoods li img{
    width: 1.9rem;
  }
  .right ul.tabs ul.listOfGoods li .words{
    text-align: center;
    color: rgb(153,153,153);
  }
  /*中间内容右边--结束*/
</style>
