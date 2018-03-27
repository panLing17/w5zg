<template lang="pug">
  .bottomList
    ul.goodsList(:style="{background:background}")
      li(v-for="item in listData" , @click="goGoods(item.goodsId)")
        img(src="../assets/img/my_goods.png")
        .text 商品拆散你都没法跟你阿萨德你看啥都能扩大萨德你看
        .price ￥516.22
        .bottom <span>江苏南京</span><span>2555人购买</span>
</template>

<script>
    export default {
        name: "bottom-list",
        props: ['listData','background'],
        methods:{
          goGoods (id) {
            this.$router.push({path:'/goodsDetailed',query:{id:id}})
          }
        }
    }
</script>

<style scoped>
  .goodsList {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: .2rem;
    background: rgb(242,242,242);
  }
  .goodsList li{
    border: solid 1px #ccc;
    border-radius: 5px;
    overflow: hidden;
    width: 49%;
    float: left;
    margin-bottom: .2rem;
  }
  .goodsList li img {
    width: 100%;
  }
  .text{
    margin: .1rem;
  }
  .price{
    margin: .2rem .1rem;
    color: rgb(246,0,87);
    font-weight: 600;
    font-size: .4rem;
  }
  .bottom{
    margin: .1rem;
    display: flex;
    justify-content: space-between;
    color: #aaaaaa;
  }
</style>
