<template lang="pug">
  .activities
    ul.goodsList
      li(v-for="(i,index) in listData.slice(0,4)", @click="toNext(i)")
        img(:src="i.image | gif-filter")
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
      toNext (i) {
        switch (i.url_type) {
          // 跳外链
          case '143': window.location.href = i.url + '?shId=' + i.sh_id; break;
          // 跳3级页面 361代表从1级跳3级
          case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: i.id, title: i.title, shId: i.sh_id}}); break;
          // 跳商品详情页 取relate_id
          case '141': this.$router.push({ path: '/goodsDetailed', query: { id: i.relate_id }}); break;
          // 跳2级页面
          case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: i.id, title: i.title, shId: i.sh_id}}); break;
          // 跳3级页面模板2
          case '149': this.$router.push({ path: '/activity', query: { actId: i.id, title: i.title, parentType: '361', shId: i.sh_id}}); break;
          // 跳三级页面模板2
          case '148': this.$router.push({path: '/twoLevel', query: {parentType: '361',actId: i.id, title: i.title, shId: i.sh_id}}); break;
        }
      }
    }
  }
</script>

<style scoped>
  .activities {
    width: 100%;
    /*height: 6rem;*/
    position: relative;
  }
  .goodsList {
    width: 100%;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    font-size: 0;
  }
  .goodsList li{
    /*float: left;*/
    width: 50%;
    max-height: 3.3rem;
    position: relative;
  }
  .goodsList li img {
    width: 100%;
    /*height: 100%;*/
    pointer-events: none;
  }
  /* 十字线 */
  .columLine {
    position: absolute;
    width: 2px;
    height: 6rem;
    left: 50%;
    top: 0;
    background: #f2f2f2;
  }
  .rowLine {
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    top: 50%;
    background: #f2f2f2;
  }
</style>
