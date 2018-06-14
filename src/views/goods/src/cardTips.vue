<template lang="pug">
  .cardTipsBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close", @touchmove.prevent="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-show="show")
        .content.mescroll#cartTips
          .contentTitle 用券说明
          .cancel(@click="close")
          ul.text
            li
              p 实付价：使用足额现金券或现金券不足返还通用券后的实际支付价格。
            li
              p 统一零售价:本商品全国统一零售价。
            li
              p 打折后专柜价：本商品在南京地区专柜打折后的促销价（非商场店庆等特殊活动价）。
            li
              p 专柜价：本商品在南京地区专柜实际售价（非商场店庆等特殊活动价）。
          ul.text.second
            li
              .btn
                span.dec 现金券购买
                span.price 省XX元
              .info 现金券购买，抵用XX元，实付XX元(或支付通用券XX元)
            li
              .btn
                span.dec 专柜价购买
                span.price 返现XXX元
              .info 专柜价购买XXX元，返XX元通用券
              .info 通用券180天后提现，因此，等同现金！
            li
              .btn
                span.dec 通用券购买
                span.price 返现XXX元
              .info 通用券购买XXX元，返XX元通用券；
          .bottom 顾客凭通用券购买本商城所有商品，无需贴现！！！而且，确认收货后再返30-60%通用券，通用券180天后提现，因此，等同现金！

</template>

<script>
  export default {
    name: "card-tips",
    props:{
      show: Boolean
    },
    watch:{
      show (val) {
        if (val) {
          // mescroll初始化
          this.$mescrollInt("cartTips",this.upCallback)
        } else {
          this.mescroll.hideTopBtn();
          this.mescroll.destroy()
        }
      }
    },
    methods: {
      upCallback: function(page) {
        let self = this;
        self.mescroll.endSuccess(1)
      },
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
    overflow: auto;
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
    position: relative;
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
    /*padding-bottom: .5rem;*/
    border-bottom: solid 1px #eee;
    color: #333;
  }
  .text.second {
    padding-top: .3rem;
  }
  .text li{
    margin-bottom: .5rem;
  }
  .text li p{
    color: #333;
    font-size: .3rem;
    line-height: .5rem;
  }
  .cancel {
    width: .8rem;
    height: .8rem;
    position: absolute;
    right: 0;
    top: 0;
    background: url("../../../assets/img/cancle@3x.png") no-repeat center center;
    background-size: .4rem .4rem;
  }
  .btn {
    width: 3.5rem;
    height: .53rem;
    line-height: .53rem;
    border: 1px solid rgb(247,0,87);
    background: #ffe9f0;
    text-align: center;
    margin-bottom: .2rem;
  }
  .dec {
    color: rgb(247,0,87);
    margin-right: .2rem;
  }
  .bottom {
    padding:.2rem 0 .5rem;
  }
</style>
