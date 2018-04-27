<template lang="pug">
  .goodsCardBox
    .title {{data.storeName}}
    .main
      img(:src="data.photo | img-filter")
      .info
        .text
          .name {{data.goodsName}}
          .spec
            span(v-for="item in data.spec") {{item}}
        .price
          span {{data.price | price-filter}}
          span X{{data.number}}
    .bottom(v-if="since === 'true'")
      .left 门店自提
      .right
        span {{data.storeLocation.province.name}} {{data.storeLocation.city.name}} {{data.storeLocation.store.name}}
        //img(src="../../../assets/img/next@2x.png")
    .bottom(v-else)
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
      console.log(this.data)
    }
  }
</script>

<style scoped>
  .goodsCardBox {
    background-color: white;
    padding: 0 .2rem;
  }

  .title {
    font-weight: 600;
    height: .8rem;
    display: flex;
    align-items: center;
  }

  .main {
    height: 2rem;
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
    margin-top: .3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .8rem;
    border-top: solid 1px #eee;
  }
  .bottom .right {
    display: flex;
    align-items: center;
  }
  .bottom .right img{
    height: .4rem;
    margin-left: .2rem;
  }
</style>
