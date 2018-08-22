<template lang="pug">
  .cardTipsBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-show="show", @click="close", @touchmove.prevent="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-show="show")
        .content.mescroll(id="tagTips")
          .contentTitle 标签说明
          ul.text
            li
              p <h2 class="pink">专柜提货:</h2><br/>本品牌支持专柜提货(或快递)，请在配送方式中选择专柜自提，专柜将短信通知您提货时间。 <br/><br/>本品牌各大商场均有售，请您到专柜体验（试穿）后再购买！不满意就退货！
            li
              p <h2 class="pink">专柜比价，未省钱，白送:</h2><br/>本商城 全部源自线下品牌专柜，90%商品的券后价，比专柜价（折后价）便宜30-70%。您到专柜提货，请对比专柜商品售价，如果您发现专柜价格（非周年庆等特殊活动或恶意行为）低于商城券后价。我们将按商品商城券后价赔付给您（单件商品仅赔付一次）。<br/><br/>欢迎您拨打赔付电话：4008-947-999
          ul.text
            li
              p <h2 class="black">未能自提品牌的声明:</h2><br/>因万物直供实付价太过优惠，品牌商担心专柜业绩受到严重冲击，因此，暂不支持专柜提货，确保100%正品。
            //li
              p <h2 class="black">非南京专柜提货的声明:</h2><br/>因万物直供实付价太过优惠，品牌商担心专柜业绩受到严重冲击，因此，暂不支持南京专柜提货，可以在南京专柜体验（试穿）。其他城市有专柜可以提货。我们正在努力，使更多专柜支持提货，敬请谅解！
            li
              p <h2 class="black">华为等手机的声明:</h2><br/>本商城3C商品，实付价比其他电商优势不大，但我们支持专柜提货，因此，本商品不参与“比价白送”活动，请与其他电商比价后，慎重购买！
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
          this.$mescrollInt("tagTips",this.upCallback)
        } else {
          this.mescroll.hideTopBtn();
          this.mescroll.destroy()
        }
      }
    },
    mounted () {

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
    overflow-y: scroll;
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
    padding: .2rem 0;
    text-align: left;
  }
  .text {
    border-top: solid 1px #eee;
    padding-top: .2rem;
  }
  .text li{
    margin-bottom: .5rem;
  }
  .text li h2{
    font-weight: 500;
    display: inline-block;
    margin-right: .2rem;
    font-size: .3rem;
    padding: 1px 5px;
    border-radius: 1rem;
    margin-bottom: .1rem;
  }
  .pink{
    border: solid 1px rgb(230,13,92);
    background: rgba(230,13,92,.3);
    color: rgb(230,13,92);
  }
  .black{
    background: black;
    color: white;
  }
  .text li p{
    color: #999;
    font-size: .3rem;
    line-height: .5rem;
  }
</style>
