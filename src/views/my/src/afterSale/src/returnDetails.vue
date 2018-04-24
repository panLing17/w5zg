<template lang="pug">
  .returnDetails
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 退款详情
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png")
    .stateDiv
      .goodsState {{goodsList.gr_status}}
      .payTime
    .returnTotalMoney
      ul.total
        li 退款总金额
        li ￥{{priceInfo.price+priceInfo.cardPrice+priceInfo.ticketPrice | price}}
      ul.reality
        li 实退金额
        li ￥{{priceInfo.price | price}}
    .coupon
      ul.netGoldCard
        li 现金券
        li ￥{{priceInfo.cardPrice | price}}
      ul.generalCard
        li 通用券
        li ￥{{priceInfo.ticketPrice | price}}
    <!--.refundWay-->
      <!--ul-->
        <!--li 退款路径-->
        <!--li 银行卡-->
    <!--.refundProgress-->
      <!--.wrap(v-for="item in progress")-->
        <!--.fatDiv-->
          <!--img(:src="item.imgSrc")-->
          <!--.progress {{item.progressC}}-->
          <!--.time {{item.time}}-->
    .refundInfor
      .top 退款信息
      .content(v-for="item in goodsList.rejectedDetail")
        .center
          .image
            img(:src="item.logo | img-filter")
          .goodsDetails
            .words {{item.goods_name}}
            .property
              span(v-for="i in item.spec_json") {{i.gspec_value}}
              span.count x {{item.gr_num}}
          .btn(v-if="goodsList.gr_status==='待发货'&&goodsList.reject_way!=='门店退货'", @click="$router.push({path: '/my/express', query:{id:$route.query.id}})") 发货
        .refundCont
          ul
            li
              span.left 退款原因:
              span.right {{goodsList.rejected_reason}}
            li(v-if="item.desp_custom")
              span.left 退款说明:
              span.right {{item.desp_custom}}
            li
              span.left 申请数量:
              span.right {{item.gr_num}}
            li
              span.left 申请时间:
              span.right {{goodsList.apply_time}}
            li
              span.left 退款编号:
              span.right {{goodsList.reject_num}}
            li(v-if="item.desp_pic")
              span.left 退款凭证:
              .wrapper.right
                img(:src="img | img-filter", v-for="img in item.desp_pic")

</template>
<script>
  import now from '../../../../../assets/img/now@2x.png'
  import past from '../../../../../assets/img/past@2x.png'

  export default {
    name: 'returnDetails',
    data () {
      return {
        goodsList:{},
        priceInfo:{},
        progress:[
          {
            imgSrc:now,
            progressC:"卖家退款",
            time:"2018-03-20 13:20:20"
          },
          {
            imgSrc:now,
            progressC:"银行受理",
            time:"2018-03-20 13:20:20"
          },
          {
            imgSrc:past,
            progressC:"退款完成",
            time:"2018-03-20 13:20:20"
          }
        ]
      }
    },
    created () {
      // 获取商品相关信息
      this.getData()
      // 获取金额相关信息
      this.getPrice()
    },
    mounted () {

    },
    filters: {
      price (value) {
        if (value || value == 0) {
          return value.toFixed(2)
        }else {
          return
        }

      }
    },
    methods: {
      getData () {
        let _this = this
        let form = {
          id: this.$route.query.id
        }
        this.$ajax({
          method: 'post',
          url: this.$apiTransaction + 'goodsRejected/rejectedOrderInfo',
          // url: "http://192.168.1.171:8061/goodsRejected/rejectedOrderInfo",
          params:form
        }).then(function (response) {
          if (response.data.code === '081') {
            _this.goodsList = response.data.data[0]
          }else {
            _this.$message.error(response.data.msg)
          }
        })
      },
      getPrice () {
        let _this = this
        this.$ajax({
          method: 'get',
          url: this.$apiTransaction + 'order/order/detail/usedNetCardAndCommonTicket',
          params:{
            orderDetailId:this.$route.query.detailId
          }
        }).then(function (response) {
          _this.priceInfo = response.data.data;
        })
      }
    }
  }
</script>

