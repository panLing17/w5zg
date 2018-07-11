<template lang="pug">
  .wrapPage
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/location.png")
        span.city {{cityName}}
      .topCenter(slot="center")
        .searchInput
          img(src="../../../assets/img/searchInput搜索图标@2x.png").leftImg
          input(type="text", placeholder="请输入商品名称", @click="$router.push({path:'/home/searchHistory',query:{jumps:'page'}})", readonly, unselectable='on')
          img(src="../../../assets/img/home扫描@2x.png" v-show="true" @click="scan()").rightImg
      .topRight(slot="right")
        img(src="../../../assets/img/msg_0.png" v-show="false")
    .page
      .content(v-loading="loadingFlag<2")
        .left(ref='lefters').mescroll#pagesLMescroll
          ul
            li(v-for="(item,index) in pageName" :class="{active:index == num}" @click="tab(item.gc_name,index,item.gc_id)") {{item.gc_name}}
        .right(:class="{styles:flag}" ref='righters').mescroll#pagesRMescroll
          ul.tabs(v-for="(item,index) in productList" v-if="rightShowFlag")
            li.tabsList
              .title
                span.point(v-show="wordsShow")
                span.letter {{item.gc_name}}
              ul.listOfGoods
                li(v-for="items in item.childList" @click="$router.push({path:'/page/commodityList',query:{msg:items.gc_keywords,flags:1,jumps:'page'}})").wrapImg
                  img(:src="items.gc_icon | img-filter")
                  .words(v-show="wordsShow") {{items.gc_name}}
</template>

<script>
  export default {
    name: 'page',
    data () {
      return {
        goodsId: '',
        images: 123,
        flag: false,
        wordsShow: true,
        num: 0,
        cityName: this.$route.query.routeParams,
        pageName: [],
        productList: [],
        loadingFlag: 0,
        rightShowFlag: '' // 控制右侧内容的显隐
      }
    },
    activated () {

    },
    beforeDestroy () {
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
    },
    mounted () {
      // 判断显示城市的字数
      this.judgeCityNum()
      // 一级分类
      this.request()
      // 判断显示当前城市
      this.judgeCity()
      this.$mescrollInt('pagesLMescroll', this.upCallbackL)
      this.$mescrollInt('pagesRMescroll', this.upCallbackR)
      this.hideStyles()
    },
    methods: {
      hideStyles () {
        this.$refs.lefters.children[2].style.display = 'none'
        this.$refs.righters.children[1].style.display = 'none'
      },
      // 判断显示城市的字数
      judgeCityNum () {
        let citys = document.getElementsByClassName('city')[0]
        if (citys.innerText.length === 2) {
          citys.style.fontSize = 0.4 + 'rem'
        }
        if (citys.innerText.length === 3) {
          citys.style.fontSize = 0.2 + 'rem'
        }
        if (citys.innerText.length === 4) {
          citys.style.fontSize = 0.35 + 'rem'
        }
      },
      // 判断显示当前的城市
      judgeCity () {
        if (this.$route.query.routeParams) {
          this.cityName = this.$route.query.routeParams
        } else {
          this.cityName = '南京'
        }
      },

      goToCitySearch: function () {
        this.$router.push({
          name: '城市搜索',
          query: {
            routeParams: 2
          }
        })
      },
      // 扫描
      scan () {
        // let self = this
        // let _this = this
        // wx.scanQRCode({
        //   desc: 'scanQRCode desc',
        //   needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        //   scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        //   success: function (res) {
        //     // alert(res.resultStr)
        //     // let id = _this.GetQueryString(res.resultStr, 'containerId')
        //     // _this.$ajax({
        //     //   method: 'post',
        //     //   url: 'sweep/sweepResult',
        //     //   params: {
        //     //     containerId: id
        //     //   },
        //     //   headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        //     // }).then(function (response) {
        //     //   response.data.code = response.data.code.toString()
        //     //   if (response.data.code === '100') {
        //     //     _this.$message.success('扫码成功')
        //     //   }
        //     // })
        //   },
        //   error: function (res) {
        //     if (res.errMsg.indexOf('function_not_exist') > 0) {
        //
        //     }
        //   }
        // })
      },

      // 第一个二级分类
      one (id) {
        let self = this
        self.$ajax({
          method: 'post',
          url: this.$apiGoods + 'goodsClass/class/firstId',
          params: {firstId: id}
        }).then(function (res) {
          self.rightShowFlag = true
          self.productList = res.data.data
          self.loadingFlag += 1
        })
      },
      // 点击左侧一级分类切换右边二三级
      tab (item, index, id) {
        this.flag = false
        this.wordsShow = true
        this.num = index
        this.rightShowFlag = false
        let self = this
        self.$ajax({
          method: 'post',
          url: this.$apiGoods + 'goodsClass/class/firstId',
          params: {firstId: id}
        }).then(function (res) {
          self.rightShowFlag = true
          self.productList = res.data.data
        })
      },

      // 展示左侧商品导航
      request () {
        let self = this
        self.$ajax({
          method: 'post',
          url: this.$apiGoods + 'goodsClass/class/hierarchy',
          params: {hierarchy: 1}
        }).then(function (res) {
          self.pageName = res.data.data
          self.goodsName = res.data.data[0].gc_id
          self.one(res.data.data[0].gc_id)
          self.loadingFlag += 1
        })
      },

      upCallbackR: function (page) {
        let self = this
        this.getListDataFromNetR(page.num, page.size, function (curPageData) {
          // if (page.num === 1) self.productList = []
          // self.productList = self.productList.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      },
      upCallbackL: function (page) {
        let self = this
        this.getListDataFromNetL(page.num, page.size, function (curPageData) {
          // if (page.num === 1) self.pageName = []
          // self.pageName = self.pageName.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      },
      getListDataFromNetR (pageNum, pageSize, successCallback, errorCallback) {
        successCallback && successCallback({}) // 成功回调
      },
      getListDataFromNetL (pageNum, pageSize, successCallback, errorCallback) {
        successCallback && successCallback({}) // 成功回调
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
  .wrapPage{
    /*width: 100%;
    height: 100vh;*/
    /*overflow: hidden;*/
    /*-webkit-overflow-scrolling: touch;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;*/
  }
  .page{
    /*width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
    overflow: hidden;*/
    /*position: fixed;*/
  }
  /*顶部搜索--开始*/
  .topLeft{
    width: 1.8rem;
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
    position: relative;
  }
  /*搜索框样式--开始*/
  .searchInput{
    width: 6.5rem;
    height: .7rem;
    background-color: rgb(238,238,238);
    border-radius: .9rem;
    line-height: .7rem;
  }
  .searchInput img.leftImg{
    width: .45rem;
    vertical-align: middle;
    margin-left: .3rem;
  }
  .searchInput img.rightImg{
    width: .45rem;
    vertical-align: middle;
    margin-left: .2rem;
  }
  .searchInput input{
    width: 70%;
    border: 0;
    outline: none;
    font-size: .3rem;
    margin-left: .2rem;
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
  .content:after{
    content: '';
    display: block;
    clear: both;
  }
  .content{
    width: 100%;
    height: 100vh;
    background-color: #fff;
    position: fixed;
    top: 0;
    bottom: 0;
    padding: 1.28rem 0 1.6rem;
  }
  .content .left{
    width: 21%;
    height: 100%;
    float: left;
    background-color: rgb(242,242,242);
    overflow-y: scroll;
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
    height: 100%;
    background-color: #fff;
    float: left;
    overflow-y: scroll;
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
