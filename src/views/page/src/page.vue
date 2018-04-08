<template lang="pug">
  .page
    nav-bar
      .topLeft(slot="left" @click="goToCitySearch()")
        img(src="../../../assets/img/page三角0.png")
        span.city {{cityName}}
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称" @focus="$router.push('/home/searchHistory')")
        img(src="../../../assets/img/home扫描@2x.png" @click="$router.push('/home/scan')")
      .topRight(slot="right")
        img(src="../../../assets/img/msg_0.png")
    .content
      .left
        ul
          li(v-for="(item,index) in pageName" :class="{active:index == num}" @click="tab(item,index)") {{item}}
      .right(:class="{styles:flag}")
        ul(v-for="(item,index) in productList").tabs
          li.tabsList
            .title
              span.point
              span.letter {{item.gc_name}}
            ul.listOfGoods
              li(v-for="items in item.childList" @click="$router.push('/page/commodityList')").wrapImg
                img(:src="items.gc_url")
                .words {{items.gc_keywords}}
</template>

<script>
  import jacket from '../../../assets/img/page_jacket.png'
  import downCoat from '../../../assets/img/page_downCoat.png'
  import coat from '../../../assets/img/page_coat.png'
  import logo1 from '../../../assets/img/logo1.png'
  import logo2 from '../../../assets/img/logo2.png'
  import logo3 from '../../../assets/img/logo3.png'
  import logo4 from '../../../assets/img/logo4.png'
  import logo5 from '../../../assets/img/logo5.png'

  export default {
    name: "page",
    data(){
      return {
        images: 123,
        flag:false,
        wordsShow:true,
        num:0,
        cityName:this.$route.query.routeParams,
        pageName:[],
        productList:[]
      }
    },
    mounted(){

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

      //一级分类
      this.request();
      //第一个二级分类
      this.one();
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

      //第一个二级分类
      one(){
        let self =this;
        self.$ajax({
          method:"post",
          url:this.$apiTest + "goodsClass/class/firstId",
          params:{firstId:1}
        }).then(function(res){
          console.log(res.data.data);
          self.productList = res.data.data;
          console.log(self.productList);
        })
      },


      tab(item,index){
        console.log(item);
        console.log(index);
        // if (item == "品牌") {
        //   this.flag = true;
        //   this.wordsShow = false;
        // }else{
        //   this.flag = false;
        //   this.wordsShow = true;
        // }
        this.num = index;

        let self =this;
        self.$ajax({
          method:"post",
          url:this.$apiTest + "goodsClass/class/firstId",
          params:{firstId:parseInt(index)+1}
        }).then(function(res){
          console.log(res.data.data);
          self.productList = res.data.data;
          console.log(self.productList);
        })
      },

      request(){
        let self = this;
        console.log(self);
        self.$ajax({
          method:"post",
          url:this.$apiTest + "goodsClass/class/hierarchy",
          params:{hierarchy:1}
        }).then(function(res){
          console.log(res.data.data);
          for(var i in res.data.data){
            console.log(res.data.data[i]);
            self.pageName.push(res.data.data[i].gc_name);
          }
        });
      }
    }
  }
</script>

<style scoped>
  /*品牌名的页面--开始*/
  .styles .title{
    background-color: rgb(242,242,242);
    margin: 0 .3rem;
    padding-left: .2rem;
    font-weight: bold;
  }
  .styles ul.tabs ul.listOfGoods{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start !important;
    margin: 0 .3rem !important;
    background-color: rgb(242,242,242);
    padding: .3rem .2rem !important;
  }
  .styles ul.tabs ul.listOfGoods li.wrapImg{
    width: 32.9%;
    background-color: #fff;
    margin-left: 1px !important;
    margin-bottom: 1px !important;
    text-align: center;
  }
  /*品牌名的页面--结束*/
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
    height: 100vh;
    padding-bottom: 2rem;
  }
  .content .left{
    width: 21%;
    /*height: 100%;*/
    /*position: absolute;
    top: 1.3rem;
    left: 0;
    bottom: 0;*/
    float: left;
    background-color: rgb(242,242,242);
    overflow-y: scroll;
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
    height: 100vh;
    background-color: #fff;
    /*position: absolute;
    top: 0;
    right: 0;
    bottom: 0;*/
    float: right;
    overflow-y: scroll;
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
    flex-wrap: wrap;
    margin-top: .5rem;
    padding: 0 .3rem;
  }
  .right ul.tabs ul.listOfGoods li{
    width: 1.9rem;
    margin-bottom: .4rem;
    margin-left: .3rem;
    margin-right: .2rem;
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
