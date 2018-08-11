<template lang="pug">
  .wrapTop
    div.myBox.mescroll#myMescroll(:class="{positionFixed: positionFixed}")
      .head#header
        .toper
          .lefter
          .center(v-if="false")
          .righter
            img(src="../../../assets/img/message@2x.png", v-if="false")
            img(src="../../../assets/img/my_account@2x.png", @click="$router.push('/my/accountB')", v-if="userData.member_type === '092'")
            <!--img(src="../../../assets/img/consumerdetails@2x.png", @click="$router.push('/my/accountC')", v-else)-->
            .wrapSet(v-if="false")
              img(src="../../../assets/img/my_set@2x.png", @click="routergoSet()")
            .wrapXiao(@click="$router.push({path:'/inform',query:{num:0}})")
              .badge2(v-if="informNum!==0", :class="{top: informNum.toString().length>3}") {{informNum.toString().length>3?'999':informNum}}
              img(src="../../../assets/img/xiaoxi2@2x.png", style="width:.58rem;height:.58rem")
        p.center
          ul.headPic
            li(@click="$router.push('/my/settings')")
              img(:src="userData.mi_head_sculpture | img-filter")
          ul.userName
            li(@click="$router.push('/my/settings')") {{userData.mi_nickname? userData.mi_nickname: '万物直供'}}
          ul.balance(v-if="userData.member_type === '092'")
            li 余额:
            li {{accoutBalance}}
            li 元
        <!--.upgradeMembers(@click="jingqingqidai()" v-if="userData.member_type !== '092'")-->
          <!--img(src="../../../assets/img/upgrade1@2x.png" v-if="imgFlag")-->
          <!--img(src="../../../assets/img/upgrade2@2x.png" v-else="imgFlag")-->
      div.fav_att_foot(v-if="false")
        ul.left(@click="$router.push('/reservations')")
          li 0
          li 预约体验
        ul.center
          li 0
          li 关注店铺
        ul.right(@click="$router.push('/my/footMark')")
          li {{footmarkNum}}
          li 足迹
      .wrapMyOrderForm.wrapDiv
        div.myOrderForm
          ul.top(@click.prevent="$router.push('/my/orderManage')")
            li 我的订单
            li(style="color:rgb(151,151,151);font-weight:400;") 全部订单 ＞
          ul.bottom
            li(@click="$router.push({path:'/my/orderManage',query:{id:1}})")
              .badge(v-if="orderCount.unPayOrder && orderCount.unPayOrder!==0", :class="{top:orderCount.unPayOrder.toString().length>3}") {{orderCount.unPayOrder.toString().length>3?'999':orderCount.unPayOrder}}
              img(src="../../../assets/img/my_obligation@2x.png")
              .character 待付款
            li(@click="$router.push({path:'/my/orderManage',query:{id:2}})")
              .badge(v-if="orderCount.unSendOrder && orderCount.unSendOrder!==0", :class="{top:orderCount.unSendOrder.toString().length>3}") {{orderCount.unSendOrder.toString().length>3?'999':orderCount.unSendOrder}}
              img(src="../../../assets/img/my_readyfordelivery@2x.png")
              .character 待发货
            li(@click="$router.push({path:'/my/orderManage',query:{id:3}})")
              .badge(v-if="orderCount.unRecieveOrder && orderCount.unRecieveOrder!==0", :class="{top:orderCount.unRecieveOrder.toString().length>3}") {{orderCount.unRecieveOrder.toString().length>3?'999':orderCount.unRecieveOrder}}
              img(src="../../../assets/img/my_waitforreceiving2@2x.png")
              .character 待收货
            li(@click="$router.push({path:'/my/orderManage',query:{id:4}})")
              img(src="../../../assets/img/my_completed.png")
              .character 已完成
            li(@click.prevent="$router.push('/my/refundAfterSale')")
              img(src="../../../assets/img/my_aftersale2@2x.png")
              .character 退货/售后
      .wrapMyTreasure.wrapDiv
        div.myTreasure
          ul.top
            li 贴心服务
            li
          ul.bottom
            li(@click="$router.push('/reservations')")
              img(src="../../../assets/img/ic_center_yyty@2x.png")
              .words 预约体验
            li(@click="$router.push('/collection')")
              img(src="../../../assets/img/shoucang@2x.png")
              .badge(v-if="collectionNum!==0", :class="{top: collectionNum.toString().length>3}") {{collectionNum.toString().length>3?'999':collectionNum}}
              .words 收藏夹
            li(@click="goNetKingCard")
              img(src="../../../assets/img/my_card@2x.png")
              .badge(v-if="netcardCount!==0", :class="{top: netcardCount.toString().length>3}") {{netcardCount.toString().length>3?'999':netcardCount}}
              .words 现金券
            li(v-if="userData.member_type === '091'", @click="goAllCard")
              img(src="../../../assets/img/my_cashcoupon@2x.png")
              .words 通用劵
            li(@click="goBankCard")
              img(src="../../../assets/img/my_bankcard@2x.png")
              .words 银行卡
          ul.bottom
            li(@click="$router.push('/my/footMark')")
              img(src="../../../assets/img/ic_center_zj@2x.png")
              .badge(v-if="footmarkNum && footmarkNum!==0", :class="{top: footmarkNum.toString().length>3}") {{footmarkNum.toString().length>3?'999':footmarkNum}}
              .words 浏览记录
            li(@click="$router.push({path:'/inform',query:{num:1}})")
              img(src="../../../assets/img/daohuotongzhi@2x.png")
              .badge(v-if="reachGoodsNum && reachGoodsNum!==0", :class="{top: reachGoodsNum.toString().length>3}") {{reachGoodsNum.toString().length>3?'999':reachGoodsNum}}
              .words 到货通知
            li(@click="$router.push('/service')").service
              img(src="../../../assets/img/service2@2x.png")
              .words 客服中心
            li(@click="$router.push('/cProblems')").cProblem
              img(src="../../../assets/img/cProblems.png")
              .words 常见问题
      .title
        img(src="../../../assets/img/recommend.png")
      recommend#dataId(ref="recommend")
      .bottomPlaceholder
    .animateWrapper(v-if="animateShow", @click="animateShow=false")
      .animate
        span(:class="{play:animateShow}") 敬
        span(:class="{play:animateShow}") 请
        span(:class="{play:animateShow}") 期
        span(:class="{play:animateShow}") 待
    //myGuide
