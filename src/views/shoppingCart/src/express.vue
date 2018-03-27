<template lang="pug">
  .expressBox
    goods-card.goodsCard(v-for="i in 2", :key="i", @tab="changeType")
    .disableGoodsBox
      .title
        span 失效商品
        .delete 清空失效商品
      disable-goods
</template>

<script>
  import goodsCard from './goodsCard'
  import disableGoods from './disableGoods'
  export default {
    name: 'express',
    data () {
      return {
        flag: false,
        isdefault: false,
        nowTab: 1
      }
    },
    headers:{'X-Requested-with':'XMLHttpRequest'},
    components:{goodsCard, disableGoods},
    mounted () {
    },
    methods: {
      tabChange (num) {
        this.nowTab = num
        if (num === 1) {
          this.$router.push('shopping/express')
        } else {
          this.$router.push('shopping/giveSelf')
        }
      },
      changeType () {
        this.flag = true
        setTimeout(()=>{
          this.flag = false
        },1000)
      }
    }
  }
</script>

<style scoped>
  /* 商品卡片 */
  .goodsCard {
    margin-top: .2rem;
  }
  /* 失效商品 */
  .disableGoodsBox {
    margin-top: .2rem;
  }
  .disableGoodsBox .title{
    width: 100%;
    height: 1rem;
    padding-left: .2rem;
    background-color: white;
    border-bottom: solid 1px #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .disableGoodsBox .title span{
    font-weight: 600;
    font-size: .4rem;
    color: #666;
  }
  .disableGoodsBox .title .delete{
    margin-right: .2rem;
    font-size: .3rem;
    color: rgb(255,128,171);
  }
</style>
