<template lang="pug">
    div.box
      ul
        li
          img(src="../../../assets/img/hotButton1.jpg" , @click="goGoods('特价商品')")
        li
          img(src="../../../assets/img/hotButton1.jpg" , @click="goGoods('热门商品')")
        li
          img(src="../../../assets/img/hotButton1.jpg" , @click="goGoods('时令商品')")
        li
          img(src="../../../assets/img/hotButton1.jpg" , @click="goGoods('限时抢购')")
      ul
        li
          img(src="../../../assets/img/hotButton1.jpg" )
        li
          img(src="../../../assets/img/hotButton1.jpg" )
        li
          img(src="../../../assets/img/hotButton1.jpg" )
        li
          img(src="../../../assets/img/hotButton1.jpg" )
</template>

<script>
    export default {
        name: "hot-button",
        methods:{
          goGoods(type){
            this.$router.push({path:'/home/orderList',query:{name:type}})
          }
        }
    }
</script>

<style scoped>
  .box{
    width: 100%;
    height: 3.6rem;
    background: white;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .box>ul{
    height: 45%;
    display: flex;
  }
  .box>ul>li{
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .box>ul>li>img{
    height: 100%;
  }
</style>
