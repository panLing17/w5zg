<template lang="pug">
  .wrapPage
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/location.png")
        span.city {{cityName}}
      .topCenter(slot="center")
        .searchInput
          img(src="../../../assets/img/searchInput搜索图标@2x.png").leftImg
          input(:type="type",placeholder="请输入商品名称" @focus="$router.push('/home/searchHistory')")
          img(src="../../../assets/img/home扫描@2x.png" v-show="true").rightImg
      .topRight(slot="right")
        img(src="../../../assets/img/msg_0.png" v-show="false")
    .page(v-loading="loadingFlag<2")
      .content
        .left
          ul
            li(v-for="(item,index) in pageName" :class="{active:index == num}" @click="tab(item.gc_name,index,item.gc_id)") {{item.gc_name}}
        transition(name="slide-fade")    
          .right(:class="{styles:flag}" v-if="rightShowFlag")
            ul(v-for="(item,index) in productList").tabs
              li.tabsList
                .title
                  span.point(v-show="wordsShow")
                  span.letter {{item.gc_name}}
                ul.listOfGoods
                  li(v-for="items in item.childList" @click="$router.push({path:'/page/commodityList',query:{msg:items.gc_keywords,thirdFlag:true}})").wrapImg
                    img(:src="items.gc_icon | img-filter")
                    .words(v-show="wordsShow") {{items.gc_name}}
</template>

<script>
  export default {
    name: "page",
    data(){
      return {
        goodsId: "",
        images: 123,
        flag:false,
        wordsShow:true,
        num:0,
        cityName:this.$route.query.routeParams,
        pageName:[],
        productList:[],
        loadingFlag:0,
        rightShowFlag:"", //控制右侧内容的显隐
      }
    },
    mounted(){
      //判断显示城市的字数
      this.judgeCityNum();
      //一级分类
      this.request();
      //判断显示当前城市
      this.judgeCity();
    },
    methods:{
      //判断显示城市的字数
      judgeCityNum(){
        var citys = document.getElementsByClassName("city")[0];
        if (citys.innerText.length == 2) {
          citys.style.fontSize = .4 + "rem";
        }
        if (citys.innerText.length == 3) {
          citys.style.fontSize = .2 + "rem";
        }
        if (citys.innerText.length == 4) {
          citys.style.fontSize = .35 + "rem";
        }
      },
      //判断显示当前的城市
      judgeCity(){
        if (this.$route.query.routeParams) {
          this.cityName = this.$route.query.routeParams;
        } else{
          this.cityName = "南京";
        }
      },

      goToCitySearch:function(){
        this.$router.push({
           name: '城市搜索',
           query: {
              routeParams: 2
           }
        });
      },
      //第一个二级分类
      one(id){
        let self =this;
        self.$ajax({
          method:"post",
          url:this.$apiGoods + "goodsClass/class/firstId",
          params:{firstId:id}
        }).then(function(res){
          self.rightShowFlag = true;
          self.productList = res.data.data;
          self.loadingFlag += 1
        })
      },
      //点击左侧一级分类切换右边二三级
      tab(item,index,id){
        // if (item == "品牌") {
        //   this.flag = true;
        //   this.wordsShow = false;
        // }else{
          this.flag = false;
          this.wordsShow = true;
        // }
        this.num = index;
        this.rightShowFlag = false;
        let self =this;
        self.$ajax({
          method:"post",
          url:this.$apiGoods + "goodsClass/class/firstId",
          params:{firstId:id}
        }).then(function(res){
          self.rightShowFlag = true;
          self.productList = res.data.data;
        })
      },

      //展示左侧商品导航
      request(){
        let self = this;
        self.$ajax({
          method:"post",
          url:this.$apiGoods + "goodsClass/class/hierarchy",
          params:{hierarchy:1}
        }).then(function(res){
          self.pageName = res.data.data;
          self.goodsName = res.data.data[0].gc_id;
          self.one(res.data.data[0].gc_id);
          self.loadingFlag += 1
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
    width: 33%;
    background-color: #fff;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 1px !important;
    text-align: center;
  }
  /*品牌名的页面--结束*/
  .active{
    background-color: #fff !important;
    color: rgb(244,0,87) !important;
  }
  .page{
    width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
    padding-bottom: 2rem;
    overflow: hidden;
    position: fixed;
  }
  /*顶部搜索--开始*/
  .topLeft{
    width: 1.6rem;
  }
  .topLeft img{
    width: .3rem;
    vertical-align: middle;
    margin-left: .1rem;
  }
  .topLeft .city{
    width: 1rem;
    display: inline-block;
    vertical-align: middle;
    font-weight: 400;
    color: rgb(52,52,52);
    margin-left: .2rem;
    word-break: break-all;
  }
  .topCenter{
    margin-left: .2rem;
  }
  /*搜索框样式--开始*/
.searchInput{
  width: 6.5rem;
  height: .9rem;
  background-color: rgb(238,238,238);
  border-radius: .9rem;
  line-height: .9rem;
}
.searchInput img.leftImg{
  width: .4rem;
  vertical-align: middle;
  margin-left: .2rem;
}
.searchInput img.rightImg{
  width: .4rem;
  vertical-align: middle;
  margin-left: .2rem;
}
.searchInput input{
  width: 70%;
  border: 0;
  outline: none;
  font-size: .3rem;
  margin-left: .4rem;
  background-color: rgb(238,238,238);
}
/*搜索框样式--结束*/
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
    width: 100%;
    height: 100vh;
    padding-bottom: 2rem;
    background-color: #fff;
    /*position: absolute;*/
  }
  .content .left{
    width: 21%;
    height: 100vh;
    float: left;
    background-color: rgb(242,242,242);
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 3rem;
  }
  .content .left ul li{
    background-color: rgb(242,242,242);
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .4rem;
    font-weight: 600;
    border-bottom: 1px solid #fff;
  }
  /*中间内容左边--结束*/
  /*中间内容右边--开始*/
  .content .right{
    width: 79%;
    height: 100vh;
    background-color: #fff;
    /*position: absolute;
    top: 1.3rem;
    right: 0;*/
    float: left;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 3rem;
  }
  .right ul.tabs{
    padding-top: .45rem;
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
    margin: 0 .2rem .4rem .3rem;
  }
  .right ul.tabs ul.listOfGoods li img{
    width: 1.9rem;
  }
  .right ul.tabs ul.listOfGoods li .words{
    text-align: center;
    color: rgb(153,153,153);
  }
  /*中间内容右边--结束*/

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .7s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-30px);
    opacity: 0;
  }
</style>
