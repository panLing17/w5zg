<template lang="pug">
  .activities
    ul.goodsList
      li(v-for="i in listData.slice(0,4)")
        img(:src="i.image | img-filter")
    .columLine
    .rowLine
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
