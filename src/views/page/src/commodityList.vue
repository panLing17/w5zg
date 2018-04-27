<template lang="pug">
  .wrapNav
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.push('/home')")
      .topCenter(slot="center")
        .searchInput
          input(:type="type",placeholder="请输入商品名称" @focus="$router.push({path:'/home/searchHistory',query:{changeFocus:true,msgs:message}})" v-model="message")
          img(src="../../../assets/img/searchInput搜索图标@2x.png")
      .topRight(slot="right")
        img(src="../../../assets/img/msg_0.png" v-show="false")
        .searchbtn(v-show="false") 搜索
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
    .commodityList.mescroll#pageMescroll
      .content
        .bottomList
          ul.goodsList#box
            li(v-for="item in recommendGoods" , @click="goGoods(item.gspu_id)")
              img(:src="item.gi_image_url | img-filter")
              .wrapWords
                .text <span v-show="item.carryFlag">可自提</span> {{item.gi_name}}
                .price {{item.price | price-filter}}
                  span 可省{{item.economize_price}}元
                .bottom(v-if="false") <span>江苏南京</span><span>{{item.gi_salenum}}人购买</span>
      .bottomPlaceholder
    .mask
      .lefter(@click="lefterBack()")
      .righter
        filtrate(@ievent="ievent" v-show="filtrateFlag" :message="message")
</template>

<script>
  import filtrate from './filtrate.vue'

  export default {
    name: "commodityList",
    components: {filtrate},
    data(){
      return {
        message:this.$route.query.msg, //在输入框搜索的内容
        filtrateFlag: true,
        mescroll: null,
        flags: false,
        check: true,
        checked: false,
        change: false,
        change1: true,
        change2: false,
        recommendGoods: [],
        style: false,
        brandId: "", //品牌的id
        minPrice: "", //开始价格区间
        maxPrice: "", //结束价格区间
        pickUps: "", //自提不自提
        checkFlag: false,
        noKey: true,
        order: 1, //字段排序
        keyWord: "", //关键字
        sort: "", //正序倒序
      }
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: 'placeholder'
      }
    },
    mounted(){
      //根据判断是哪个页面传过来的关键字
      //this.keywordsSearch();
      //上拉加载
      this.$mescrollInt("pageMescroll",this.upCallback);
      //商品展示
      //this.exhibition();
      //让页面加载时将搜索的文字拼到url上
      //this.onload();
      //进入页面时加载
      //this.request();
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
    },
    methods:{
      //遮罩层出现后不让页面滑动
      notScroll (e) {
        e.preventDefault();
      },
      //让页面加载时将搜索的文字拼到url上
      onload(){
        this.$router.push({path:'/page/commodityList',query:{name:this.message}});
      },
      //根据判断是哪个页面传过来的关键字
      keywordsSearch(){
        //从分类首页的三级传来
        // if (this.$route.query.thirdFlag == true) {
        //   this.message = this.$route.query.thirdKey;
        // }
        //从搜索历史页传来
        // if (this.$route.query.flag == true) {
        //   this.message = this.$route.query.msg;
        // }
        //this.message = this.$route.query.msg;
        this.onload();
        //this.exhibition();
      },
      //商品的展示
      exhibition(){
        let self = this;
        self.$ajax({
          method:"post",
          url:self.$apiGoods + "goodsSearch/spus",
          params:{
            carryType: self.pickUps, //自提不自提
            startPrice: self.minPrice, //开始价格区间
            endPrice: self.maxPrice, //结束价格区间
            bi_id: self.brandId, //品牌的id
            sortType: self.sort, //正序倒序
            keywords: self.message, //关键字
            sortFieldType: self.order //字段排序
          }
        }).then(function(res){
          self.recommendGoods = res.data.data;
          if(self.recommendGoods.length<=0){
            self.$router.push({path:'/home/searchHistory',query:{relNum:1}});
          }else{
            for (var i = 0; i < self.recommendGoods.length; i++) {
              if(self.recommendGoods[i].carry_type == 1){
                self.recommendGoods[i].carryFlag = true;
              }
              if (self.recommendGoods[i].carry_type == 2) {
                self.recommendGoods[i].carryFlag = false;
              }
            }
          }
        })
      },
      //进入商品详情
      goGoods(goodsId){
        this.$router.push({
          path:'/goodsDetailed',
          query:{
            id:goodsId
          }
        })
      },
      //筛选左滑
      leftScroll(){
        this.mescroll.lockDownScroll(true);
        this.mescroll.lockUpScroll(true);
        this.filtrateFlag = true;
        var mask = document.getElementsByClassName("mask")[0];
        var lefter = document.getElementsByClassName("lefter")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        mask.style.opacity = 1;
        mask.style.left = 0;
        mask.style.transition = "left .5s";
        commodityList.style.overflow = "hidden";
      },
      lefterBack(){
        this.mescroll.lockDownScroll(false);
        this.mescroll.lockUpScroll(false);
        var mask = document.getElementsByClassName("mask")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
        mask.style.left = "100%";
        mask.style.opacity = 0;
        mask.style.transition = "left .3s, opacity .3s";
        commodityList.style.overflow = "scroll";
      },
      //从筛选传值过来
      ievent(data){
        this.mescroll.lockDownScroll(false);
        this.mescroll.lockUpScroll(false);
        var mask = document.getElementsByClassName("mask")[0];
        var commodityList = document.getElementsByClassName("commodityList")[0];
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
          this.message = data.brandName;
          this.maxPrice = data.maxPrice;
          this.minPrice = data.minPrice;
          this.checkFlag = true;
        }
        if (data.flag1 == false) {
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
          this.brandId = "",
          this.maxPrice = data.maxPrice;
          this.minPrice = data.minPrice;
          this.checkFlag = true;
        }
        this.request();
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
        this.request();
      },
      //销量排序
      changes2:function(){
        this.change2 = !this.change2;
        this.change1 = false;
        this.change = false;
        this.check = true;
        this.checked = false;
        if (this.change2 == true) {
          this.order = 2;
        } else {
          this.order = "";
        }
        this.request();
      },
      exchange:function(){
        this.flags = !this.flags;
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
        self.$ajax({
          method:"post",
          url:self.$apiGoods + "goodsSearch/spus",
          params:{
            page: pageNum, //页码
            rows: pageSize, //每页长度
            carryType: self.pickUps, //自提不自提
            startPrice: self.minPrice, //开始价格区间
            endPrice: self.maxPrice, //结束价格区间
            bi_id: self.brandId, //品牌的id
            sortType: self.sort, //正序倒序
            keywords: self.message, //关键字
            sortFieldType: self.order //字段排序
          }
        }).then(function(response){
          // if(response.data.data.length<=0){
          //   self.message = "";
          //   self.$router.push({path:'/home/searchHistory',query:{relNum:1}});
          // } else {
            for (var i = 0; i < response.data.data.length; i++) {
              if (response.data.data[i].carry_type == 1) {
                response.data.data[i].carryFlag = true;
              }
              if (response.data.data[i].carry_type == 2) {
                response.data.data[i].carryFlag = false;
              }
            }
            successCallback&&successCallback(response.data.data);//成功回调
          // }

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
          url:self.$apiGoods + "goodsSearch/spus",
          params:{
            page: 1, //页码
            rows: 4, //每页长度
            carryType: self.pickUps, //自提不自提
            startPrice: self.minPrice, //开始价格区间
            endPrice: self.maxPrice, //结束价格区间
            bi_id: self.brandId, //品牌的id
            sortType: self.sort, //正序倒序
            keywords: self.message, //关键字
            sortFieldType: self.order //字段排序
          }
        }).then(function(response){
          //self.recommendGoods = response.data.data;//成功回调
          if(response.data.data.length<=0){
            self.message = "";
            self.$router.push({path:'/home/searchHistory',query:{relNum:1}});
          } else{
            self.recommendGoods = response.data.data;
            for (var i = 0; i < self.recommendGoods.length; i++) {
              if(self.recommendGoods[i].carry_type == 1){
                self.recommendGoods[i].carryFlag = true;
              }
              if (self.recommendGoods[i].carry_type == 2) {
                self.recommendGoods[i].carryFlag = false;
              }
            }
          }
        })
      }
    }
  }
