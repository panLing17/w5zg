<template lang="pug">
  div
    .goodsCardBox(v-if="$route.query.type === 'shoppingCart'")
      .title {{data.storeName ? data.storeName : data.si_name}}
      .main(v-for="i in data.shoppingCartVOList")
        img(:src="i.logo | img-filter")
        .info
          .text
            .name {{i.gi_name}}
            .spec
              span(v-for="item in i.specVOList") {{item.value}}
          .price
            span {{i.counter_price | price-filter}}
            span X{{i.goods_num}}
      .bottom
        .left(v-if="since === 'true'") {{data.shoppingCartVOList[0].store_address}}
        .right(v-else) 运费: {{data.freight | price-filter}}
    .goodsCardBox(v-else)
      .title {{data.storeName}}
      .main
        img(:src="data.photo | img-filter")
        .info
          .text
            .name {{data.goodsName}}
            .spec
              span(v-for="item in data.spec") {{item.value}}
          .price
            span {{data.price | price-filter}}
            span X{{data.number}}
      .bottom
        .left(v-if="since === 'true'") 门店自提
        .right(v-else) 运费: {{data.freight | price-filter}}
        //.right {{data.storeLocation.province.name}} {{data.storeLocation.city.name}} {{data.storeLocation.store.name}}
          //img(src="../../../assets/img/next@2x.png")
      //.bottom(v-else)
        .left 运费
        .right
          span {{data.freight}}元
          img
</template>

<script>
  export default {
    name: 'goods-card',
    props: {
      data: Object,
      // 根据此判断是否是自提订单
      since: String
    },
    mounted () {
    }
  }
</script>

<style scoped>
  .goodsCardBox {
    background-color: white;
  }

  .title {
    font-weight: 600;
    height: .8rem;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #eee;
    padding: 0 .2rem;
    margin-bottom: .2rem;
  }

  .main {
    height: 2.2rem;
    padding: 0 .2rem .3rem .2rem;
    display: flex;
  }

  .main > img {
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
  }

  .info {
    flex-grow: 1;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .info .text .name {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .price {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .spec {
    color: #999;
  }
  .spec span{
    margin-right: .2rem;
  }
  .price span:first-child{
    font-size: .4rem;
    font-weight: 600;
    color: rgb(246,0,87);
  }
  .bottom {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: .2rem;
    border-top: solid 1px #eee;
  }
  .bottom .left{

  }
  .bottom .right {
    color: #999;
  }
  .bottom .right img{
    height: .4rem;
    margin-left: .2rem;
  }
</style>
