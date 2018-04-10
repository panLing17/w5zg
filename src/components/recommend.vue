<template lang="pug">
  .bottomList
    ul.goodsList(:style="{background:background}")
      li(v-for="item in listData" , @click="goGoods(item.gspu_id)")
        img(:src="item.gi_image_url | img-filter")
        .text {{item.goods_name}}
        .price {{item.price | price-filter}}
        .bottom <span>{{item.city}}</span><span>{{item.gi_salenum}}人购买</span>
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .goodsList li img {
    width: 100%;
  }
  .text{
    margin: .1rem;
    height: .8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
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
