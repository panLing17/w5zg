<template lang="pug">
  .cardTipsBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close", @touchmove.prevent="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show")
        .content
          .contentTitle 用券说明
          ul.text
            li
              p <span>专柜价:</span>全国此商品正品官方专柜日常销售平均价格（非促销清仓等特殊情况下的价格）。
            li
              p <span>统一零售价:</span>商品吊牌价。
            li
              p <span>现金券购买:</span>节省金额为该产品可使用现金券的最高额度。
            li
              p <span>现金购买:</span>节省金额为此产品以专柜价现金购买时，可返还顾客的通用券金额。
            li
              p <span>通用券购买:</span>节省金额为该产品可使用通用券的所有额度。
</template>

<script>
  export default {
    name: "card-tips",
    props:{
      show: Boolean
    },
    methods: {
      close () {
        this.$emit('close')
      }
    }
  }
</script>

<style scoped>
  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }

  .main {
    background-color: white;
    width: 100%;
    height: 60%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    font-size: .4rem;
    position: relative;
  }
  .title img{
    position: absolute;
    right: .2rem;
    width: .4rem;
  }
  .tab{
    display: flex;
    border-bottom: solid 1px #ccc;
  }
  .tab li{
    width: 3rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .3rem;
    color: rgb(255,128,171);
  }
  .selected {
    color: rgb(245,0,87) !important ;
  }
  .list {
    line-height: .8rem;
    text-align: center;
    float: left;
    width: 3rem;
    height: 10rem;
    overflow-y: scroll;
    /* 兼容safari滑动 */
    -webkit-overflow-scrolling: touch
  }
  .list li{
    /* 兼容safari滑动 */
    min-height: 1px;
  }
  .slider {
    height: 1px;
    width: 3rem;
    margin-top: -1px;
    margin-left: 0;
    background: rgb(245,0,87);
    transition: margin-left .6s;
  }
  /* 描述部分 */
  .content {
    padding: 0 .4rem;
  }
  .content .contentTitle {
    font-size: .4rem;
    color: #000;
    border-bottom: solid 1px #eee;
    padding: .2rem 0;
    text-align: left;
  }
  .text {
    margin-top: .2rem;
  }
  .text li{
    margin-bottom: .5rem;
  }
  .text li span{
    margin-right: .2rem;
    color: #666;
    font-size: .3rem;
  }
  .text li p{
    color: #999;
    font-size: .3rem;
  }
</style>
