<template lang="pug">
  div.box
    ul
      li(v-for="item in list.slice(0,4)")
        img(:src="item.image | img-filter" , @click="goGoods('特价商品')")
    ul
      li(v-for="item in list.slice(4,8)")
        img(:src="item.image | img-filter" )
</template>

<script>
  export default {
    name: "hot-button",
    props:{
      list: Array
    },
    methods
  :
  {
    goGoods(type)
    {
      this.$router.push({path: '/home/orderList', query: {name: type}})
    }
  }
  }
</script>

<style scoped>
  .box {
    width: 100%;
    height: 3.6rem;
    background: white;
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .box > ul {
    height: 45%;
    display: flex;
  }

  .box > ul > li {
    width: 25%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .box > ul > li > img {
    height: 100%;
  }
</style>
