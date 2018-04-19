<template lang="pug">
  .returnDetails
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 退款详情
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png")
    .stateDiv
      .goodsState 退货中
      .payTime 买家暂时未收到货,请耐心等待
    .returnTotalMoney
      ul.total
        li 退款总金额
        li ￥200.00
      ul.reality
        li 实退金额
        li ￥200.00
    .coupon
      ul.netGoldCard
        li 网金卡
        li ￥20.00
      ul.generalCard
        li 通用券
        li ￥20.00
    .refundWay
      ul
        li 退款路径
        li 银行卡
    .refundProgress
      .wrap(v-for="item in progress")
        .fatDiv
          img(:src="item.imgSrc")
          .progress {{item.progressC}}
          .time {{item.time}}
    .refundInfor
      .top 退款信息
      .content(v-for="(item,index) in goodsList")
        .center
          .image
            img(:src="item.imgSrc")
          .goodsDetails
            .words {{item.words}}
            .property
              span.color {{item.color}}
              span.size {{item.size}}
            .amount x
              span {{item.amount}}
      .refundCont
        ul
          li
            span 退款原因:
            span 多拍 /拍错 /不想要
          li
            span 退款说明:
            span -
          li
            span 申请数量:
            span 1
          li
            span 申请时间:
            span 2018-03-20
          li
            span 退款编号:
            span 03202100010001
          li
            span 退款凭证:
            img(src="../../../../../assets/img/my_goods.png")

</template>
<script>
  import myGoods from '../../../../../assets/img/my_goods.png'
  import now from '../../../../../assets/img/now@2x.png'
  import past from '../../../../../assets/img/past@2x.png'

  export default {
    name: 'returnDetails',
    data () {
      return {
        goodsList:[
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"黄色",
            size:"L",
            amount:1,
            checked:false
          }
        ],
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
      this.getData()
    },
    mounted () {

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
          params:form
        }).then(function (response) {
          if (response.data.code === '081') {
            this.goodsList = response.data.data
          }else {
            _this.$message.error(response.data.msg)
          }
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
    overflow-x:auto;
    display: flex;
    position: relative;
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
  .refundCont ul li span:nth-child(2){
    margin-left: .2rem;
  }
  .refundCont ul li:last-child{
    display: flex;
  }
  .refundCont ul li:last-child img{
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
    margin-left: .2rem;
  }
  /*退款内容原因--结束*/
</style>
