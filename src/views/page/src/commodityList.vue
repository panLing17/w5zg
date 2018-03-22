<template lang="pug">
  .commodityList.mescroll#pageMescroll
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称")
      .topRight(slot="right")
        img(src="../../../assets/img/msg_0.png")
    .content
      ul.wrap
        li.left
          ul
            li(@click="changes1()" :class="{active:change1}") 综合
            li(@click="changes2()" :class="{active:change2}") 销量
        li.right
          ul
            li.showStyle(@click="exchange()")
              img(src="../../../assets/img/pageBigList.png" v-show="!flag")
              img(src="../../../assets/img/pageList.png" v-show="flag")
            li.price(@click="liftOrSort()")
              .priceWords(:class="{active:change}") 价格
              .topDown
                img(src="../../../assets/img/pageAsc.png" v-show="check").top
                img(src="../../../assets/img/pageAscChecked.png" v-show="!check").top
                img(src="../../../assets/img/pageDesc.png" v-show="!checked").down
                img(src="../../../assets/img/pageDescChecked.png" v-show="checked").down
            li.filters(@click="leftScroll()") | 筛选
              img(src="../../../assets/img/pageFiltrate.png")
      .bottomList
        ul.goodsList#box
          li(v-for="item in recommendGoods" , @click="goGoods(item.goodsId)")
            img(src="../../../assets/img/my_goods.png")
            .wrapWords
              .text 商品拆散你都没法跟你阿萨德你看啥都能扩大萨德你看
              .price ￥516.22
              .bottom <span>江苏南京</span><span>2555人购买</span>
    .mask
      .lefter
      .righter
        filtrate
</template>

<script>
  import jacket from '../../../assets/img/page_jacket.png'
  import downCoat from '../../../assets/img/page_downCoat.png'
  import coat from '../../../assets/img/page_coat.png'
  import filtrate from './filtrate.vue'

  export default {
    name: "commodityList",
    components: {filtrate},
    data(){
      return {
        mescroll: null,
        flag: false,
        check: true,
        checked: false,
        change: false,
        change1: false,
        change2: false,
        recommendGoods: [],
        style: false
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
      // 筛选左滑
      leftScroll(){
        var mask = document.getElementsByClassName("mask")[0];
        var lefter = document.getElementsByClassName("lefter")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        console.log(lefter);
        mask.style.left = 0;
        mask.style.transition = "left .5s";
        commodityList.style.overflow = "hidden";
        lefter.onclick = function(){
          mask.style.left = "100%";
          mask.style.transition = "left opacity .2s";
          commodityList.style.overflow = "scroll";
        }
      },


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
        this.style = !this.style;
        var box = document.getElementById("box");
        var classVal = box.getAttribute('class');
        if (this.style == true) {
          classVal = classVal.replace("goodsList","toggle");
          box.setAttribute("class",classVal);
        }
        if (this.style == false) {
          classVal = classVal.replace("toggle","goodsList");
          box.setAttribute("class",classVal);
        }
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
        },500)
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
  /*商品大图展示--开始*/
  .goodsList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: .2rem;
    background: rgb(242,242,242);
  }
  .goodsList li{
    border: solid 1px #ccc;
    border-radius: 5px;
    overflow: hidden;
    width: 49%;
    float: left;
    margin-bottom: .2rem;
  }
  .goodsList li img {
    width: 100%;
  }
  .text{
    margin: .1rem;
  }
  .goodsList .price{
    margin: .2rem .1rem;
    color: rgb(246,0,87);
    font-weight: 600;
    font-size: .4rem;
  }
  .bottom{
    margin: .1rem;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
  /*商品大图展示--结束*/
  /*切换成列表模式的样式--开始*/
  .toggle li{
    margin-top: .2rem;
    background-color: #fff;
    padding: .2rem .3rem;
    display: flex;
  }
  .toggle li img{
    width: 2.5rem;
    height: 2.5rem;
    border-radius: .1rem;
  }
  .toggle li .wrapWords{
    margin-left: .3rem;
  }
  .toggle .wrapWords .text{
    width: 100%;
    margin-top: .1rem;
    word-wrap: break-word;
  }
  .toggle .wrapWords .price{
    margin: .2rem 0;
    color: rgb(246,0,87);
    font-weight: 600;
    font-size: .4rem;
  }
  .toggle .bottom{
    margin: .3rem .1rem 0;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
  /*切换成列表模式的样式--结束*/
  /*蒙板--开始*/
  .mask{
    background-color: rgb(0,0,0,0.3);
    position: fixed;
    top: 0;
    left: 110%;
    right: 0;
    bottom: 0;
    z-index: 10;
    display: flex;
  }
  .mask .lefter{
    width: 30%;
    height: 100%;
  }
  .mask .righter{
    width: 70%;
    height: 100%;
  }
  /*蒙板--结束*/

</style>
