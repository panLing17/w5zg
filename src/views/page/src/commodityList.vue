<template lang="pug">
  .commodityList.mescroll#pageMescroll
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称" @focus="$router.push('/home/searchHistory')")
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
              img(src="../../../assets/img/pageBigList.png" v-show="!flags")
              img(src="../../../assets/img/pageList.png" v-show="flags")
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
            img(:src="item.gi_image_url | img-filter")
            .wrapWords
              .text {{item.gi_name}}
              .price ￥{{item.price}}
              .bottom <span>江苏南京</span><span>{{item.gi_salenum}}人购买</span>             
    .mask
      .lefter(@click="lefterBack()")
      .righter
        filtrate(@ievent="ievent" v-show="filtrateFlag" @showSon="showSon")
        allBrand(v-show="allBrandFlag" @searchBrand="searchBrand" @searchBrandHot="searchBrandHot")
    .bottomPlaceholder
</template>

<script>
  import filtrate from './filtrate.vue'
  import allBrand from './allBrand.vue'

  export default {
    name: "commodityList",
    components: {filtrate,allBrand},
    data(){
      return {
        filtrateFlag: true,
        allBrandFlag: false,
        mescroll: null,
        flags: false,
        check: true,
        checked: false,
        change: false,
        change1: false,
        change2: false,
        recommendGoods: [],
        style: false,
        brandId: "", //品牌的id
        minPrice: "", //开始价格区间
        maxPrice: "", //结束价格区间
        pickUps: "", //自提不自提
        checkFlag: false, 
        noKey: true,
        order: "", //字段排序
        keyWord: this.$route.query.msg, //关键字
        sort: "", //正序倒序
      }
    },
    mounted(){
      //window.onscroll = function() {};
      this.$mescrollInt("pageMescroll",this.upCallback);
      //商品展示
      //this.exhibition();
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods:{
      //商品的展示
      exhibition(){
        let self = this;
        console.log(self.pickUps);
        console.log(self.minPrice);
        console.log(self.maxPrice);
        console.log(self.brandId);
        console.log(self.keyWord);
        console.log(self.sort);
        console.log(self.order);
        self.$ajax({
          method:"post",
          url:this.$apiClassify + "goodsSearch/spus",
          params:{
            carryType: self.pickUps, //自提不自提
            startPrice: self.minPrice, //开始价格区间
            endPrice: self.maxPrice, //结束价格区间
            bi_id: self.brandId, //品牌的id
            sortType: self.sort, //正序倒序
            keywords: self.keyWord, //关键字
            sortFieldType: self.order //字段排序
          }
        }).then(function(res){
          console.log(res.data.data);
          self.recommendGoods = res.data.data;
          console.log(self.recommendGoods);
        })
      },
      //进入商品详情
      goGoods(goodsId){
        this.$router.push('/goodsDetailed');
      },
      // 筛选左滑
      leftScroll(){
        var _this = this;
        //this.$mescrollInt("",this.upCallback);
        this.filtrateFlag = true;
        this.allBrandFlag = false;
        var mask = document.getElementsByClassName("mask")[0];
        var lefter = document.getElementsByClassName("lefter")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        console.log(lefter);
        mask.style.opacity = 1;
        mask.style.left = 0;
        mask.style.transition = "left .5s";
        commodityList.style.overflow = "hidden";
      },
      lefterBack(){
        //_this.$mescrollInt("pageMescroll",this.upCallback);
        var mask = document.getElementsByClassName("mask")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        mask.style.left = "100%";
        mask.style.opacity = 0;
        mask.style.transition = "left .3s, opacity .3s";
        commodityList.style.overflow = "scroll";
      },
      //从筛选传值过来
      ievent(data){
        console.log(data);
        var mask = document.getElementsByClassName("mask")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        console.log(data.flag1);
        if (data.flag1 == true) {
          mask.style.left = "100%";
          mask.style.opacity = 0;
          mask.style.transition = "left .3s, opacity .3s";
          commodityList.style.overflow = "scroll";
          if (data.pickUps == "可自提") {
            this.pickUps = 1;
          }
          if (data.pickUps == "不可自提") {
            this.pickUps = 2;
          }
          this.brandId = data.brandId;
          this.maxPrice = data.maxPrice;
          this.minPrice = data.minPrice;
          this.checkFlag = true;
          console.log(this.pickUps);
        }
        this.request();  
      },

      //从字母列表传来的值
      searchBrand(data){
        var mask = document.getElementsByClassName("mask")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        console.log(data.flag2);
        if (data.flag2 == true) {
          mask.style.left = "100%";
          mask.style.opacity = 0;
          mask.style.transition = "left .3s, opacity .3s";
          commodityList.style.overflow = "scroll";
          this.brandId = data.brandId2;
        }
        this.request();  
      },
      //热门品牌
      searchBrandHot(data){
        var mask = document.getElementsByClassName("mask")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        console.log(data.flag2);
        if (data.flag2 == true) {
          mask.style.left = "100%";
          mask.style.opacity = 0;
          mask.style.transition = "left .3s, opacity .3s";
          commodityList.style.overflow = "scroll";
          this.brandId = data.brandId2;
        }
        this.request();
      },
      showSon(data){
        console.log(data.a);
        if (data.a == 1) {
          this.filtrateFlag = false;
          this.allBrandFlag = true;
        }
      },
      //综合排序
      changes1:function(){
        this.change1 = !this.change1;
        this.change2 = false;
        this.change = false;
        this.check = true;
        this.checked = false;
        if (this.change1 == true){
          this.order = 1;
        } else{
          this.order = "";
        }
        this.order = 1;
        this.request();
      },
      //销量排序
      changes2:function(){
        this.change2 = !this.change2;
        this.change1 = false;
        this.change = false;
        this.check = true;
        this.checked = false;
        this.order = 2;
        this.request();
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
      //价格排序
      liftOrSort(){
        this.checked = !this.checked;
        this.check = !this.check;
        this.check = this.checked;
        this.change = true;
        this.change1 = false;
        this.change2 = false;

        this.order = 3;
        if (this.check == false) {
          this.sort = 2;
        }
        if (this.check == true) {
          this.sort = 1;
        }
        this.request(); 
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
        let self = this;
        console.log(self.$route.query.msg);
        console.log(self.checkFlag);
        
        console.log(self.pickUps);
        console.log(self.minPrice);
        console.log(self.maxPrice);
        console.log(self.brandId);
        self.$ajax({
          method:"post",
          url:self.$apiClassify + "goodsSearch/spus",
          params:{
            page: pageNum, //页码
            rows: pageSize, //每页长度
            carryType: self.pickUps, //自提不自提
            startPrice: self.minPrice, //开始价格区间
            endPrice: self.maxPrice, //结束价格区间
            bi_id: self.brandId, //品牌的id
            sortType: self.sort, //正序倒序
            keywords: self.keyWord, //关键字
            sortFieldType: self.order //字段排序
          }
        }).then(function(response){
          console.log(response);
          if(response.data.data.length<=0){
            self.$router.push('/home/searchResult');
          } else{
            successCallback&&successCallback(response.data.data);//成功回调
          }
        })

//        .catch(function(error) {
//          errorCallback&&errorCallback()//失败回调
//        });

      },

      //请求
      request(){
        let self = this;
        self.$ajax({
          method:"post",
          url:self.$apiClassify + "goodsSearch/spus",
          params:{
            page: 1, //页码
            rows: 20, //每页长度
            carryType: self.pickUps, //自提不自提
            startPrice: self.minPrice, //开始价格区间
            endPrice: self.maxPrice, //结束价格区间
            bi_id: self.brandId, //品牌的id
            sortType: self.sort, //正序倒序
            keywords: self.keyWord, //关键字
            sortFieldType: self.order //字段排序
          }
        }).then(function(response){
          self.recommendGoods = response.data.data;//成功回调
        })
      }
    }
  }
</script>

<style scoped>
  #pageMescroll {
    position: fixed;
    top: 0;
    bottom: 0;
    height: auto;
    z-index: 100;
  }
  .active{
    background-color: #fff;
    color: rgb(244,0,87) !important;
  }
  .commodityList{
    width: 100%;
    min-height: 100vh;
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
    overflow: hidden;
  }
  .content ul.wrap{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 1.2rem;
    padding: 0 .3rem;
    background-color: #fff;
    position: fixed;
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
  .bottomList{
    margin-top: 1.2rem;
  }
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
    z-index: 101;
    display: flex;
  }
  .mask .lefter{
    width: 30%;
    height: 100vh;
    position: absolute;
    left: 0;
  }
  .mask .righter{
    width: 70%;
    height: 100vh;
    position: absolute;
    right: 0;
    overflow: scroll;
  }
  /*蒙板--结束*/
  .bottomPlaceholder {
    height: 1.5rem;
  }
  .scrollWarpClass{
    z-index: 103 !important;
  }
</style>
