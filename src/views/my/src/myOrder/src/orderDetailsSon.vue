<template lang="pug">
  .orderDetailsSon.mescroll#orderSMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单详情
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png").msg
    .stateDiv
      .goodsState 待发货
      .payTime 请在23时59分59秒内发货
    .goodsReceipt
      .consignee
        img(src="../../../../../assets/img/citySearch@2x.png")
        .addressee
          span.man 收件人:
            strong kariley
          span.phone 135****6807
      .address
        span 收货地址:
        strong 江苏省南京市玄武区 699-22 江苏软件园24栋
    .pickUpGoodsCode
      span 提货码
      strong SHXNJ251
    .itemStatus
      .left
        .image
          img(src="../../../../../assets/img/pick@2x.png" v-if="false")
          img(src="../../../../../assets/img/send@2x.png" v-else="true" style="margin-top:.1rem")
        .refundCenter
          .top 买家已提货
          .bottom 2018-03-16 13:30:30
      .right
        img(src="../../../../../assets/img/right.png")
    .content(v-for="(item,index) in orderDetail")
      .top
        .left
          span.orderNum 订单编号:
          span.num {{item.orderNum}}
      .center
        .image
          img(:src="item.imageSrc")
        .goodsDetails
          .words 法国PELLIOT秋冬新品户外冲锋衣男
          .property
            span.color 黄色
            span.size L
          .amount x
            span 1
          .price ￥596.00
          .smallBtn(@click="$router.push('/my/applyAfterSale')") {{smallBtn}}
      .bottom(v-show="flag")
        span.shop 提货门店:
        span 门店南京市 建邺区 新街口 中央广场
    .total
      ul
        li.totalQuantity
          span 总数量
          span x3
        li.freight
          span 运费
          span 0.0
        li.aggregate
          span 订单合计
          span ￥2000.00
        li.netGoldCard
          span 现金券抵扣
          span ￥500.00
        li.coupon
          span 通用券抵扣
          span ￥500.00
      .bottoms
        span.payment 实付金额
        span.money ￥1000.00
    .cashCoupon 返 ￥100.00 元现金券
    .orderNumber
      ul
        li.code.selects
          span 订单号:
          span.orderNums 2018022400001
        li.orderTime.selects
          span 下单时间:
          span 2018-02-24
          span 12:20:20
        li.payTime.selects
          span 付款时间:
          span 2018-03-18
          span 12:20:20
        li.sendTime.selects
          span 发货时间:
          span -
        li.receiveTime.selects
          span 签收时间:
          span -
      .copy(@click="copyText()") 复制
    .recommend
      img(src="../../../../../assets/img/my_recommend@2x.png")
    .bottomList
        ul.goodsList#box
          li(v-for="item in recommendGoods" , @click="goGoods(item.goodsId)")
            img(src="")
            .wrapWords
              .text 商品拆散你都没法跟你阿萨德你看啥都能扩大萨德你看
              .price ￥516.22
              .bottom <span>江苏南京</span><span>2555人购买</span>
    .bottomPlaceholder
    .fixedBtn
      .leftBtn {{leftBtn}}
      .centerBtn {{centerBtn}}
      .rightBtn(@click="$router.push('/my/checkLogistics')") {{rightBtn}}

</template>

