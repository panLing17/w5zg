<template lang="pug">
  div
    .homeHeader(:class="{active: homeHeaderActive}")
      .homeHeaderLeft(@click="$router.push('/page')")
        img.headerImg(src="../../../assets/img/fenlei1.png", v-show="!homeHeaderActive", @click.prevent="")
        .activeHeaderLeft(v-show="homeHeaderActive")
          img.fenleiImg(src="../../../assets/img/fenlei@2x.png", @click.prevent="")
      .homeHeaderCenter(@click="$router.push('/search')")
        input.headerSearchInput(type="text", placeholder="请输入商品类别 例如: 男装")
        img.searchImg(src="../../../assets/img/ic_home_search@2x.png", @click.prevent="")
        <!--span.searchDesc 请输入商品类别 例如: 男装-->
      .homeHeaderRight(@click="$router.push({path:'/inform',query:{num:0}})")
        .infoCount(v-show="informNum>0") {{informNum.toString().length>2?'99':informNum}}
        img.headerImg(src="../../../assets/img/xiaoxi1.png", v-show="!homeHeaderActive", @click.prevent="")
        .activeHeaderRight(v-show="homeHeaderActive")
          img.xiaoxiImg(src="../../../assets/img/xiaoxi@2x.png", @click.prevent="")
    div.homeBox.mescroll#homeMescroll(:class="{positionFixed:positionFixed}", v-loading="loadingFlag<4")
      .banner(v-if="banner && banner.length")
        <!--carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:4.2rem")-->
          <!--div(v-for="(tag, index) in banner", style="width:100%" , @click.prevent="goActivity(index)")-->
            <!--img(:src="tag.ac_phone_image | img-filter" , style="width:100%;height:4.2rem", @click.prevent="")-->
        slider
          div(v-for="(item, index) in banner")
            a(@click.prevent="goActivity(item)")
              img.needsclick(:src="item.ac_phone_image | img-filter", @click.prevent="")
        //.shanxing
      .firstFloorADList(v-if="firstFloor && firstFloor.length", @click="goActivity(firstFloor[0])")
        img(:src="firstFloor[0].ac_phone_image | img-filter", @click.prevent="")
      hot-button(:list="hotButton")
      l-news.news(:newsData="news")
      <!--.tradingArea(@click="$router.push('/searchTradingArea')")-->
        <!--img.areaImg(src="../../../assets/img/trading.png")-->
      <!--.member(@click="showAnimate")-->
        <!--img.memberImg(src="../../../assets/img/menber.png")-->
      //.title1
      w-activity(:listData="activityGoods")
      //.title2
      .secondFloor(v-if="secondFloor && secondFloor.length")
        slider
          div(v-for="(item, index) in secondFloor")
            a(@click.prevent="goActivity(item)")
              img.needsclick(:src="item.ac_phone_image | img-filter", @click.prevent="")
      goods-list(:data="goodsList")
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
    .animateWrapper(v-if="animateShow", @click="animateShow=false")
      .animate
        span(:class="{play:animateShow}") 敬
        span(:class="{play:animateShow}") 请
        span(:class="{play:animateShow}") 期
        span(:class="{play:animateShow}") 待
    //home-guide
