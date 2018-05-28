<template lang="pug">
  div
    nav-bar.navBar(:background="navBarBg", border-bottom="none", height="0")
      .topLeft(slot="left")
        img(src="../../../assets/img/定位图标@2x.png", style="width: .3rem;")
        span.city {{cityName}}
      .topCenter(slot="center")
        .searchInput(:class="{opaque:navBarBg === 'rgba(245,0,87,1)'}")
          img(src="../../../assets/img/searchInput搜索图标@2x.png", @click="searchGoods()").leftImg
          input(type="text",placeholder="请输入商品名称", @keyup.enter="searchGoods()", @focus="jump")
          img(src="../../../assets/img/home扫描@2x.png", @click="searchCode").rightImg
      .topRight(slot="right")
        img(src="../../../assets/img/msg.png", @click="$router.push('/service')")
    div.homeBox.mescroll#homeMescroll(:class="{positionFixed:positionFixed}", v-loading="loadingFlag<4")
      .banner
        carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:4.2rem")
          div(v-for="(tag, index) in banner", style="width:100%" , @click.prevent="goActivity(index)")
            img(:src="tag.ac_phone_image | img-filter" , style="width:100%;height:4.2rem", @click.prevent="")
        .shanxing
      hot-button(:list="hotButton")
      l-news.news(:newsData="news")
      <!--img.title1(src="../../../assets/img/louceng1.png")-->
      .title1
      w-activity(:listData="activityGoods")
      <!--img.title2(src="../../../assets/img/louceng2.png")-->
      .title2
      recommend(ref="recommend")
      .bottomPlaceholder
    .adWrapper(@click.stop="$router.push('/registerTicket')", v-if="showRegisterTicket")
      img(src="../../../assets/img/ad1.png")
    .mask(@click.stop="closeTicket", v-if="showTicket")
    .adWrapper2(v-if="showTicket")
      .adWrap
        .cancelBtn(@click.stop="closeTicket")
        .adContent
          .adTitle APP新人福利
          .ticketWrapper
            .ticket
              .left
                span.small ￥
                span {{ticketMoney}}
              .right
                .dec1 现金券
                .dec2 领取后3个月内有效
          .rightBtn(@click.stop="closeTicket") 立即使用
