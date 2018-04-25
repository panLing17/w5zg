<template lang="pug">
  div.box
    ul
      li(v-for="(item, index) in list.slice(0,4)")
        img(:src="item.image | img-filter" , @click="toNext(1,index)")
        span {{item.title}}
    ul
      li(v-for="(item, index) in list.slice(4,8)", @click="toNext(2,index)")
        img(:src="item.image | img-filter" )
        span {{item.title}}
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
          case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: data.id, title: data.title}}); break;
          // 跳商品详情页 取relate_id
          case '141': this.$router.push({ path: '/goodsDetailed', query: { id: data.relate_id }}); break;
          // 跳2级页面
          case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: data.id, title: data.title}}); break;
        }
      }
    }
  }
</script>

<style scoped>
  .box {
    width: 100%;
    height: 4.2rem;
    background: white;
    padding: .2rem 0;
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
    width: 1rem;
  }
  .box > ul > li > span {
    margin-top: .2rem;
    font-size: .32rem;
    font-style: normal;
    line-height: 1;
  }
</style>
