<template lang="pug">
  div.homeBox.mescroll#homeMescroll(:class="{positionFixed:positionFixed}", v-loading="loadingFlag<4")
    nav-bar(background="rgb(245,0,87)")
      .topLeft(slot="left", @click="goToCitySearch()")
        img(src="../../../assets/img/home定位按钮@2x.png")
        span.city {{cityName}}
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称", @focus="jump")
        img(src="../../../assets/img/home扫描@2x.png", @click="searchCode")
      .topRight(slot="right")
        img(src="../../../assets/img/msg.png")
    carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:5rem")
      div(v-for="tag in banner", style="width:100%" , @click="goActivity(tag.ac_id,tag.linkType)")
        img(:src="tag.ac_phone_image | img-filter" , style="width:100%;height:5rem")
    hot-button(:list="hotButton")
    l-news.news(:newsData="news")
    .title
      .line
      p 活动
    w-activity(:listData="activityGoods")
    .title
      .line
      p 推荐
    w-recommend(:listData="recommendGoods")
    .bottomPlaceholder
</template>
<script>
  import hotButton from './hotButton'
  import lNews from './news'
  import wActivity from './activities'
  export default {
    name: 'home',
    data() {
      return {
        // 整页的固定定位，如果一直有的话会影响页面切换效果
        positionFixed: false,
        // mescroll: null,
        loadingFlag: 0,
        date: 1,
        cityName:this.$route.query.routeParams,
        activityGoods: [],
        recommendGoods: [],
        hotButton: [],
        loadingMoreFlag: false,
        page: 1,
        news: [],
        titlePhoto: [
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          },
          {
            image: ''
          }
        ],
        banner: [
        ]
      }
    },
    watch: {
      loadingFlag () {
        if (this.loadingFlag === 4) {
          this.animateHack()
        }
      }
    },
    mounted() {
      this.$mescrollInt("homeMescroll",this.upCallback);
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
      // 获取banner
      this.getBanner()
      // 获取新闻
      this.getNews()
      // 获取活动
      this.getCtivity()
      // 获取分类
      this.getHotButton()
      // 微信sdk
      this.wxConfig()
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods: {
      jump:function(){
        this.$router.push('/home/searchHistory');
      },
      // 轮播图获取
      getBanner () {
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/advertiseContentList',
          params: {
            acCataType: 111
          },
        }).then(function (response) {
          self.banner = response.data.data
          self.loadingFlag += 1
        })
      },
      // 获取分类
      getHotButton () {
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiApp + 'acActivity/acActivityList',
          params: {
            type: '331'
          },
        }).then(function (response) {
          self.hotButton = response.data.data
          self.loadingFlag += 1
        })
      },
      // 获取新闻
      getNews () {
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/acInformationByCataId',
          params: {
            page: 1,
            rows: 10,
            cataId: 1
          },
        }).then(function (response) {
          self.news = response.data.data
          self.loadingFlag += 1
        })
      },
      // 获取活动
      getCtivity () {
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiApp + 'acActivity/acActivityList',
          params: {
            type: '332'
          },
        }).then(function (response) {
          self.activityGoods = response.data.data
          self.loadingFlag += 1
        })
      },
      goToCitySearch:function(){
        this.$router.push({
           name: '城市搜索',
           query: {
              routeParams: 1
           }
        });
      },
      // 切换动画hack
      animateHack () {
        let self = this
        setTimeout(function () {
          self.positionFixed = true
        },400)
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
//          	axios.get("xxxxxx", {
//					params: {
//						num: pageNum, //页码
//						size: pageSize //每页长度
//					}
//				})
//				.then(function(response)
        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiGoods +  'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback&&successCallback(response.data.data);//成功回调
        })
      },
      GetQueryString(url, name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
        var r = url.split('?')[1].match(reg)  //获取url中"?"符后的字符串并正则匹配
        var context = ''
        if (r != null)
          context = r[2]
        reg = null
        r = null
        return context == null || context == '' || context == 'undefined' ? '' : context
      },
      aaa() {
        this.$confirm({
          title: '确认',
          message: '真的要这样做吗',
          confirm: () => {
            alert('确定')
          },
          noConfirm: () => {
            alert('取消')
          }
        })
      },
      wxConfig() {
        let _this = this
        _this.$ajax({
          method: 'get',
          url: _this.$apiTransaction + 'thirdPay/sao',
          params: {
            url: window.location.href
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名，见附录1
            jsApiList: ['scanQRCode'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        })
      },
      searchCode() {
        let self = this
        let _this = this
         wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            let id = _this.GetQueryString(res.resultStr, 'containerId')
            _this.$ajax({
              method: 'post',
              url: 'sweep/sweepResult',
              params: {
                containerId: id
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).then(function (response) {
              response.data.code = response.data.code.toString()
              if (response.data.code === '100') {
                _this.$message.success('扫码成功，请您开柜')
              }
            })
          },
          error: function(res){
            if(res.errMsg.indexOf('function_not_exist') > 0){
              alert('版本过低请升级')
            }
          }
        })
      },
      goSearch() {
        this.$router.push('/search')
      },
      goActivity(link, type) {
          this.$router.push({path: '/goodsDetailed', query: {id: link}})
      }
    },
    components: {hotButton, lNews, wActivity}
  }
</script>

<style scoped>
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
  #homeMescroll {
    top: 0;
    bottom: 0;
    height: auto;
    position: fixed;
  }
  .positionFixed{
    position: fixed !important;
  }
  .homeBox {
    background: #f2f2f2;
    padding-bottom: 2rem;
    min-height: 100vh;
  }
  .news {
    margin-top: 6px;
  }

  .title{
    height: .8rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
  }
  .line{
    height: 1px;
    width: 3rem;
    background: #999;
  }
  .title p{
    position: absolute;
    background: #f2f2f2 ;
    padding: 0 .2rem;
  }
  .loadingNotMore {
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #d3d3d3;
  }

  .have {
    opacity: 1;
    animation: opacity-fade .2s infinite;
    animation-direction: alternate;
  }
  .bottomPlaceholder {
    height: 1.5rem;
  }
  @keyframes opacity-fade {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }
</style>