</template>
<script>
  import hotButton from './hotButton'
  import lNews from './news'
  import wActivity from './activities'
  import recommend from './recommend'
  import homeGuide from './homeGuide'
  import {mapState} from 'vuex'
  import store from '../../../vuex/store'
  import shareImg from '../../../assets/img/applogo@2x.png'
  import Slider from 'components/slider'
  import GoodsList from './goodsList/goodsList'

  export default {
    name: 'home',
    data() {
      return {
        // 整页的固定定位，如果一直有的话会影响页面切换效果
        positionFixed: false,
        // mescroll: null,
        // 顶部背景色
        navBarBg: 'rgba(255,255,255,1)',
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
        type: '',
        animateShow: false,
        homeHeaderActive: false,
        goodsList: [],
        firstFloor: [],
        secondFloor: [],
        informNum: 0
      }
    },
    components: {hotButton, lNews, wActivity, recommend, homeGuide, Slider, GoodsList},
    computed: {
      ...mapState(['showTicket', 'userData', 'ticketMoney', 'position', 'showRegisterTicket', 'recommendAdvert'])
    },
    created() {
      this.adSub = 0
    },
    activated () {
      // 首页分享
      // this.loadShare()
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0);
        }
      })
      this.informNumCheck()
    },
    beforeRouteLeave (to, from, next) {
      this.mescroll.hideTopBtn();
      next()
    },
    beforeRouteEnter (to, from , next) {
      to.meta.keepAlive = false
      next();
    },
    mounted() {
      document.title = '万物直供'
      this.$mescrollInt("homeMescroll", this.upCallback, () => {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0);
          }
        })
      }, (obj) => {
        if (obj.preScrollY>60) {
          this.homeHeaderActive = true
        } else {
          this.homeHeaderActive = false
        }


        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })

      // 获取所有活动
      this.getAllActivity()
      // 获取banner
      // this.getBanner()
      // 获取新闻
      // this.getNews()
      // 获取活动
      // this.getCtivity()
      // 获取分类
      // this.getHotButton()
      // 动画hack
      this.animateHack()
      //判断显示当前的城市
      this.judgeCity()
      //判断显示城市的字数
      //this.judgeCityNum()
      // 首页分享
      // this.loadShare()
      this.informNumCheck()
    },
    beforeDestroy() {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    methods: {
      //获取消息条数
      informNumCheck(){
        if (localStorage.getItem('token')) {
          let self = this
          self.$ajax({
            method: 'post',
            url: self.$apiMember + '/ucMessage/queryMemberMessageNum',
            params: {}
          }).then(function (res) {
            self.informNum = res.data.data.messageNum
          })
        }
      },
      //一次性获取所有活动数据
      getAllActivity () {
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/queryIndexData',
          params: {},
        }).then(function (response) {
          self.banner = response.data.data.bannerList
          self.news = response.data.data.headlineList
          self.activityGoods = response.data.data.fourActList
          self.hotButton = response.data.data.tenActList
          self.firstFloor = response.data.data.firstFloorADList
          self.secondFloor = response.data.data.secondFloorAdList
          self.loadingFlag = 4
        })
      },
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll( isLock );
      },
      showAnimate () {
        this.animateShow = true;
        let _this = this
        setTimeout(()=> {
          this.animateShow = false
        },1500);
      },
      loadShare () {
        this.$initShare({
          sharePhoto: window.location.href.split('/#')[0] + shareImg.split('/w5mall-web/')[1],
          shareTitle: '万物直供商城正品保障',
          shareDesc: '万物直供商城价格优惠，正品保障，支持专柜提货，快来买买买'
        })
      },
      closeTicket() {
        this.$store.commit('setShowTicket', false)
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
          // self.$refs.recommend.more(curPageData, page.num, page.size)
          self.goodsList = self.goodsList.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)

          if (page.num%2===1) {
            setTimeout(() =>{
              self.$advert(self.recommendAdvert.advert[self.adSub%self.recommendAdvert.advert.length])
            }, 20)
          }

          if (page.num%2===0) {
            setTimeout(() =>{
              self.$adTag(self.recommendAdvert.tags[self.adSub%self.recommendAdvert.tags.length].data)
              self.adSub++
            }, 20)
          }


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

          },
          noConfirm: () => {

          }
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

            }
          }
        })
      },
      goSearch() {
        this.$router.push('/search')
      },
      goActivity(item) {
        // 外链解析
        let f = ''
        if (item.ac_outlink && item.ac_outlink.split('?').length===1) {
          f = '?'
        }else {
          f = '&'
        }
        switch (item.ac_inlink_type) {
          // 跳三级
          case '145':
            if (item.sh_id) {
              this.$router.push({
                path: '/home/sports',
                query: {parentType: '363', actId: item.ac_id, title: item.ac_title, shId: item.sh_id}
              });
            } else {
              this.$router.push({
                path: '/home/sports',
                query: {parentType: '363', actId: item.ac_id, title: item.ac_title}
              });
            }

            break;
          // 跳二级
          case '144':
            if (item.sh_id) {
              this.$router.push({
                path: '/home/largeCollection',
                query: {parentType: '363', actId: item.ac_id, title: item.ac_title, shId: item.sh_id}
              });
            } else {
              this.$router.push({
                path: '/home/largeCollection',
                query: {parentType: '363', actId: item.ac_id, title: item.ac_title}
              });
            }

            break;
          // 外部
          case '143':
            if (item.sh_id) {
              window.location.href = item.ac_outlink + f + 'shId=' + item.sh_id;
            } else {
              window.location.href = item.ac_outlink
            }
            break;
          // 店铺
          case '142':
            this.$router.push({path: '/goodsDetailed', query: {id: item.ac_inlink}});
            break;
          // 商品
          case '141':
            this.$router.push({path: '/goodsDetailed', query: {id: item.ac_inlink}});
            break;
          // 跳二级模板2
          case '148':
            if (item.sh_id) {
              this.$router.push({path: '/twoLevel', query: {parentType: '363', actId: item.ac_id, title: item.ac_title, shId: item.sh_id}})
            } else {
              this.$router.push({path: '/twoLevel', query: {parentType: '363', actId: item.ac_id, title: item.ac_title}})
            }
            break;
          // 跳3级页面模板2
          case '149':
            if (item.sh_id) {
              this.$router.push({ path: '/activity', query: { actId: item.ac_id, title: item.ac_title, parentType: '363', shId: item.sh_id}});
            } else {
              this.$router.push({ path: '/activity', query: { actId: item.ac_id, title: item.ac_title, parentType: '363'}});
            }
            break;
        }
      }
    }
  }
