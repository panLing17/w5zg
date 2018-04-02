<template lang="pug">
  .refundAfterSale
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 退款/售后
      .topRight(slot="right")
        img(src="../../../../../assets/img/searchInput搜索图标@2x.png").search
        img(src="../../../../../assets/img/msg_0.png").msg
    .orderStatus
      ul.wrapStatus
        li(v-for="(item,index) in status" @click="check(index)" :class="{active:index == num}").status {{item}}
    .content(v-for="(item,index) in orderDetail")
      .top
        .left
          span.orderNum 订单编号:
          span.num {{item.orderNum}}
        .right#state {{item.status}}  
      .center(@click="$router.push('/my/returnDetails')")
        .image
          img(:src="item.imageSrc")
        .goodsDetails
            .words {{item.words}}
            .property
              span.color {{item.color}}
              span.size {{item.size}}
            .amount x
              span {{item.amount}}   
      .bottom
        .left
          .returnState {{item.returnState}}
        .right
          .button
            .cancel(@click="$router.push('/my/express')" v-show="item.status === '退款中'") {{item.buttonL}}
            .pay(:class="{a:item.status === '待发货'}" @click="$router.push('/my/returnDetails')") {{item.buttonR}}       
</template>

<script>
    import myGoods from '../../../../../assets/img/my_goods.png'
    export default {
      name: "refundAfterSale",
      data(){
        return{
          num:0,
          statusFlag1:false,
          statusFlag2:true,
          status:["全部","申请中","退款中","已退款","已完成"],
          orderDetail:[
            {
              orderNum:"2018031401",
              status:"申请中",
              imageSrc:myGoods,
              returnState:"等待确认",
              words:"法国PELLIOT秋冬新品户外冲锋衣男",
              color:"黄色",
              size:"L",
              amount:1,
              buttonL:"发货",
              buttonR:"查看详情"
            },
            {
              orderNum:"2018031402",
              status:"退款中",
              imageSrc:myGoods,
              returnState:"等待买家发货",
              words:"法国PELLIOT秋冬新品户外冲锋衣男",
              color:"黄色",
              size:"L",
              amount:1,
              buttonL:"发货",
              buttonR:"查看详情"
            },
            {
              orderNum:"2018031403",
              status:"已完成",
              imageSrc:myGoods,
              returnState:"退货退款完成",
              words:"法国PELLIOT秋冬新品户外冲锋衣男",
              color:"黄色",
              size:"L",
              amount:1,
              buttonL:"发货",
              buttonR:"查看详情"
            },
            {
              orderNum:"2018031404",
              status:"已完成",
              imageSrc:myGoods,
              returnState:"退货退款完成",
              words:"法国PELLIOT秋冬新品户外冲锋衣男",
              color:"黄色",
              size:"L",
              amount:1,
              buttonL:"发货",
              buttonR:"查看详情"
            }
          ]
        }
      },
      created(){

      },
      mounted(){
        
      },
      methods:{
        check(index){
          this.num = index;
        }
      }
    }
</script>

<style scoped>
  .active{
    color: rgb(244,0,87) !important;
  }
  .a{
    background-color: #fff !important;
    color: rgb(244,0,87) !important;
  }
  .refundAfterSale{
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
  /*订单的状态--开始*/
  .orderStatus{
    background-color: #fff;
    height: 1rem;
    padding: 0 .3rem;
  }
  .orderStatus ul.wrapStatus{
    display: flex;
    justify-content: space-between;
  }
  .orderStatus ul.wrapStatus li.status{
    line-height: 1rem;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  /*订单的状态--结束*/
  /*订单内容--开始*/
  .content{
    margin-top: .3rem;
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
    display: flex;
  } 
  .center .image{
    
  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
    margin-right: .3rem;
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
  .bottom{
    background-color: #fff;
    padding: .2rem .2rem .2rem 0;
  }
  .bottom:after{
    content: "";
    display: block;
    clear: both;
  }
  .bottom .left{
    float: left;
    padding-left: .3rem;
  }
  .bottom .left .returnState{
    font-size: .4rem;
    color: rgb(244,0,87);
    line-height: 1rem;
  }
  .bottom .right{
    float: right;
  }
  .bottom .right .totalNumber{
    font-size: .37rem;
    color: rgb(161,161,161);
  }
  .bottom .right .totalNumber span{
    margin-left: .3rem;
  }
  .bottom .right .totalNumber strong.priceNum{
    color: rgb(244,0,87);
    font-size: .4rem;
    font-weight: 400;
  }
  .bottom .right .button{
    display: flex;
    justify-content: space-around;
  }
  .bottom .right .button div{
    width: 2.2rem;
    height: 1rem;
    border-radius: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: .4rem;
  }
  .bottom .right .button .cancel{
    color: rgb(161,161,161);
    border: 1px solid rgb(161,161,161);
  }
  .bottom .right .button .pay{
    color: rgb(244,0,87);
    border: 1px solid rgb(244,0,87);
    background-color: #fff;
    margin-left: .3rem;
  }
  /*订单内容--结束*/
</style>
