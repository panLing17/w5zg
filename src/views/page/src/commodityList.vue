<template lang="pug">
  .commodityList.mescroll#pageMescroll
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称")
      .topRight(slot="right")
        img(src="../../../assets/img/scanSuccess消息.png")
    .content
      ul.wrap
        li.left
          ul
            li(@click="changes1()" :class="{active:change1}") 综合
            li(@click="changes2()" :class="{active:change2}") 销量
        li.right
          ul
            li.showStyle(@click="exchange()") 
              img(src="../../../assets/img/page大图列表.png" v-show="!flag")
              img(src="../../../assets/img/page列表.png" v-show="flag")
            li.price(@click="liftOrSort()") 
              .priceWords(:class="{active:change}") 价格
              .topDown
                img(src="../../../assets/img/page升序.png" v-show="check").top
                img(src="../../../assets/img/page升序checked.png" v-show="!check").top
                img(src="../../../assets/img/page降序.png" v-show="!checked").down
                img(src="../../../assets/img/page降序checked.png" v-show="checked").down
            li.filters | 筛选
              img(src="../../../assets/img/page筛选.png")
      w-recommend#dataId(:listData="recommendGoods")
      .bottomPlaceholder
</template>

<script>
  import jacket from '../../../assets/img/page_jacket.png'
  import downCoat from '../../../assets/img/page_downCoat.png'
  import coat from '../../../assets/img/page_coat.png'
  import wRecommend from '../../home/src/bottomList'

  export default {
    name: "commodityList",
    components: {wRecommend},
    data(){
      return {
        mescroll: null,
        flag: false,
        check: true,
        checked: false,
        change: false,
        change1: false,
        change2: false, 
        recommendGoods: []
      }
    },
    mounted(){
      window.onscroll = function() {};

      this.$mescrollInt("pageMescroll",this.upCallback);

    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods:{
      changes1:function(){
        this.change1 = !this.change1;
        this.change2 = false;
        this.change = false;
        this.check = true;
        this.checked = false;
      },
      changes2:function(){
        this.change2 = !this.change2;
        this.change1 = false;
        this.change = false;
        this.check = true;
        this.checked = false;
      },
      exchange:function(){
        this.flag = !this.flag;
      },
      liftOrSort(){
        this.checked = !this.checked;
        this.check = !this.check;
        this.check = this.checked;
        this.change = true;
        this.change1 = false;
        this.change2 = false;
      },
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          if(page.num === 1) self.recommendGoods = []
          self.recommendGoods = self.recommendGoods.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        setTimeout(function () {
//            axios.get("xxxxxx", {
//          params: {
//            num: pageNum, //页码
//            size: pageSize //每页长度
//          }
//        })
//        .then(function(response) {
          successCallback&&successCallback({});//成功回调
          successCallback&&successCallback({});//成功回调
          successCallback&&successCallback({});//成功回调
          successCallback&&successCallback({});//成功回调
//        })
//        .catch(function(error) {
//          errorCallback&&errorCallback()//失败回调
//        });
        },1000)
      },
    }
  }
</script>

<style scoped>
  #pageMescroll {
    position: fixed;
    top: 0;
    bottom: 0;
    height: auto;
  }
  .active{
    background-color: #fff;
    color: rgb(244,0,87) !important;
  }
  .commodityList{
    width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
    padding-bottom: 2rem;
  }
  /*顶部搜索--开始*/
  .topCenter{
    margin-left: .1rem;
    position: relative;
  }
  .topRight{
    margin-right: .1rem;
  }
  .topRight img{
    width: .7rem;
    vertical-align: middle;
  }
  /*顶部搜索--结束*/
  /*中间内容部分顶部左边--开始*/
  .content{
    padding-bottom: 2rem;
  }
  .content ul.wrap{
    display: flex;
    justify-content: space-between;
    height: 1.2rem;
    padding: 0 .3rem;
    background-color: #fff;
  }
  ul.wrap li{
    font-size: .4rem;
    text-align: center;
    line-height: 1.2rem;
    color: rgb(51,51,51);
  }
  li.left ul{
    display: flex;
  }
  li.left ul li{
    margin-right: 1rem;
  }
  /*中间内容部分顶部左边--结束*/
  /*中间内容部分顶部右边--开始*/
  li.right ul{
    display: flex;
  }
  li.right ul li.showStyle img{
    vertical-align: middle;
    width: .4rem;
    margin-top: -.1rem;
    margin-right: .1rem;
  }
  li.right ul li.price{
    display: flex;
  }
  li.right ul li.price .topDown{
    position: relative;
  }
  li.right ul li.price .topDown img{
    width: .3rem;
  }
  li.right ul li.price .topDown img.top{
    position: absolute;
    top: .35rem;
  }
  li.right ul li.price .topDown img.down{
    position: absolute;
    bottom: .35rem;
  }
  li.right ul li.filters{
    margin-left: .4rem;
  }
  li.right ul li.filters img{
    width: .4rem;
    vertical-align: middle;
    margin-top: -.1rem;
  }
  /*中间内容部分顶部右边--结束*/
</style>
