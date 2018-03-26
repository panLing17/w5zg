<template lang="pug">
  .confirmOrderBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 商品
      .topRight(slot="right")
    .title
      .stud 联系人
    .location
      .content
        .nameAndMobile
          p 收件人：老张
          p 手机号：13655526262
        .giveGoodsLocation
          .label 收货地址
          .info 江苏南京软件园，4002-1一楼四厅588室 江苏南京软件园，4002-1一楼四厅588室
      .icon
        img(src="../../../assets/img/next@2x.png")
    goods-card.goods-card(v-for="i in 2", :key="i")
    .allPrice
      .goodsNum 共计4件商品
      .price
        span 合计
        p ￥596.00
    ul.switchList
      li
        .left 网金卡
        .right
          span 已抵扣100.00
          toggle-button(v-model="myDataVariable", color="rgb(244,0,87)")
      li
        .left 通用卷 <span>您有通用卷500，可抵扣100</span>
        .right
          toggle-button(v-model="myDataVariable", color="rgb(244,0,87)")
    .submit
      .left 实付：￥500.00
      .right 提交订单
</template>

<script>
  import goodsCard from './goodsCard'
  export default {
    name: 'confirm-order',
    data () {
      return {
        myDataVariable:false
      }
    },
    components:{goodsCard},
    methods:{

    }
  }
</script>

<style scoped>
  .confirmOrderBox {
    background:rgb(242,242,242);
    padding-bottom: 2rem;
  }
  .title{
    background: white;
  }
  .stud {
    width: 1.9rem;
    height: .8rem;
    padding-left: .2rem;
    background-color: rgb(244,0,87);
    color: white;
    display: flex;
    align-items: center;
    border-bottom-right-radius: .3rem;
  }
  .location{
    padding: .2rem;
    display: flex;
    background-color: white;
    justify-content: space-between;
  }
  .location .content {
    flex-grow: 1;
  }
  .nameAndMobile{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .location .icon{
    width: 1rem;
  }
  .giveGoodsLocation{
    display: flex;
    margin-top: .2rem;
  }
  .giveGoodsLocation .label{
    width: 1.5rem;
  }
  .giveGoodsLocation .info{
    width: 0;
    flex-grow: 1;
  }
  .icon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .icon img{
    height: .4rem;
  }
  /* 商品卡片部分 */
  .goods-card {
    margin-top: .2rem;
  }
  /* 合计部分 */
  .allPrice {
    height: 1.2rem;
    padding-right: .2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .goodsNum{
    margin-right: .3rem;
    color: #aaa;
  }
  .price {
    display: flex;
    align-items: center;
  }
  .price span {
    margin-right: .1rem;
  }
  .price p {
    font-weight: 600;
    font-size: .45rem;
    color: rgb(244,0,87);
  }
  /* 开关列表 */
  .switchList {
    background: white;
  }
  .switchList li{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem;
    height: 1.2rem;
    border-bottom: solid 1px #ddd;
  }
  .switchList .left {
    font-size: .35rem;
    font-weight: 600;
  }
  .switchList .left span{
    color: #aaa;
    font-weight: 500;
    font-size: .3rem;
    margin-left: .2rem;
  }
  .switchList .right{
    color: rgb(244,0,87);
    display: flex;
    align-items: center;
  }
  .switchList .right span{
    margin-right: .2rem;
  }
  /* 提交 */
  .submit {

  }
</style>
