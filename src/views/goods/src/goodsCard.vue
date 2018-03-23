<template lang="pug">
    .goodsCardBox
      .title PELLIOT旗舰店
      .main
        img
        .info
          .text
            .name 法国PELLIOT秋冬产品充分一男女
            .spec
              span 红色
              span L
          .price
            span ￥596.00
            span X1
      .bottom
        .left 运费
        .right
          span 包邮
          img
</template>

<script>
    export default {
        name: "goods-card"
    }
</script>

<style scoped>
  .goodsCardBox{
    background-color: white;
  }
</style>
