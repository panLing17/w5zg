<template lang="pug">
  div.myBox.mescroll#myMescroll
    .head
      .top
        .lefter
          img(src="../../../assets/img/my_set@2x.png" @click="routergoSet()")
        .righter
          img(src="../../../assets/img/message@2x.png")
          img(src="../../../assets/img/my_account@2x.png" @click="routergoUser()" v-if="false")
          img(src="../../../assets/img/consumerdetails@2x.png" v-else="true")
      p.center
          ul.headPic
            li(@click="routergoUser()")
              img(:src="this.userHeadPortrait | img-filter")
          ul.userName
            li {{userNiceName}}
          ul.balance(v-if="false")
            li 余额:
            li 8888.88
            li 元
    div.fav_att_foot
      ul.left
        li 0
        li 收藏夹
      ul.center
        li 0
        li 关注店铺
      ul.right
        li 22
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
          img(src="../../../assets/img/my_remaintobeevaluated2@2x.png")
          .character 待评价
        li(@click="$router.push('/my/refundAfterSale')")
          img(src="../../../assets/img/my_aftersale2@2x.png")
          .character 退货/售后
    div.myTreasure
      ul.top
        li 我的财富
        li
      ul.bottom
        li
          img(src="../../../assets/img/my_bankcard@2x.png")
          .words 银行卡
        li
          img(src="../../../assets/img/my_card@2x.png")
          .words 现金券
        li(v-if="true")
          img(src="../../../assets/img/my_cashcoupon@2x.png")
          .words 通用劵
    div.recommend
      img(src="../../../assets/img/my_recommend@2x.png")
    .bottomList
        ul.goodsList#box
          li(v-for="item in recommendGoods" , @click="goGoods(item.goodsId)")
            img(src="../../../assets/img/my_goods.png")
            .wrapWords
              .text 商品拆散你都没法跟你阿萨德你看啥都能扩大萨德你看
              .price ￥516.22
              .bottom <span>江苏南京</span><span>2555人购买</span>
    .bottomPlaceholder
</template>

<script>
import my_goods from '../../../assets/img/my_goods.png'
  export default {
    name: "my",
    data() {
      return{
        recommendGoods: [],
        userNiceName:'1231312',
        userHeadPortrait: '',
        name:this.$route.query.routeParams,
        goodsDetails:[
          {
            'imgSrc':my_goods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':568,
            'region':'江苏南京',
            'buyerNum':'167'
          },
          {
            'imgSrc':my_goods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':379,
            'region':'浙江杭州',
            'buyerNum':'200'
          },
          {
            'imgSrc':my_goods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':299,
            'region':'安徽合肥',
            'buyerNum':'101'
          },
        ]


      }

    },
    mounted(){
      this.$mescrollInt("myMescroll",this.upCallback);
      this.getUserInfo()
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
    },
    methods: {
      // 点击按钮，返回顶部
      // topFunction:function () {
      //   var timer = setInterval(function(){
      //       var top = document.body.scrollTop || document.documentElement.scrollTop;
      //       var speed = top / 4;
      //       if (document.body.scrollTop!=0) {
      //           document.body.scrollTop -= speed;
      //       }else {
      //           document.documentElement.scrollTop -= speed;
      //       }
      //       if (top == 0) {
      //           clearInterval(timer);
      //       }
      //   },30);
      // },
      getUserInfo:function(){
        let self = this
        // 发送ajax请求校验手机号重复
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/info',
          params: {}
        }).then(function (response) {
          // 提示用户信息
          if (response.data.optSuc) {
            self.userNiceName = response.data.data.mi_nickname
            self.userHeadPortrait = response.data.data.mi_head_sculpture
          }
        })
      },
      routergoUser:function(){
        this.$router.push({
           name: '我的用户资料',
           query: {
              routeParams: this.name
           }
        });
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
    height: 5rem;
    background: url("../../../assets/img/my_bg.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .head .top{
    width: 100%;
    margin-top: 1rem;
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
    width: 4rem;
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
		width: 1.2rem;
	}
  .myTreasure ul.bottom li .words{
    color: rgb(51,51,51);
    font-size: .35rem;
  }
	/*我的财富独有的样式--结束*/
	/*我的推荐--开始*/
	.recommend{
		height: 1rem;
		line-height: 1.2rem;
		text-align: center;
	}
	.recommend img{
		width: 5rem;
	}
	/*我的推荐--结束*/
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
    position: fixed;
  }
</style>
