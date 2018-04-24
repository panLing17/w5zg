<template lang="pug">
  .activities
    ul.goodsList
      li(v-for="(i,index) in listData.slice(0,4)", @click="toNext(index)")
        img(:src="i.image | img-filter")
    //.columLine
    //.rowLine
</template>

<script>
  export default {
    name: "activities",
    props: ['listData'],
    data (){
      return{

      }
    },
    mounted (){

    },
    methods: {
      toNext (index) {
        switch (this.listData[index].url_type) {
          // 跳外链
          case '143': window.location.href = this.listData[index].url; break;
          // 跳3级页面 361代表从1级跳3级
          case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: this.listData[index].id, title: this.listData[index].title}}); break;
          // 跳商品详情页 取relate_id
          case '141': this.$router.push({ path: '/goodsDetailed', query: { id: this.listData[index].relate_id }}); break;
          // 跳2级页面
          case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: this.listData[index].id, title: this.listData[index].title}}); break;
        }
      }
    }
  }
</script>

<style scoped>
  .activities {
    width: 100%;
    height: 6rem;
    position: relative;
  }
  .goodsList {
    width: 100%;
    position: relative;
  }
  .goodsList li{
    float: left;
    width: 50%;
    height: 3rem;
    position: relative;
  }
  .goodsList li img {
    width: 100%;
    height: 100%;
  }
  /* 十字线 */
  .columLine {
    position: absolute;
    width: 1px;
    height: 5rem;
    left: 50%;
    top: 50%;
    margin-left: -.5px;
    margin-top: -2.5rem;
    background: #ccc;
  }
  .rowLine {
    position: absolute;
    width: 9rem;
    height: 1px;
    left: 50%;
    top: 50%;
    margin-left: -4.5rem;
    margin-top: -.5px;
    background: #ccc;
  }
</style>