<style scoped>
  .returnDetails{
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 100;
    background-color: rgb(242,242,242);
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
  }
  .topRight img{
    width: .7rem;
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
  /*退款总金额和网金卡--开始*/
  .returnTotalMoney,
  .coupon{
    background-color: #fff;
    margin-top: .2rem;
    padding: 0 .3rem;
  }
  .returnTotalMoney ul,
  .coupon ul{
    display: flex;
    justify-content: space-between;
    height: 1.2rem;
    line-height: 1.2rem;
  }
  .returnTotalMoney ul.total,
  .coupon ul.netGoldCard{
    border-bottom: .5px solid rgb(242,242,242);
  }
  .returnTotalMoney ul.reality,
  .coupon ul.generalCard{
    border-top: .5px solid rgb(242,242,242);
  }
  .returnTotalMoney ul li,
  .coupon ul li{
    font-size: .4rem;
  }
  /*退款总金额和网金卡--结束*/
  /*退款途径--开始*/
  .refundWay{
    background-color: #fff;
    margin-top: .2rem;
    padding: 0 .3rem;
  }
  .refundWay ul{
    display: flex;
    justify-content: space-between;
    height: 1.2rem;
    line-height: 1.2rem;
  }
  .refundWay ul li{
    font-size: .4rem;
  }
  /*退款途径--结束*/
  /*退款进度-开始*/
  .refundProgress{
    padding: .5rem .3rem 0;
    display: flex;
    height: 2.5rem;
  }
  .wrap{
    border-top: 1px solid rgb(244,0,87);
    position: relative;
    width: 3.5rem;
    text-align: center;
    color: rgb(244,0,87);
  }
  .wrap:first-child{
    margin-left: 1.2rem;
  }
  .wrap:last-child{
    width: 0;
    border-color: rgb(242,242,242);
    color: rgb(153,153,153);
  }
  .wrap .fatDiv{
    position: absolute;
    top: -.2rem;
    left: -1.2rem;
    width: 2.5rem;
  }
  .wrap .fatDiv img{
    width: .4rem;
  }
  .wrap .fatDiv .progress,
  .wrap .fatDiv .time{
    margin-top: .1rem;
  }
  .wrap .fatDiv .time{
    color: rgb(153,153,153);
  }
  /*退款进度--结束*/
  /*退款信息--开始*/
  .refundInfor{
    margin-top: .2rem;
    background-color: #fff;
  }
  .refundInfor .top{
    height: .8rem;
    line-height: .8rem;
    border-bottom: .5px solid rgb(242,242,242);
    font-size: .4rem;
    padding-left: .3rem;
  }
  /*退款信息--结束*/
  /*商品内容--开始*/
  .center{
    background-color: #fff;
    padding: .3rem .3rem .2rem;
    border-bottom: 1px solid rgb(242,242,242);
    white-space:nowrap;
    display: flex;
    position: relative;
    overflow: hidden;
  }
  .center .image {
    flex: none;
  }
  .center .check{
    line-height: 2.4rem;
    margin-right: .3rem;
    position: absolute;
    top: 44%;
    left: .3rem;
  }
  .center .image img{
    width: 2.5rem;
    height: 2.26rem;
    border-radius: .2rem;
  }
  .center .goodsDetails{
    margin-left: .3rem;
    flex: 1;
    overflow: hidden;
  }
  .center .goodsDetails .words{
    font-size: .35rem;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .center .goodsDetails .property{
    margin-top: .1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  .center .goodsDetails .property span{
    margin-right: .3rem;
  }
  .center .goodsDetails .amount{
    margin-top: 1rem;
    font-size: .35rem;
    color: rgb(153,153,153);
  }
  /*商品内容--结束*/
  /*退款内容原因--开始*/
  .refundCont{
    padding: .3rem .3rem .8rem;
  }
  .refundCont ul li{
    margin-top: .1rem;
    color: rgb(153,153,153);
  }
  .refundCont ul li .left {
    flex: none;
  }
  .refundCont ul li .right {
    flex: 1;
  }
  .refundCont ul li span:nth-child(2){
    margin-left: .2rem;
  }
  .refundCont ul li:last-child{
    display: flex;
    flex-wrap: wrap;
  }
  .refundCont ul li:last-child img{
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
    margin-left: .2rem;
  }
  /*退款内容原因--结束*/
  .count {
    margin-left: 1rem;
  }
  .btn {
    width: 2rem;
    height: .8rem;
    border-radius: .8rem;
    text-align: center;
    line-height: .8rem;
    font-size: .4rem;
    color: rgb(244,0,87);
    border: 1px solid rgb(244,0,87);
    position: absolute;
    bottom: 0.2rem;
    right: .5rem;
  }
</style>