</template>
<script>
  import hotButton from './hotButton'
  import lNews from './news'
  import wActivity from './activities'
  import recommend from './recommend'
  import {mapState} from 'vuex'
  import store from '../../../vuex/store'

  export default {
    name: 'home',
    data() {
      return {
        // 整页的固定定位，如果一直有的话会影响页面切换效果
        positionFixed: false,
        // mescroll: null,
        // 顶部背景色
        navBarBg: 'rgba(0,0,0,0)',
        loadingFlag: 0,
        date: 1,
        cityName: this.$route.query.routeParams,
        activityGoods: [],
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
        banner: [],
        showRegisterTicket: false,
        type: ''
      }
    },
    computed: {
      ...mapState(['showTicket', 'userData', 'ticketMoney', 'position'])
    },
    activated () {
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    beforeRouteLeave (to, from, next) {
      this.mescroll.hideTopBtn();
      next()
    },
    mounted() {
      this.$mescrollInt("homeMescroll", this.upCallback, () => {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0);
          }
        })
      }, (obj) => {
        if (obj.preScrollY>100) {
          this.navBarBg = 'rgba(245,0,87,1)'
        } else {
          this.navBarBg = 'rgba(0,0,0,0)'
        }

        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })

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
      // 动画hack
      this.animateHack()
      //判断显示当前的城市
      this.judgeCity()
      //判断显示城市的字数
      this.judgeCityNum()
      // 判断是否显示注册送券成功弹框
      let _this = this
      setTimeout(() => {
        _this.isLogin()
      }, 1000)

    },
    beforeDestroy() {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    methods: {
      isLogin() {
        if (localStorage.hasOwnProperty('token')) {
          if (this.userData && this.userData.member_type === '091') {
            if (this.userData && this.userData.reg_present === '11') {
              this.showRegisterTicket = false
            } else {
              this.showRegisterTicket = true
            }
          } else {
            this.showRegisterTicket = false
          }
        } else {
          this.showRegisterTicket = true
        }

      },
      closeTicket() {
        this.$store.commit('setShowTicket', false)
        this.isLogin()
      },
      //判断显示城市的字数
      judgeCityNum() {
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
      judgeCity() {
        if (this.$route.query.routeParams) {
          this.cityName = this.$route.query.routeParams;
        } else {
          this.cityName = "南京";
        }
      },
      //跳到搜索历史页
      jump() {
        this.$router.push({path: '/home/searchHistory', query: {jumps: 'home'}});
      },
      // 轮播图获取
      getBanner() {
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
      getHotButton() {
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
      getNews() {
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/acInformationByCataId',
          params: {},
        }).then(function (response) {
          self.news = response.data.data
          self.loadingFlag += 1
        })
      },
      // 获取活动
      getCtivity() {
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
      goToCitySearch: function () {
        this.$router.push({
          name: '城市搜索',
          query: {
            routeParams: 1
          }
        });
      },
      // 切换动画hack
      animateHack() {
        let self = this
        setTimeout(function () {
          self.positionFixed = true
        }, 0)
      },
      upCallback: function (page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function (curPageData) {
          self.$refs.recommend.more(curPageData, page.num, page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum, pageSize, successCallback, errorCallback) {
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
          url: self.$apiGoods + 'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback && successCallback(response.data.data);//成功回调
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
            url: window.location.href.split('#')[0]
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: response.data.data.appId, // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: response.data.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: response.data.data.nonceStr, // 必填，生成签名的随机串
            signature: response.data.data.signature,// 必填，签名，见附录1
            jsApiList: ['scanQRCode', 'onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        })
      },
      searchCode() {
        let self = this
        let _this = this
        wx.scanQRCode({
          desc: 'scanQRCode desc',
          needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            /*alert(res.resultStr)
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
                _this.$message.success('扫码成功')
              }
            })*/
          },
          error: function (res) {
            if (res.errMsg.indexOf('function_not_exist') > 0) {
              alert('版本过低请升级')
            }
          }
        })
      },
      goSearch() {
        this.$router.push('/search')
      },
      goActivity(index) {
        switch (this.banner[index].ac_inlink_type) {
          // 跳三级
          case '145':
            this.$router.push({
              path: '/home/sports',
              query: {parentType: '363', actId: this.banner[index].ac_id, title: this.banner[index].ac_title}
            });
            break;
          // 跳二级
          case '144':
            this.$router.push({
              path: '/home/largeCollection',
              query: {parentType: '363', actId: this.banner[index].ac_id, title: this.banner[index].ac_title}
            });
            break;
          // 外部
          case '143':
            window.location.href = this.banner[index].ac_outlink;
            break;
          // 店铺
          case '142':
            this.$router.push({path: '/goodsDetailed', query: {id: this.banner[index].ac_inlink}});
            break;
          // 商品
          case '141':
            this.$router.push({path: '/goodsDetailed', query: {id: this.banner[index].ac_inlink}});
            break;
        }
      }
    },
    components: {hotButton, lNews, wActivity, recommend}
  }
</script>

<style scoped>
  /*顶部搜索--开始*/
  .topLeft {
    width: 1.8rem;
  }

  .topLeft img {
    width: .4rem;
    vertical-align: middle;
    margin-left: .1rem;
  }

  .topLeft .city {
    width: 1rem;
    display: inline-block;
    vertical-align: middle;
    font-weight: 400;
    color: #fff;
    margin-left: .2rem;
    word-break: break-all;
  }

  .topCenter {
    position: relative;
  }

  /*搜索框样式--开始*/
  .searchInput {
    width: 6.5rem;
    height: .7rem;
    background-color: rgba(238, 238, 238,0.7);
    border-radius: .9rem;
    line-height: .7rem;
    transition: background-color .5s;
  }
  .opaque {
    background-color: rgba(238, 238, 238, 1);
  }
  .searchInput img.leftImg {
    width: .45rem;
    vertical-align: middle;
    margin-left: .3rem;
  }

  .searchInput img.rightImg {
    width: .45rem;
    vertical-align: middle;
    margin-left: .2rem;
  }

  .searchInput input {
    width: 70%;
    border: 0;
    outline: none;
    font-size: .3rem;
    margin-left: .2rem;
    background: none;
  }

  /*搜索框样式--结束*/
  .topRight {
    margin-right: .1rem;
  }

  .topRight img {
    width: .7rem;
    vertical-align: middle;
  }

  /*顶部搜索--结束*/

  #homeMescroll {
    top: 0;
    bottom: 0;
    height: auto;
  }

  .positionFixed {
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

  .title1, .title2 {
    height: 1rem;
    width: 100%;
  }

  .title1 {
    background: url("../../../assets/img/louceng1.png") no-repeat top left;
    background-size: 100% 100%;
  }

  .title2 {
    background: url("../../../assets/img/louceng2.png") no-repeat top left;
    background-size: 100% 100%;
  }

  .line {
    height: 1px;
    width: 3rem;
    background: #999;
  }

  .title p {
    position: absolute;
    background: #f2f2f2;
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
    /*height: 1.5rem;*/
  }

  @keyframes opacity-fade {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }

  /* banner与底部扇形 */
  .banner {
    height: 4.2rem;
    overflow: hidden;
  }

  .shanxing {
    width: 0;
    height: 0;
    border-radius: 5rem;
    border-width: 5rem;
    border-style: solid;
    border-color: white transparent transparent transparent;
    overflow: hidden;
    cursor: pointer;
    margin: auto;
    transform: scale(4, 2);
    position: relative;
    top: calc(100% + 15px);
  }

  .adWrapper {
    position: fixed;
    top: 9.5rem;
    right: -0.2rem;
    z-index: 888;
  }

  .adWrapper img {
    width: 2rem;
    pointer-events: none;
  }

  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, .5);
    z-index: 888;
  }

  .adWrapper2 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }

  .adWrap {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8rem;
    z-index: 889;
  }

  .cancelBtn {
    height: 1.12rem;
    background: url("../../../assets/img/ad5.png") no-repeat top right;
    background-size: .67rem 100%;
  }

  .adContent {
    background: #ffa619;
    color: #964b00;
    padding-bottom: .5rem;
  }

  .adTitle {
    font-size: .8rem;
    font-weight: bold;
    text-align: center;
    padding-top: .2rem;
  }

  .ticketWrapper {
    padding: 0 .6rem;
    position: relative;
  }

  .ticket {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    height: 2.4rem;
    border-radius: .3rem;
    margin-top: .6rem;
    position: relative;
    box-shadow: 1px 1px 5px rgba(150, 75, 0, .5);
  }

  .ticket:before, .ticket:after {
    content: '';
    width: .53rem;
    height: .53rem;
    display: block;
    background: #ffa619;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .ticket:before {
    top: -.26rem;
  }

  .ticket:after {
    bottom: -.26rem;
  }

  .ticket .left {
    flex: 1;
    font-weight: bold;
    font-size: .88rem;
    margin-left: .4rem;
  }

  .left .small {
    font-size: .58rem;
  }

  .ticket .right {
    flex: 1;
    text-align: right;
    margin-right: .26rem;
  }

  .right .dec1 {
    font-size: .48rem;
    font-weight: 400;
  }

  .right .dec2 {
    font-size: .29rem;
    margin-top: .1rem;
  }

  .rightBtn {
    color: #fff;
    background: linear-gradient(#ff6985, #ff2b7d);
    width: 3.25rem;
    height: 1rem;
    margin: .8rem auto 0;
    text-align: center;
    line-height: 1rem;
    font-size: .4rem;
    border-radius: .5rem;
  }
</style>