</script>

<style scoped>
  .infoCount {
    width: .426rem;
    height: .32rem;
    background: #f70057;
    border-radius: .16rem;
    overflow: hidden;
    position: absolute;
    right: 0;
    text-align: center;
    color: #fff;
    font-size: .24rem;
  }
  .homeHeader {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    height: 1.2rem;
    overflow: hidden;
    /*background: #fff;*/
    width: 100%;
    padding: .2rem .26rem 0;
  }
  .homeHeader.active {
    background: #fff;
    box-shadow: 0 3px 10px -5px #5E5E5E;
    /*padding: 0 .53rem;*/
  }
  .headerImg {
    width: 1rem;
  }
  .homeHeaderLeft, .homeHeaderRight {
    font-size: 0;
    height: 1rem;
    width: 1rem;
    text-align: center;
  }
  .homeHeaderRight {
    position: relative;
  }
  .activeHeaderLeft:after {
    content: '分类';
  }
  .activeHeaderRight:after {
    content: '消息';
  }
  .activeHeaderLeft:after, .activeHeaderRight:after {
    display: block;
    text-align: center;
    font-size: 10px;
    color: #666;
    line-height: 1;
    margin-top: .05rem;
  }
  .fenleiImg, .xiaoxiImg {
    width: .58rem;
    pointer-events: none;
  }

  .homeHeaderCenter {
    margin: 0 .4rem;
    flex: 1;
    height: .8rem;
    border-radius: .4rem;
    border: 1px solid rgb(236,236,236);
    position: relative;
    overflow: hidden;
  }
  input::-webkit-input-placeholder{
    color:rgb(119,119,119);
  }
  .headerSearchInput {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    padding-left: .82rem;
    font-size: 11px;
  }
  .searchImg {
    position: absolute;
    top: 50%;
    left: .26rem;
    transform: translateY(-50%);
    width: .42rem;
    pointer-events: none;
  }
  .searchDesc {
    margin-left: .82rem;
    line-height: .77rem;
    font-size: 11px;
    color: rgb(119,119,119);
  }

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
    display: flex;
    align-items: center;
  }
  .topCenter .city{
    font-size: .3rem;
    font-weight: 500;
    margin-left: .2rem;
    color: #999;
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
    /*padding-top: 1.3rem;*/
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
    background: url("../../../assets/img/louceng2.png") no-repeat center;
    background-size: 50% 75%;
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
    max-height: 4rem;
    overflow: hidden;
    position: relative;
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
    z-index: 101;
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
  .areaImg, .memberImg {
    width: 100%;
    padding: 0 .4rem;
    pointer-events: none;
  }
  .tradingArea, .member {
    margin-top: .2rem;
    margin-bottom: .2rem;
    font-size: 0;
  }
  .firstFloorADList {
    font-size: 0;
    max-height: 2.4rem;
    overflow: hidden;
  }
  .firstFloorADList img {
    width: 100%;
  }
  .secondFloor {
    max-height: 2.4rem;
    overflow: hidden;
    position: relative;
    margin: 0.13rem 0;
  }


  .animateWrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255,255,255,.5);
  }
  .animate {
    font-size: 50px;
    margin: 6rem auto 0;
    text-align: center;
  }

  .animate span {
    display: inline-block;
    color: rgb(0,60,137);
    opacity: 0;
    transform: translate(-150px, -50px) rotate(-180deg) scale(3);
  }
  .animate span.play {
    animation: revolveScale .4s forwards;
  }
  .animate span:nth-of-type(2) {
    animation-delay: .05s;
  }

  .animate span:nth-of-type(3) {
    animation-delay: .1s;
  }

  .animate span:nth-of-type(4) {
    animation-delay: .15s;
  }
  @keyframes revolveScale {
    60% {
      transform: translate(20px, 20px) rotate(30deg) scale(.3);
    }
    100% {
      transform: translate(0) rotate(0) scale(1);
      opacity: 1;
    }
  }

</style>
