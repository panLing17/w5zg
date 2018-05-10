<template lang="pug">
  .wrapTop
    .toper
      .lefter
        img(src="../../../assets/img/my_set@2x.png" @click="routergoSet()")
      transition(name="slide-fade")  
        .center(v-if="nameShow") Fernando Torres 
      .righter
        img(src="../../../assets/img/message@2x.png", v-if="false")
        img(src="../../../assets/img/my_account@2x.png", @click="$router.push('/my/accountB')", v-if="userData.member_type === '092'")
        img(src="../../../assets/img/consumerdetails@2x.png", @click="$router.push('/my/accountC')", v-else)
    div.myBox.mescroll#myMescroll(:class="{positionFixed: positionFixed}")
      .head#header
        p.center
            ul.headPic
              li(@click="$router.push('/my/settings')")
                img(:src="userData.mi_head_sculpture | img-filter")
            ul.userName
              li {{userData.mi_nickname}}
            ul.balance(v-if="userData.member_type === '092'")
              li 余额:
              li {{accoutBalance}}
              li 元
      div.fav_att_foot
        ul.left
          li 0
          li 收藏夹
        ul.center
          li 0
          li 关注店铺
        ul.right(@click="$router.push('/my/footMark')")
          li {{footmarkNum}}
          li 足迹
      .wrapMyOrderForm.wrapDiv    
        div.myOrderForm
          ul.top(@click="$router.push('/my/orderManage')")
            li 我的订单
            li(style="color:rgb(151,151,151);font-weight:400;") 查看更多 ＞
          ul.bottom
            li(@click="$router.push({path:'/my/orderManage',query:{id:1}})")
              .badge(v-if="orderCount.unPayOrder && orderCount.unPayOrder!==0", :style="{'text-align':orderCount.unPayOrder>99?'left':'center'}") {{orderCount.unPayOrder}}
                i(v-if="orderCount.unPayOrder>99") +
              img(src="../../../assets/img/my_obligation@2x.png")
              .character 待付款
            li(@click="$router.push({path:'/my/orderManage',query:{id:2}})")
              .badge(v-if="orderCount.unSendOrder && orderCount.unSendOrder!==0", :style="{'text-align':orderCount.unSendOrder>99?'left':'center'}") {{orderCount.unSendOrder}}
                i(v-if="orderCount.unSendOrder>99") +
              img(src="../../../assets/img/my_readyfordelivery@2x.png")
              .character 待发货
            li(@click="$router.push({path:'/my/orderManage',query:{id:3}})")
              .badge(v-if="orderCount.unRecieveOrder && orderCount.unRecieveOrder!==0", :style="{'text-align':orderCount.unRecieveOrder>99?'left':'center'}") {{orderCount.unRecieveOrder}}
                i(v-if="orderCount.unRecieveOrder>99") +
              img(src="../../../assets/img/my_waitforreceiving2@2x.png")
              .character 待收货
            li(@click="$router.push({path:'/my/orderManage',query:{id:4}})")
              img(src="../../../assets/img/my_completed.png")
              .character 已完成
            li(@click="$router.push('/my/refundAfterSale')")
              img(src="../../../assets/img/my_aftersale2@2x.png")
              .character 退货/售后
      .wrapMyTreasure.wrapDiv        
        div.myTreasure
          ul.top
            li 我的财富
            li
          ul.bottom
            li(@click="goBankCard")
              img(src="../../../assets/img/my_bankcard@2x.png")
              .words 银行卡
            li(@click="goNetKingCard")
              img(src="../../../assets/img/my_card@2x.png")
              .badge(v-if="netcardCount!==0", :style="{'text-align':netcardCount>99?'left':'center'}") {{netcardCount}}
                i(v-if="orderCount.unSendOrder>99") +
              .words 现金券
            li(v-if="userData.member_type === '091'", @click="goAllCard")
              img(src="../../../assets/img/my_cashcoupon@2x.png")
              .words 通用劵
      .title
        img(src="../../../assets/img/recommend.png")
      w-recommend#dataId(:listData="recommendGoods")
      .bottomPlaceholder
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "my",
    data() {
      return{
        nameShow:"", //控制上滑时显示的用户名
        recommendGoods: [],
        footmarkNum: 0,
        accoutBalance: 0,
        name:this.$route.query.routeParams,
        page: 1,
        // 切换动画hack
        positionFixed: false,
        orderCount:{},
        netcardCount: 0,
        loadingFlag:0
      }
    },
    computed: mapState(['userData']),
    created () {
      this.getOrderCount()
    },
    mounted(){
      this.$mescrollInt("myMescroll",this.upCallback);
      this.getUserData()
      this.getFootmarkNum()
      // 切换动画HACK
      this.animateHack();
      //判断页面是否向上滚动
      window.addEventListener('scroll',this.judgeScroll,true);
      //改变下拉刷新的样式
      this.changeStyles();
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
    },
    methods: {
      //改变下拉刷新的样式
      changeStyles(){
        var downwarp = document.getElementsByClassName("mescroll-downwarp")[0];
        downwarp.style.backgroundColor = "rgb(244,0,87)";
        downwarp.children[0].children[0].style.borderColor = "#fff";
        downwarp.children[0].children[0].style.borderBottomColor = "transparent";
        downwarp.children[0].children[1].style.color = "#fff"; 
      },
      //判断页面是否向上滚动
      judgeScroll(){
        if (this.mescroll.getScrollTop()>0) {
          this.nameShow = true;
        } else {
          this.nameShow = false;
        }
      },
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
          }else {
            _this.$message.error(response.data.msg)
          }
        })
      },
      // 小c获取现金券未使用数量
      getNetcardsCount () {
        let _this = this;
        this.$ajax({
          method: 'get',
          url: this.$apiTransaction + 'netcard/netcards',
          params: {status:1}
        }).then(function (response) {
          if (response.data.code === '081') {
            _this.netcardCount = response.data.data.length;
          }
        })
      },
      /* 切换动画修复 */
      animateHack () {
        setTimeout(()=>{
          this.positionFixed = true
        },500)
      },
      /* 获取用户信息 */
      getUserData:function(){
        let self = this;
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          self.$store.commit('userDataChange',response.data.data)
          if (response.data.data.member_type === '092') {
            self.getUserInfo()
          }
          if (response.data.data.member_type === '091') {
            self.getNetcardsCount()
          }
        })
      },
      getUserInfo:function(){
        let self = this;
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/info',
          params: {}
        }).then(function (response) {
          self.accoutBalance = response.data.data.accoutBalance
        })
      },
      getFootmarkNum:function(){
        let self = this;
        // 发送ajax请求校验手机号重复
        self.$ajax({
          method: 'POST',
          url: self.$apiGoods+ 'logGoodsBrowse/count',
          params: {}
        }).then(function (response) {
          if (response.data.optSuc) {
            self.footmarkNum = response.data.data
          }
        })
      },
      routergoSet:function(){
        this.$router.push({
           name: '我的设置',
           query: {
              routeParams: this.name
           }
        });
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
          method: 'post',
          url:self.$apiGoods + 'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback&&successCallback(response.data.data);//成功回调
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

<style scoped>
  #myMescroll{
    position: fixed;
    top: 0;
    bottom: 0;
    height: calc(100vh - 1.6rem);
  }
  .myBox {
    /*min-height: calc(100vh - 1.6rem);*/
    width: 100%;
  }
  /*头部--开始*/
  .head{
    width: 100%;
    height: 4.5rem;
    background: url("../../../assets/img/my_bg.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .toper{
    width: 100%;
    padding: .3rem .3rem .2rem;
    display: flex;
    justify-content: space-between;
    z-index: 200;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: url("../../../assets/img/topbackground@2x.png");
  }
  .toper .lefter img{
    width: .7rem;
  }
  .toper .center{
    color: #fff;
    font-size: .4rem;
    line-height: .8rem;
  }
  .toper .righter img{
    width: .7rem;
  }
  .toper .righter img:nth-child(2){
    margin-left: .2rem;
  }
  .head .center{
    margin-top: 1rem;
    display: flex;
    position: relative;
  }
  .head .center .headPic{
    width: 1.6rem;
    height: 1.6rem;
    margin-left: .5rem;
    margin-top: .4rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1.6rem;
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
    margin-top: .4rem;
    margin-left: .3rem;
  }
  .head .center .userName li{
    align-self: center;
    color: #fff;
    font-size: .4rem;
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
    top: .4rem;
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
    padding-top: .2rem;
    background-color: rgb(242,242,242);
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
    padding-top: .1rem;
    font-size: .3rem;
  }
	.myOrderForm ul.bottom{
		display: flex;
		justify-content: space-around;
		padding: .4rem .2rem 0;
    text-align: center;
	}
  .myOrderForm ul.bottom li{
    position: relative;
  }
  .myOrderForm ul.bottom li:nth-child(2),
  .myOrderForm ul.bottom li:nth-child(3),
  .myOrderForm ul.bottom li:nth-child(4){
    margin-left: .7rem;
  }
  .myOrderForm ul.bottom li:nth-child(2) img{
    width: .7rem;
  }
  .myOrderForm ul.bottom li:nth-child(3) img{
    width: .72rem;
  }
  .myOrderForm ul.bottom li:nth-child(4) img{
    width: .56rem;
    margin-bottom: .08rem;
  }
  .myOrderForm ul.bottom li:nth-child(5){
    margin-left: .3rem;
  }
  .myOrderForm ul.bottom li:nth-child(5) img{
    width: .68rem;
    margin-bottom: .03rem;
  }
	.myOrderForm ul.bottom li img{
		width: .7rem;
	}
  .myOrderForm ul.bottom li .character{
    margin-top: .2rem;
    text-align: center;
    color: rgb(151,151,151);
    font-size: .3rem;
  }
	/*我的订单和我的财富--结束*/
	/*我的财富独有的样式--开始*/
  /*.myTreasure ul.bottom:after{*/
    /*content: "";*/
    /*display: block;*/
    /*clear: both;*/
  /*}*/
	.myTreasure ul.bottom{
		padding: .4rem 0 0;
    display: flex;
    justify-content: space-around;
	}
  /*.myTreasure ul.bottom li:nth-child(1),*/
  /*.myTreasure ul.bottom li:nth-child(2){*/
    /*text-align: center;*/
    /*float: left;*/
    /*margin-right: 2.7rem;*/
  /*}*/
	.myTreasure ul.bottom li img{
		width: .8rem;
	}
  .myTreasure ul.bottom li .words{
    margin-top: .2rem;
    color: rgb(151,151,151);
    font-size: .3rem;
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
    height: .8rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
  }
  .title img{
    width: 55%;
  }
  .badge {
    width: .5rem;
    height: .5rem;
    border-radius: 50%;
    background: rgb(246,0,87);
    color: #fff;
    font-size: .29rem;
    position: absolute;
    right: 0;
    top: -0.2rem;
    line-height: .5rem;
  }
  .badge i {
    position: absolute;
    top: -.1rem;
    right: .05rem;
    font-size: .29rem;
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
</style>