</template>

<script>
  import {mapState} from 'vuex'
  import myGuide from './myGuide'
  import recommend from './recommend'
  export default {
    name: 'my',
    data () {
      return {
        reachGoodsNum: 0,
        collectionNum: 0,
        informNum: 0,
        animateShow: '',
        nameShow: '', // 控制上滑时显示的用户名
        footmarkNum: 0,
        accoutBalance: 0,
        name: this.$route.query.routeParams,
        page: 1,
        // 切换动画hack
        positionFixed: false,
        orderCount: {},
        netcardCount: 0,
        loadingFlag: 0,
        imgFlag: true // 控制升级会员图片的显隐
      }
    },
    components: {myGuide, recommend},
    computed: mapState(['userData', 'position']),
    created () {
      this.getOrderCount()
    },
    activated () {
      this.collectionNumCheck()

      this.getUserData()
      this.getFootmarkNum()
      this.getOrderCount()
      this.getNetcardsCount()
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0)
        }
      })
      // 判断页面是否向上滚动
      // window.addEventListener('scroll',this.judgeScroll,true);
      // 改变下拉刷新的样式
      // this.changeStyles();
      this.reachGoodsNumCheck()
      this.informNumCheck()
    },
    beforeRouteLeave (to, from, next) {
      this.mescroll.hideTopBtn()
      next()
    },
    mounted () {
      this.$mescrollInt('myMescroll', this.upCallback, () => {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0)
          }
        })
      }, (obj) => {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })
      this.reachGoodsNumCheck() // 到货通知数量
      this.collectionNumCheck() // 收藏数量
      this.informNumCheck() // 消息通知数量
      this.getUserData()
      this.getFootmarkNum()
      // 切换动画HACK
      this.animateHack()
      // 判断页面是否向上滚动
      // window.addEventListener('scroll',this.judgeScroll,true);
      // 改变下拉刷新的样式
      // this.changeStyles();
      // 控制升级会员图片的切换
      this.picShow()
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
      // window.removeEventListener('scroll', this.judgeScroll);
    },
    methods: {
      // 获取收藏夹的收藏商品数量
      collectionNumCheck(){
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'gcFavoritesInfo/queryFavoriteNum',
          params: {
          }
        }).then(function (res) {
          console.log(res.data.data)
          self.collectionNum = res.data.data
        })
      },
      // 查询用户消息条数
      informNumCheck(){
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + '/ucMessage/queryMemberMessageNum',
          params: {
          }
        }).then(function (res) {
          console.log(res.data.data.messageNum)
          self.informNum = res.data.data.messageNum
        })
      },
      // 查询到货通知消息条数
      reachGoodsNumCheck(){
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + '/ucMessage/queryMemberMessageNum',
          params: {
            msType: 802
          }
        }).then(function (res) {
          console.log(res.data.data.messageNum)
          self.reachGoodsNum = res.data.data.messageNum
        })
      },
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll(isLock)
      },
      // 敬请期待
      jingqingqidai () {
        this.animateShow = true
        let self = this
        setTimeout(function () {
          self.animateShow = false
        }, 1200)
      },
      // 控制升级会员图片的切换
      picShow () {
        let self = this
        setInterval(function () {
          self.imgFlag = !self.imgFlag
        }, 500)
      },
      // 改变下拉刷新的样式
      changeStyles () {
        let downwarp = document.getElementsByClassName('mescroll-downwarp')[0]
        downwarp.style.backgroundColor = 'rgb(244,0,87)'
        downwarp.children[0].children[0].style.borderColor = '#fff'
        downwarp.children[0].children[0].style.borderBottomColor = 'transparent'
        downwarp.children[0].children[1].style.color = '#fff'
      },
      // 判断页面是否向上滚动
      // judgeScroll () {
      //   if (this.mescroll.getScrollTop() > 0) {
      //     this.nameShow = true
      //   } else {
      //     this.nameShow = false
      //   }
      // },
      // 获取订单各状态数量
      getOrderCount () {
        let _this = this
        this.$ajax({
          method: 'get',
          url: this.$apiTransaction + 'order/countByOrderStatus',
          params: {}
        }).then(function (response) {
          if (response.data.code === '081') {
            _this.orderCount = response.data.data
          } else {
            _this.$message.error(response.data.msg)
          }
        })
      },
      // 小c获取现金券未使用数量
      getNetcardsCount () {
        if (localStorage.getItem('member_type') === '091') {
          let _this = this
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'netcard/netcards',
            params: {status: 1}
          }).then(function (response) {
            if (response.data.code === '081') {
              _this.netcardCount = response.data.data.length
            }
          })
        }
      },
      /* 切换动画修复 */
      animateHack () {
        setTimeout(() => {
          this.positionFixed = true
        }, 500)
      },
      /* 获取用户信息 */
      getUserData: function () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          self.$store.commit('userDataChange', response.data.data)
          localStorage.setItem('member_type', response.data.data.member_type)
          if (response.data.data.member_type === '092') {
            self.getUserInfo()
          }
          if (response.data.data.member_type === '091') {
            self.getNetcardsCount()
            if (response.data.data.reg_present === '11') {
              self.$store.commit('setShowRegisterTicket', false)
            } else {
              self.$store.commit('setShowRegisterTicket', true)
            }
          } else {
            self.$store.commit('setShowRegisterTicket', false)
          }
        })
      },
      getUserInfo: function () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/info',
          params: {}
        }).then(function (response) {
          self.accoutBalance = response.data.data.accoutBalance
        })
      },
      getFootmarkNum: function () {
        let self = this
        // 发送ajax请求校验手机号重复
        self.$ajax({
          method: 'POST',
          url: self.$apiGoods + 'logGoodsBrowse/count',
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.footmarkNum = response.data.data
          }
        })
      },
      routergoSet: function () {
        this.$router.push({name: '我的设置', query: {routeParams: this.name}})
      },
      upCallback: function (page) {
        let self = this
        this.getListDataFromNet(page.num, page.size, function (curPageData) {
          self.$refs.recommend.more(curPageData, page.num, page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      },
      getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
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
          successCallback && successCallback(response.data.data) // 成功回调
        })
      },
      // 前往银行卡
      goBankCard () {
        this.$router.push('/my/chooseBankCard')
      },
      // 前往现金券
      goNetKingCard () {
        // 前往小B端
        if (this.$store.state.userData.member_type === '092') {
          this.$router.push('/my/accountCashB')
        }
        // 前往小C端
        if (this.$store.state.userData.member_type === '091') {
          this.$router.push('/my/accountCardC')
        }
      },
      // 前往通用券
      goAllCard () {
        // 前往小B端
        if (this.$store.state.userData.member_type === '092') {
          this.$router.push('/my/chooseBankCard')
        }
        // 前往小C端
        if (this.$store.state.userData.member_type === '091') {
          this.$router.push('/my/accountUniversalC')
        }
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  #myMescroll{
    position: fixed;
    top: 0;
    bottom: 0;
    height: "calc(100vh - %s)" % $height-footer;
  }
  .myBox {
    /*min-height: calc(100vh - 1.6rem);*/
    width: 100%;
    background-color: #f2f2f2;
  }
  /*头部--开始*/
  .head{
    width: 100%;
    height: 4.5rem;
    background: url("../../../assets/img/top_bg@2x.png") no-repeat;
    background-size: 100% 100%;
    /*overflow: hidden;*/
    position: relative;
  }
  .toper{
    width: 100%;
    padding: .3rem .3rem .2rem;
    display: flex;
    justify-content: space-between;
  }
  .toper .lefter img{
    width: .7rem;
  }
  .toper .center{
    color: #fff;
    font-size: .4rem;
    line-height: .8rem;
  }
  .toper .righter{
    display: flex;
    align-items: center;
  }
  .toper .righter img{
    width: .58rem;
    height: .58rem;
    vertical-align: top;
  }
  .toper .righter img:last-child{
    margin-left: .37rem;
  }
  .head .center{
    margin-top: .3rem;
    display: flex;
    position: relative;
  }
  .head .center .headPic{
    width: 2rem;
    height: 2rem;
    margin-left: .3rem;
    /*margin-top: .4rem;*/
    border-radius: 50%;
    text-align: center;
    line-height: 1.6rem;
    background: url('../../../assets/img/headshot@2x.png') no-repeat;
    background-size: 100%;
  }
  .head .center .headPic li{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    overflow: hidden;
  }
  .head .center .headPic img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  .head .center .userName{
    display: flex;
    /*margin-top: .4rem;*/
    margin-left: .3rem;
  }
  .head .center .userName li{
    align-self: center;
    color: #fff;
    font-size: .45rem;
  }
  .head .center .balance{
    display: flex;
    /*width: 4rem;*/
    height: .8rem;
    background-color: rgba(255,255,255,0.4);
    text-align: center;
    border-top-left-radius: .4rem;
    border-bottom-left-radius: .4rem;
    position: absolute;
    right: 0;
    bottom: -.8rem;
  }
  .head .center .balance li{
    line-height: .8rem;
    margin-left: .3rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .head .center .balance li:nth-child(1){
    margin-left: .4rem;
  }
  .upgradeMembers{
    /*width: 4rem;*/
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .upgradeMembers img{
    width: 3.5rem;
    vertical-align: top;
  }
  /*头部--结束*/
  /*收藏夹，关注店铺，足迹--开始*/
  .fav_att_foot{
    display: flex;
    justify-content: space-around;
    padding-top: .3rem;
    padding-bottom: .2rem;
    background-color: #fff;
  }
  .fav_att_foot ul{
    text-align: center;
  }
  .fav_att_foot ul li{
    font-size: .4rem;
    color: rgb(51,51,51);
    line-height: .8rem;
  }
  /*收藏夹，关注店铺，足迹--结束*/
  /*我的订单和我的财富--开始*/
  .wrapDiv{
    padding-bottom: .2rem;
    background-color: rgb(242,242,242);
  }
  .wrapMyTreasure{
    padding-bottom: 0;
  }
	.myOrderForm,
	.myTreasure{
		background-color: #fff;
		padding: .2rem 0 .4rem;
	}
	.myOrderForm ul.top,
	.myTreasure ul.top{
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #f2f2f2;
		padding: 0 .4rem .2rem;
	}
	.myOrderForm ul.top li,
	.myTreasure ul.top li{
		font-size: .4rem;
	}
  .myOrderForm ul.top li:nth-child(2){
    padding-top: .08rem;
    font-size: .3rem;
  }
	.myOrderForm ul.bottom{
		display: flex;
		justify-content: space-between;
		padding: .4rem .5rem 0;
    text-align: center;
	}
  .myOrderForm ul.bottom li{
    position: relative;
    flex: none;
    font-size: 0;
  }

  .myOrderForm ul.bottom li img{
    width: .9rem;
  }

  .myOrderForm ul.bottom li .character{
    margin-top: .053rem;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .32rem;
    line-height: .45rem;
  }
	/*我的订单和我的财富--结束*/
	/*我的财富独有的样式--开始*/
  /*.myTreasure ul.bottom:after{*/
    /*content: "";*/
    /*display: block;*/
    /*clear: both;*/
  /*}*/
	.myTreasure ul.bottom{
		padding: .4rem .4rem 0;
    display: flex;
    justify-content: flex-start;
	}
  .myTreasure ul.bottom:nth-child(3){
    padding: .4rem .4rem 0;
    display: flex;
    justify-content: flex-start;
  }
  .myTreasure ul.bottom:nth-child(3) li{
    margin-right: .73rem;
  }
  .myTreasure ul.bottom:nth-child(3) li:nth-child(2){
    margin-right: .6rem;
  }
  .myTreasure ul.bottom li{
    margin-right: .9rem;
  }
  .myTreasure ul.bottom li:nth-child(5){
    margin-right: 0;
  }
  .myTreasure ul.bottom li.service{
    margin-right: .57rem;
  }
  .myTreasure ul.bottom li.cProblem{

  }
	.myTreasure ul.bottom li img{
		width: .96rem;
	}
  .myTreasure ul.bottom li .words{
    margin-top: .13rem;
    color: rgb(51,51,51);
    font-size: .32rem;
    line-height: .45rem;
  }
	/*我的财富独有的样式--结束*/
  .bottomPlaceholder {
    /*height: 1.5rem;*/
  }

  .positionFixed{
    position: fixed;
  }
  /*推荐*/
  .title{
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
    padding: .37rem 0;
  }
  .title img{
    width: 4.18rem;
    height: .58rem;
  }
  .badge {
    padding: 0 .1rem;
    border-radius: .4rem;
    background: rgb(246,0,87);
    color: #fff;
    font-size: .25rem;
    position: absolute;
    right: -.05rem;
    top: 0;
    line-height: .37rem;
  }
  .badge.top {
    width: .8rem;
    overflow: hidden;
    padding: 0 .1rem 0 0;
  }
  .badge.top:after {
    content: '+';
    position: absolute;
    right: .1rem;
    top: -.105rem;
    color: #fff;
  }

  .myTreasure ul.bottom li {
    position: relative;
    flex: none;
    text-align: center;
  }
  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    opacity: 0;
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
  .wrapXiao{
    position: relative;
  }
  .badge2 {
    padding: 0 .1rem;
    border-radius: .4rem;
    background: #fff;
    color: rgb(246,0,87);
    font-size: .25rem;
    position: absolute;
    right: -.05rem;
    top: -.15rem;
    line-height: .37rem;
  }
  .badge2.top {
    width: .8rem;
    overflow: hidden;
    padding: 0 .1rem 0 0;
  }
  .badge2.top:after {
    content: '+';
    position: absolute;
    right: .1rem;
    top: -.105rem;
    color: #fff;
  }
</style>
