<template lang="pug">
  .refundReturn
    nav-bar
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{title}}
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
    .goodsStatus(@click="goodsTypes()" v-if="shows")
      ul
        li 货物状态
        li 
          span 仅退款
          img(src="../../../../../assets/img/right.png")
    .returnType(@click="returnTypes()" v-else="shows")
      ul
        li 退货方式
        li 
          span 快递退货
          img(src="../../../../../assets/img/right.png")      
    .refundReason(@click="reason1()" v-if="shows")
      ul
        li 退款原因
        li
          img(src="../../../../../assets/img/right.png")
    .refundReason(@click="reason2()" v-else="shows")
      ul
        li 退货原因
        li
          img(src="../../../../../assets/img/right.png")      
    .amount
      .top
        ul
          li.num 数量
          li.addSub
            .sub -
            .input 1
            .add +
      .bottom
        ul
          li.money
            span 退款金额:
            strong ￥200.00
          li.max
            span 最多:
            span ￥200.00，
            span 含运费
            span ￥0.00
    .refundExplain
      ul
        li 退款说明:
        li 
          input(placeholder="请输入···")          
    .upload
    .submit(@click="$router.push('/my')") 提交
    goodsType(:show="statusFlag", @selectType="", @close="closeGoodsType()")
    reason1(:show="reasonFlag1", @close="closeReason1()")
    reason2(:show="reasonFlag2", @close="closeReason2()")
    returnStyle(:show="typeFlag" @close="closeType()")
</template>
<script>
  import myGoods from '../../../../../assets/img/my_goods.png'
  import goodsType from './selectGoodsStatus'
  import reason1 from './returnReasonOnly'
  import reason2 from './returnReason'
  import returnStyle from './returnStyle'
  export default {
    name: 'refundReturn',
    components:{goodsType,reason1,reason2,returnStyle},
    data () {
      return {
        shows:true,
        typeFlag:false,
        reasonFlag1:false,
        reasonFlag2:false,
        statusFlag:false,
        titleNum: this.$route.query.routeParams,
        title:"",
        goodsList:[
          {
            imgSrc:myGoods,
            words:"法国PELLIOT秋冬新品户外冲锋衣男",
            color:"黄色",
            size:"L",
            amount:1,
            checked:false
          }
        ]  
      }
    },
    mounted () {
      this.titles();
    },
    methods: {
      titles(){
        if (this.titleNum == 1) {
          this.title = "申请退款";
          this.shows = true;
        }
        if (this.titleNum == 2) {
          this.title = "申请退款退货";
          this.shows = false;
        }
      },

      goodsTypes(){
        this.statusFlag = true;
      },
      closeGoodsType(){
        this.statusFlag = false;
      },
      reason1(){
        this.reasonFlag1 = true;
      },
      closeReason1(){
        this.reasonFlag1 = false;
      },
      reason2(){
        this.reasonFlag2 = true;
      },
      closeReason2(){
        this.reasonFlag2 = false;
      },
      returnTypes(){
        this.typeFlag = true;
      },
      closeType(){
        this.typeFlag = false;
      }
    }
  }
</script>

<style scoped>
  .refundReturn{
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 102;
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
  /*货物状态--开始*/
  .goodsStatus,
  .refundReason,
  .refundExplain,
  .returnType{
    height: 1.2rem;
    background-color: #fff;
    margin-top: .2rem;
    font-size: .4rem;
    line-height: 1.2rem;
    padding-left: .3rem;
  }
  .goodsStatus ul,
  .refundReason ul,
  .returnType ul{
    display: flex;
    justify-content: space-between;
  }
  .goodsStatus ul li img,
  .refundReason ul li img,
  .returnType ul li img{
    width: .6rem;
    vertical-align: middle;
    margin-top: -.1rem;
  }
  /*货物状态--结束*/
  /*数量--开始*/
  .amount{
    margin-top: .2rem;
    background-color: #fff;
    padding: .2rem .3rem .4rem;
  }
  .amount .top{
    border-bottom: 1px solid rgb(242,242,242);
    padding-bottom: .2rem;
  }
  .amount .top ul{
    display: flex;
    justify-content: space-between;
    font-size: .4rem;
  }
  .amount .top ul li.num{
    line-height: 1rem;
  }
  .amount .top ul li.addSub{
    width: 2.5rem;
    height: 1rem;
    border: 1px solid rgb(153,153,153);
    border-radius: .3rem;
    display: flex;
    justify-content: space-between;
  }
  .amount .top ul li.addSub .sub,
  .amount .top ul li.addSub .add{
    width: .6rem;
    font-size: 1rem;
    text-align: center;
    line-height: .9rem;
  }
  .amount .top ul li.addSub .add{
    font-size: .6rem;
    line-height: 1rem;
  }
  .amount .top ul li.addSub .input{
    width: 1.3rem;
    text-align: center;
    line-height: 1rem;
  }
  .amount .bottom{
    padding-top: .3rem;
  }
  .amount .bottom li.money{
    font-size: .35rem;
  }
  .amount .bottom li.money strong{
    font-weight: 400;
    color: rgb(244,0,87);
  }
  .amount .bottom li.max{
    color: rgb(153,153,153);
    margin-top: .1rem;
  }
  .amount .bottom li.max span{
    margin-right: .1rem;
  }
  /*数量--结束*/
  /*退款说明--开始*/
  .refundExplain ul{
    display: flex;
  }
  .refundExplain ul input{
    outline: none;
    font-size: .4rem;
    text-indent: .1rem;
    border: 0;
  }
  /*退款说明--结束*/
  /*提交--开始*/
  .submit{
    width: 6.5rem;
    height: 1.2rem;
    background-color: rgb(245,0,87);
    border-radius: 1.2rem;
    margin: 1.6rem auto;
    text-align: center;
    line-height: 1.2rem;
    color: #fff;
    font-size: .4rem;
  }
  /*提交--结束*/
</style>
