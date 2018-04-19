<template lang="pug">
  div.box
    ul
      li(v-for="(item, index) in list.slice(0,4)")
        img(:src="item.image | img-filter" , @click="toNext(1,index)")
    ul
      li(v-for="(item, index) in list.slice(4,8)", @click="toNext(2,index)")
        img(:src="item.image | img-filter" )
</template>

<script>
  export default {
    name: "hot-button",
    props:{
      list: Array
    },
    methods: {
      toNext (arrType,index) {
        let data = {};
        if (arrType === 2) {
          data = this.list[4+index];
        }else {
          data = this.list[index];
        }
        switch (data.url_type) {
          // 跳外链
          case '143': window.location.href = data.url; break;
          // 跳3级页面 361代表从1级跳3级
          case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: data.id}}); break;
          // 跳商品详情页 取relate_id
          case '141': this.$router.push({ path: '/goodsDetailed', query: { id: data.relate_id }}); break;
          // 跳2级页面
          case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: data.id}}); break;
        }
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
