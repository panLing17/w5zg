<template lang="pug">
  .tagDescWrapper
    transition(name="fade")
      .mask(v-show="tagDescShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .tagDesc(@click.stop="", @touchmove.prevent="", v-show="tagDescShow")
        .title
          div 标签说明
          div(@click="hide()")
            img(src="./close@2x.png")
        scroll.content(ref="tagDescScroll")
          div.contentWrapper
            p.btnWrapper
              span.redBtn 专柜提货
            p.block 本品牌支持专柜提货(或快递)，请在配送方式中选择专柜自提，专柜将短信通知您提货时间。
            p.block 本品牌各大商场均有售，请您到专柜体验（试穿）后再购买！不满意就退货！
            p.btnWrapper(style="margin-top: .586rem;")
              span.redBtn 专柜比价, 未省钱, 白送
            p.block 本商城商品全部源自线下品牌专柜，90%商品的券后价，比专柜价(折后价)便宜30-70%。<span style="color: #f70057;">您到专柜提货，请对比专柜商品售价</span>，如果您发现专柜价格（非周年庆等特殊活动或恶意行为）低于商城券后价。我们将按商品商城券后价赔付给您（单件商品仅赔付一次）。
            p.block 欢迎您拨打赔付电话：4008-947-999
            p.line
            p.btnWrapper(style="margin-top: .53rem;")
              span.blackBtn 未能自提品牌的声明：
            p.block 因万物直供实付价太过优惠，品牌商担心专柜业绩受到严重冲击，因此，暂不支持专柜提货，确保100%正品。
            p.btnWrapper(style="margin-top: .53rem;")
              span.blackBtn 华为等手机的声明：
            p.block 本商城3C商品，实付价比其他电商优势不大，但我们支持专柜提货。因此，本商品不参与“比价白送”活动，请与其他电商比价后，慎重购买！
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "tagDesc",
    data() {
      return {
        tagDescShow: false
      }
    },
    watch:{
      tagDescShow(val) {
        if (val) {
          setTimeout(()=>{
            this.$refs.tagDescScroll.refresh()
          },520)
        }
      }
    },
    methods: {
      show() {
        this.tagDescShow = true
      },
      hide() {
        this.tagDescShow = false
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .mask {
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    background-color rgba(0,0,0,.5)
    z-index 20
  }
  .tagDesc {
    position fixed
    bottom 0
    left 0
    z-index 30
    width 100%
    height $height-pop-details
    background-color #fff
    .title {
      height 1.25rem
      display flex
      align-items center
      justify-content space-between
      padding 0 .4rem 0 .53rem
      border-bottom 1px solid #d7d7d7
      div {
        &:nth-child(1) {
          color #333
          font-size .48rem
          font-weight 400
        }
        &:nth-child(2) {
          font-size 0
          img {
            width .64rem
          }
        }
      }
    }
    .content {
      height "calc(%s - 1.25rem)" % $height-pop-details
      overflow hidden
      .contentWrapper {
        padding .4rem 0 1.2rem
      }
      .btnWrapper {
        padding 0 .53rem
      }
      .redBtn {
        background-color #ffe8f0
        color #f70057
        border 1px solid #f70057
      }
      .redBtn, .blackBtn  {
        height .533rem
        line-height .533rem
        padding 0 .213rem
        font-size .346rem
        font-weight 400
        border-radius .26rem
      }
      .blackBtn {
        background-color #333
        border 1px solid #333
        color #fff
      }
      .block {
        padding 0 .53rem
        margin-top .32rem
        color #333
        font-weight 400
        font-size .346rem
        word-break break-all
        text-align justify
        ling-height .53rem
      }
      .line {
        height 1px
        width 100%
        background-color #d7d7d7
        margin-top .4rem
      }
    }
  }
</style>
