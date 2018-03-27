<template lang="pug">
  .selectService
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 选择服务类型
      .topRight(slot="right")
        img(src="../../../../../assets/img/msg_0.png")
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
    .onlyRefund(@click="goToRefund()")
      .left
        .image
          img(src="../../../../../assets/img/refund.png")
        .refundCenter
          .top 仅退款
          .bottom 未收到包裹(包含未确认收货), 或卖家协商同意前提下
      .right
        img(src="../../../../../assets/img/right.png")  
    .aRefundReturn(@click="goToReturn()")
      .left
        .image
          img(src="../../../../../assets/img/salesReturn.png")
        .refundCenter
          .top 退款退货
          .bottom 已收到包裹, 需要退换已收到的货物
      .right
        img(src="../../../../../assets/img/right.png")
</template>
<script>
  import myGoods from '../../../../../assets/img/my_goods.png'
  export default {
    name: 'selectService',
    data () {
      return {
        msg: false,
        goodsList:[
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"黄色",
            size:"L",
            amount:1,
            checked:false
          },
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"黑色",
            size:"XL",
            amount:1,
            checked:false
          },
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"红色",
            size:"M",
            amount:1,
            checked:false
          }
        ]
      }
    },
    mounted () {
      this.check();
    },
    methods: {
      goToRefund:function(){
        this.$router.push({
           name: '申请退款退货',
           query: {
              routeParams: 1
           }
        });
      },
      goToReturn:function(){
        this.$router.push({
           name: '申请退款退货',
           query: {
              routeParams: 2
           }
        });
      },
      cMsg(){
        for (var i = this.goodsList.length - 1; i >= 0; i--) {
          this.goodsList[i].checked = true;
          this.msg = true; 
        }
      },

      check(){
        for (var i = this.goodsList.length - 1; i >= 0; i--) {
          if(this.goodsList[i].checked != true){
            this.msg = false;
          } 
        }
      }
    }
  }
</script>

<style scoped>
  .selectService{
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
  /*退款退货和仅退款--开始*/
  .onlyRefund,
  .aRefundReturn{
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    padding: .2rem 0 .2rem .3rem;
    margin-top: .2rem;
  }
  .onlyRefund .left,
  .aRefundReturn .left{
    display: flex;
  }
  .onlyRefund .left img,
  .aRefundReturn .left img{
    width: .5rem;
  }
  .onlyRefund .refundCenter,
  .aRefundReturn .refundCenter{
    margin-left: .2rem;
  }
  .onlyRefund .refundCenter .top,
  .aRefundReturn .refundCenter .top{
    font-size: .4rem;
  }
  .onlyRefund .refundCenter .bottom,
  .aRefundReturn .refundCenter .bottom{
    color: rgb(153,153,153);
  }
  .onlyRefund .right,
  .aRefundReturn .right{
    margin-left: .6rem;
  }
  .onlyRefund .right img,
  .aRefundReturn .right img{
    width: .5rem;
    margin-top: .2rem;
    margin-right: .1rem;
  }
  /*退款退货和仅退款--结束*/
</style>
