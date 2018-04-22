<template lang="pug">
  div.myBox.mescroll#myMescroll(:class="{positionFixed: positionFixed}")
    .head
      .top
        .lefter
          img(src="../../../assets/img/my_set@2x.png" @click="routergoSet()")
        .righter
          img(src="../../../assets/img/message@2x.png", v-if="false")
          img(src="../../../assets/img/my_account@2x.png", @click="$router.push('/my/accountB')", v-if="userData.member_type === '092'")
          img(src="../../../assets/img/consumerdetails@2x.png", @click="$router.push('/my/accountC')", v-else)
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
    div.myOrderForm
      ul.top(@click="$router.push('/my/orderManage')")
        li 我的订单
        li(style="color:rgb(151,151,151);font-weight:400;") 查看更多 >
      ul.bottom
        li(@click="$router.push({path:'/my/orderManage',query:{id:1}})")
          img(src="../../../assets/img/my_obligation@2x.png")
          .character 待付款
        li(@click="$router.push({path:'/my/orderManage',query:{id:2}})")
          img(src="../../../assets/img/my_readyfordelivery@2x.png")
          .character 待发货
        li(@click="$router.push({path:'/my/orderManage',query:{id:3}})")
          img(src="../../../assets/img/my_waitforreceiving2@2x.png")
          .character 待收货
        li(@click="$router.push({path:'/my/orderManage',query:{id:4}})")
          img(src="../../../assets/img/my_completed.png")
          .character 已完成
        li(@click="$router.push('/my/refundAfterSale')")
          img(src="../../../assets/img/my_aftersale2@2x.png")
          .character 退货/售后
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
          .words 现金券
        li(v-if="userData.member_type === '091'", @click="goAllCard")
          img(src="../../../assets/img/my_cashcoupon@2x.png")
          .words 通用劵
    .title
      .line
      p 推荐
    w-recommend#dataId(:listData="recommendGoods")
    .bottomPlaceholder
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: "my",
    data() {
      return{
        recommendGoods: [],
        footmarkNum: 0,
        accoutBalance: 0,
        name:this.$route.query.routeParams,
        page: 1,
        // 切换动画hack
        positionFixed: false
      }
    },
    computed: mapState(['userData']),
    mounted(){
      this.$mescrollInt("myMescroll",this.upCallback);
      this.getUserData()
      this.getFootmarkNum()
      // 切换动画HACK
      this.animateHack()
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods: {
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
      // 前往网金卡
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
  .myBox {
    /*height: 100vh;*/
    width: 100%;
    background-color: rgb(242,242,242);
    padding-bottom: 2rem;
  }
  /*头部--开始*/
  .head{
    width: 100%;
    height: 4.5rem;
    background: url("../../../assets/img/my_bg.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .head .top{
    width: 100%;
    margin-top: .2rem;
    padding: 0 .3rem;
    display: flex;
    justify-content: space-between;
  }
  .head .top .lefter img{
    width: .7rem;
  }
  .head .top .righter img{
    width: .7rem;
  }
  .head .top .righter img:nth-child(2){
    margin-left: .2rem;
  }
  .head .center{
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
  .head .center .headPic img{
    width: 1.6rem;
    height: 1.6rem;
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
	.myOrderForm,
	.myTreasure{
		background-color: #fff;
		padding: .4rem 0 .5rem;
		margin-top: .2rem;
	}
	.myOrderForm ul.top,
	.myTreasure ul.top{
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgb(153,153,153);
		padding-bottom: .4rem;
		margin: 0 .4rem;
	}
	.myOrderForm ul.top li,
	.myTreasure ul.top li{
		font-size: .4rem;
		font-weight: bold;
	}
	.myOrderForm ul.top li:nth-child(2) img,
	.myTreasure ul.top li:nth-child(2) img{
		width: 1.3rem;
		vertical-align: top;
		margin-top: .05rem;
	}
	.myOrderForm ul.bottom{
		display: flex;
		justify-content: space-around;
		padding: .4rem .2rem 0;
    text-align: center;
	}
  .myOrderForm ul.bottom li:nth-child(2),
  .myOrderForm ul.bottom li:nth-child(3),
  .myOrderForm ul.bottom li:nth-child(4){
    margin-left: .7rem;
  }
  .myOrderForm ul.bottom li:nth-child(3) img{
    width: .75rem;
  }
  .myOrderForm ul.bottom li:nth-child(4) img{
    width: .65rem;
  }
  .myOrderForm ul.bottom li:nth-child(5){
    margin-left: .3rem;
  }
	.myOrderForm ul.bottom li img{
		width: .7rem;
	}
  .myOrderForm ul.bottom li .character{
    text-align: center;
    color: rgb(51,51,51);
    font-size: .35rem;
  }
	/*我的订单和我的财富--结束*/
	/*我的财富独有的样式--开始*/
	.myTreasure ul.bottom{
		display: flex;
		justify-content: space-around;
		padding: .4rem 1rem 0;
	}
  .myTreasure ul.bottom li{
    text-align: center;
    margin-right: .5rem;
  }
	.myTreasure ul.bottom li img{
		width: .8rem;
	}
  .myTreasure ul.bottom li .words{
    color: rgb(51,51,51);
    font-size: .35rem;
  }
	/*我的财富独有的样式--结束*/
	/*商品大图展示--开始*/
  .goodsList{
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: .2rem;
    background: #fff;
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
  .bottomPlaceholder {
    height: 1.5rem;
  }
  #myMescroll{
    top: 0;
    bottom: 0;
    height: auto;
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
</style>
