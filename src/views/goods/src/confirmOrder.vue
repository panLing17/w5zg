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
    goods-card.goods-card
</template>

<script>
  import goodsCard from './goodsCard'
  export default {
    name: 'confirm-order',
    data () {
      return {

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
  .goods-card{
    margin-top: .2rem;
  }
</style>