<script>
    export default {
      name: "orderDetails",
      data(){
        return{
          smallBtn:"申请退货",
          leftBtn:"提醒发货",
          centerBtn:"批量退款",
          rightBtn:"物流信息",
          flag:false,
          recommendGoods: [],
          orderDetail:[
          ]
        }
      },
      created(){

      },
      mounted(){
        this.$mescrollInt("orderSMescroll",this.upCallback);
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
      },
      methods:{
        copyText() {
          var orderNums = document.getElementsByClassName("orderNums")[0];
          //orderNums.select();
          document.execCommand("Copy"); // 执行浏览器复制命令

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
  .orderDetailsSon{
    background-color: rgb(242,242,242);
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
  }
  .topRight img{
    vertical-align: middle;
  }
  .topRight img.search{
    width: .55rem;
  }
  .topRight img.msg{
    width: .7rem;
    margin-left: .2rem;
    margin-top: -.1rem;
  }
  /*订单的状态信息--开始*/
  .stateDiv{
    height: 2.8rem;
    background: linear-gradient(left,rgb(255,113,161),rgb(249,39,114));
    color: #fff;
    padding: .5rem .3rem 0;
  }
  .stateDiv .goodsState{
    font-size: .45rem;
  }
  .stateDiv .payTime{
    margin-top: .2rem;
    font-size: .35rem;
  }
  /*订单的状态信息--结束*/
  /*收货人的信息--开始*/
  .goodsReceipt{
    background-color: #fff;
    padding: .3rem;
    color: rgb(153,153,153);
  }
  .goodsReceipt .consignee{
    display: flex;
  }
  .consignee img{
    width: .25rem;
    height: .35rem;
  }
  .consignee .addressee{
    margin-top: -.1rem;
    margin-left: .2rem;
    font-size: .4rem;
  }
  .consignee .addressee span.man strong{
    margin-left: .2rem;
    font-size: .4rem;
    font-weight: 400;
  }
  .consignee .addressee span.phone{
    margin-left: .5rem;
  }
  .address{
    margin-top: .2rem;
    margin-left: .45rem;
    font-size: .4rem;
  }
  .address strong{
    display: inline-block;
    vertical-align: top;
    margin-left: .2rem;
    font-weight: 400;
    width: 7rem;
  }
  /*收货人的信息--结束*/
  /*提货码--开始*/
  .pickUpGoodsCode{
    height: 2rem;
    line-height: 2rem;
    background-color: #fff;
    margin-top: .2rem;
    padding-left: .8rem;
    color: rgb(244,0,87);
  }
  .pickUpGoodsCode span{
    font-size: .4rem;
  }
  .pickUpGoodsCode strong{
    font-size: .4rem;
    margin-left: 2rem;
  }
  /*提货码--结束*/
  /*买家商品的状态--开始*/
  .itemStatus{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: .2rem 0 .2rem .3rem;
    margin-top: .2rem;
  }
  .itemStatus .left{
    display: flex;
  }
  .itemStatus .left img{
    width: .5rem;
  }
  .itemStatus .refundCenter{
    margin-left: .2rem;
  }
  .itemStatus .refundCenter .top{
    font-size: .4rem;
  }
  .itemStatus .refundCenter .bottom{
    color: rgb(153,153,153);
    margin-top: .1rem;
  }
  .itemStatus .right{
    margin-left: .6rem;
  }
  .itemStatus .right img{
    width: .6rem;
    margin-top: .3rem;
    margin-right: .1rem;
  }
  /*买家商品的状态--结束*/
  /*商品的详情--开始*/
  .content{
    margin-top: .2rem;
  }
  .content .top{
    height: .8rem;
    border-bottom: 1px solid rgb(242,242,242);
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 .3rem;
    line-height: .8rem;
  }
  .top .left{
    color: rgb(51,51,51);
    font-size: .35rem;
  }
  .top .left span.orderNum{
    margin-right: .2rem;
  }
  .top .right{
    font-size:  .4rem;
    color: rgb(244,0,87);
  }
  .center{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    white-space:nowrap;
    overflow-x:auto;
    display: flex;
    position: relative;
  }
  .center .image{

  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
  }
  .center .goodsDetails{
    margin-left: .3rem;
  }
  .center .goodsDetails .words{
    font-size: .35rem;
  }
  .center .goodsDetails .property{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span.size{
    margin-left: .3rem;
  }
  .center .goodsDetails .amount{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .price{
    margin-top: .25rem;
    font-size: .45rem;
    color: rgb(244,0,87);
    margin-left: -.1rem;
  }
  .center .goodsDetails .smallBtn{
    width: 2rem;
    height: .8rem;
    border-radius: .8rem;
    border: 1px solid rgb(153,153,153);
    text-align: center;
    line-height: .8rem;
    font-size: .4rem;
    position: absolute;
    top: 2rem;
    right: .3rem;
  }
  .wrapWords .bottom{
    height: .8rem;
    line-height: .8rem;
    background-color: #fff;
    padding: 0 .3rem;
    font-size: .35rem;
  }
  /*商品的详情--结束*/
  /*总商品的统计--开始*/
  .total{
    margin-top: .2rem;
    background-color: #fff;
  }
  .total ul{
    padding: .2rem .3rem .1rem;
    color: rgb(153,153,153);
    font-size: .35rem;
  }
  .total ul li{
    display: flex;
    justify-content: space-between;
  }
  .total .bottoms{
    padding: 0 .3rem;
    border-top: 1px solid rgb(242,242,242);
    height: .8rem;
    line-height: .8rem;
    font-size: .4rem;
    display: flex;
    justify-content: space-between;
  }
  .total .bottoms span.money{
    color: rgb(244,0,87);
  }
  /*总商品的统计--结束*/
  /*返现金券--开始*/
  .cashCoupon{
    height: 1.2rem;
    margin-top: .2rem;
    background-color: #fff;
    line-height: 1.2rem;
    padding-left: .3rem;
    font-size: .4rem;
    color: rgb(244,0,87);
  }
  /*返现金券--结束*/
  /*订单编号--开始*/
  .orderNumber{
    margin-top: .2rem;
    background-color: #fff;
    position: relative;
  }
  .orderNumber ul{
    padding: .2rem .3rem;
  }
  .orderNumber ul li{
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .orderNumber ul li span{
    margin-right: .2rem;
  }
  .orderNumber .copy{
    position: absolute;
    top: .3rem;
    right: .3rem;
    width: 1.4rem;
    height: .7rem;
    background-color: rgb(204,204,204);
    color: #fff;
    text-align: center;
    line-height: .7rem;
    font-size: .35rem;
    border-radius: .5rem;
  }
  /*订单编号--结束*/
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
  .goodsList {
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
  .wrapWords .bottom{
    margin: .1rem;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
  /*商品大图展示--结束*/
  .bottomPlaceholder {
    height: 1.5rem;
  }
  #orderMescroll{
    top: 0;
    bottom: 0;
    height: auto;
    position: fixed;
  }
  /*底部的两个按钮--开始*/
  .fixedBtn{
    z-index: 102;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 1.4rem;
    display: flex;
    justify-content: flex-end;
    background-color: #fff;
    padding: .2rem .3rem;
  }
  .fixedBtn div{
    width: 2.3rem;
    height: 1rem;
    border-radius: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: .4rem;
    margin-left: .3rem;
  }
  .fixedBtn .leftBtn,
  .fixedBtn .centerBtn{
    color: rgb(161,161,161);
    border: 1px solid rgb(161,161,161);
  }
  .fixedBtn .rightBtn{
    color: #fff;
    border: 1px solid rgb(244,0,87);
    background-color: rgb(244,0,87);
  }
  /*底部的两个按钮--结束*/
</style>
