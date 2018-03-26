<template lang="pug">
    .goodsCardBox
      .title PELLIOT旗舰店
      .main
        img(src="../../../../static/img/1.jpg")
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
    padding: 0 .2rem;
  }
  .title{
    font-weight: 600;
    height: .8rem;
    display: flex;
    align-items: center;
  }
  .main{
    height: 2rem;
    display: flex;
  }
  .main>img{
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
  }
  .info{
    flex-grow: 1;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .price{
    display: flex;
    justify-content: space-between;
  }
  .bottom{
    margin-top: .3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .8rem;
    border-top: solid 1px #eee;
  }
</style>