</script>

<style scoped>
  #pageMescroll {
    position: fixed;
    top: 1.3rem;
    bottom: 0;
    /*height: auto;*/
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
    /*margin-top: 1.3rem;*/
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
  .topRight .searchbtn{
    font-size: .4rem;
    font-weight: 400;
    color: rgb(244,0,87);
  }
  /*顶部搜索--结束*/
  /*搜索框样式--开始*/
  .searchInput{
    width: 6.5rem;
    height: .9rem;
    background-color: rgb(238,238,238);
    border-radius: .9rem;
    line-height: .9rem;
  }
  .searchInput img{
    width: .4rem;
    vertical-align: middle;
    margin-left: .2rem;
  }
  .searchInput input{
    width: 80%;
    border: 0;
    outline: none;
    font-size: .3rem;
    margin-left: .4rem;
    background-color: rgb(238,238,238);
  }
  /*搜索框样式--结束*/
  /*中间内容部分顶部左边--开始*/
  .content{
    overflow: hidden;
  }
  ul.wrap{
    display: flex;
    justify-content: space-between;
    width: 100%;
    height: 1.2rem;
    padding: 0 .3rem;
    background-color: #fff;
    position: fixed;
    top: 1.3rem;
    z-index: 101;
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
  .goodsList{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: .2rem;
    background: rgb(242,242,242);
  }
  .goodsList li{
    border-radius: 5px;
    overflow: hidden;
    width: 49%;
    float: left;
    margin-bottom: .2rem;
    background-color: #fff;
  }
  .goodsList li img{
    width: 100%;
  }
  .text{
    margin: .1rem;
  }
  .text span{
    font-size: .3rem;
    padding: 1px .2rem 0 .2rem;
    background-color: rgb(246, 0, 87);
    color: white;
    border-radius: .2rem;
    margin-right: .1rem;
  }
  .goodsList .price{
    margin: .2rem .1rem;
    color: rgb(246,0,87);
    font-weight: 600;
    font-size: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .price span{
    font-weight: 500;
    font-size: .3rem;
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
    width: 100%;
    background-color: #fff;
  }
  .toggle .wrapWords .text{
    width: 100%;
    margin-top: .1rem;
    word-wrap: break-word;
  }
  .toggle .wrapWords .price{
    width: 100%;
    margin: .2rem 0;
    color: rgb(246,0,87);
    font-weight: 600;
    font-size: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
    background-color: rgba(0,0,0,0.3);
    position: fixed;
    top: 0;
    left: 110%;
    right: 0;
    bottom: 0;
    z-index: 105;
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
  .bottomPlaceholder{
    /*height: 0;*/
  }
  .scrollWarpClass{
    z-index: 103 !important;
  }
</style>
