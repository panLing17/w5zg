<template lang="pug">
  .orderManage
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单管理
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
      .center(@click="$router.push({path:'/my/orderDetails',query:{state:item.status,id:index}})")
        .image
          img(:src="items" v-for="items in item.imageSrc")   
      .bottom
        .left(v-if="item.status === '待备货'")
          .goodsCode 提货码: {{item.goodsCode}}
        .right
          .total
            .totalNumber
              span.amount 共计 {{item.amount}} 件商品
              span.price 合计 :
                strong.priceNum {{item.priceNum | price-filter}}
          .button(v-if="item.status === '待付款' || '待发货' || '待收货'",v-show="item.status !== '备货中'")
            .cancel {{item.buttonL}}
            .pay(:class="{a:item.status === '待发货'}") {{item.buttonR}}       
</template>

<script>
    import myGoods from '../../../../../assets/img/my_goods.png'
    export default {
      name: "orderManage",
      data(){
        return{
          num:0,
          statusFlag1:false,
          statusFlag2:true,
          status:["全部","待付款","待发货","待收货","待评价"],
          orderDetail:[
            {
              orderNum:"2018031401",
              status:"待付款",
              imageSrc:[myGoods,myGoods,myGoods,myGoods],
              amount:4,
              priceNum:596,
              buttonL:"取消订单",
              buttonR:"支付"
            },
            {
              orderNum:"2018031402",
              status:"备货中",
              imageSrc:[myGoods,myGoods,myGoods,myGoods,myGoods,myGoods],
              goodsCode:"03200001",
              amount:6,
              priceNum:596
            },
            {
              orderNum:"2018031403",
              status:"待发货",
              imageSrc:[myGoods,myGoods,myGoods,myGoods,myGoods],
              goodsCode:"03200001",
              amount:5,
              priceNum:596,
              buttonL:"提醒发货",
              buttonR:"物流信息"
            },
            {
              orderNum:"2018031404",
              status:"待自提",
              imageSrc:[myGoods,myGoods,myGoods],
              goodsCode:"03200001",
              amount:3,
              priceNum:596,
              buttonL:"提醒发货",
              buttonR:"物流信息"
            }
          ]
        }
      },
      created(){

      },
      mounted(){
        this.jump();  
      },
      methods:{
        //判断上一页点击的索引值
        jump(){
          console.log(this.$route.query.id);
          if (this.$route.query.id == 1) {
            this.num = 1;
          }
          if (this.$route.query.id == 2) {
            this.num = 2;
          }
          if (this.$route.query.id == 3) {
            this.num = 3;
          }
          if (this.$route.query.id == 4) {
            this.num = 4;
          }
        },

        //点击tab切换
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
  .orderManage{
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
    white-space:nowrap;
    overflow-x:auto;
  } 
  .center .image{
    
  }
  .center .image img{
    width: 2.5rem;
    border-radius: .2rem;
    margin-right: .3rem;
  }
  .center .goodsExplain{
    padding: .1rem 0 0 .3rem;
    width: 100%;
  }
  .center .goodsExplain .words{
    font-size: .37rem;
  }
  .center .goodsExplain .cont{
    width: 100%;
    margin-top: .6rem;
    display: flex;
    justify-content: space-between;
    color: rgb(153,153,153);
  }
  .center .goodsExplain .cont .property span{
    margin-right: .3rem;
  }
  .center .goodsExplain .cont .quantity span{
    font-size: .35rem;
  }
  .bottom{
    background-color: #fff;
    padding: .3rem .3rem .4rem 0;
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
  .bottom .left .goodsCode{
    font-size: .4rem;
    color: rgb(244,0,87);
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
    margin-top: .4rem;
    display: flex;
    justify-content: space-around;
  }
  .bottom .right .button div{
    width: 2.5rem;
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
    color: #fff;
    border: 1px solid rgb(244,0,87);
    background-color: rgb(244,0,87);
  }
  /*订单内容--结束*/
</style>
