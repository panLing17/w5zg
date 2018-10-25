<template lang="pug">
  .brand
    .header
      .back
        img(src="./img/back.png")
      .title 雅诗兰黛
    .contentWrapper
      banner(:data="[1,1,1,1]")
      .brandFlagWrapper
        .brandFlag
          .left
            img
          .right
            .name 雅诗兰黛/Estée Lauder雅诗兰黛/Estée Lauder雅诗兰黛/Estée Lauder雅诗兰黛/Estée Lauder
            .country
              img
              span 美国
        .brandDesc(ref="brandDesc", :style="{height: !brandDescShowAll?brandDescInitHeight:brandDescMaxHeight}") 二十世纪60年代雅诗兰黛开始拓展国际市场，先后进入英国、dfdfdfdfdfdf加拿大、澳大利亚、德国、法国和日本。雅诗兰黛的专柜大多二十世纪60年代雅诗兰黛开始拓展国际市场，先后进入英国、dfdfdfdfdfdf加拿大、澳大利亚、德国、法国和日本。雅诗兰黛的专柜大多
        .openMore(v-show="brandDescMaxHeight!==0", @click="brandDescShowAll=!brandDescShowAll")
          .left
          .center
            span {{!brandDescShowAll?'查看更多品牌信息':'向上收起'}}
            img(:src="!brandDescShowAll?require('./img/down1.png'):require('./img/up1.png')")
          .right


</template>

<script>
  import Banner from 'components/custom/banner/banner.vue'
  export default {
    name: "brand",
    data() {
      return {
        brandDescShowAll: false,
        brandDescInitHeight: 'auto',
        brandDescMaxHeight: 0
      }
    },
    mounted() {

    },
    methods: {
      initBrandDescHeight() {
        this.$nextTick(()=>{
          let lineHeight = parseFloat(this.$method.getStyle(this.$refs.brandDesc, 'lineHeight'))
          let height = parseFloat(this.$method.getStyle(this.$refs.brandDesc, 'height'))
          if (height / lineHeight > 2) {
            this.brandDescInitHeight = lineHeight * 2 + 'px'
            this.brandDescMaxHeight = height + 'px'
          }
        })
      }
    },
    components: {
      Banner
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  img {
    pointer-events none
  }
  .brand {
    position absolute
    top 0
    left 0
    width 100%
    height 100vh
    background-color #fff
  }
  .header {
    position fixed
    top 0
    left 0
    width 100%
    height $height-header
    z-index 10
    background-color #fff
    .back {
      position absolute
      left 0
      top 0
      padding .33rem .4rem
      img {
        width .64rem
      }
    }
    .title {
      width 100%
      height 100%
      text-align center
      display flex
      align-items center
      justify-content center
      color #333
      font-weight 500
      font-size .48rem
    }
  }
  .contentWrapper {
    margin-top $height-header
  }
  .brandFlag {
    position relative
    width 100%
    display flex
    min-height 2rem
    padding 0 .4rem 0 3rem
    .left {
      font-size 0
      width 2.3rem
      height 2.3rem
      border 1px solid #ccc
      border-radius .13rem
      overflow hidden
      background-color #c4e1e1
      position absolute
      left .4rem
      top -.53rem
      img {
        width 100%
      }
    }
    .right {
      width 100%
      .name {
        margin-top .32rem
        font-size .37rem
        color #333
        font-weight bold
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      }
      .country {
        display flex
        align-items center
        font-size 0
        margin-top .13rem
        img {
          width .64rem
          height .64rem
          border-radius 50%
          overflow hidden
          background-color #c4e1e1
        }
        span {
          font-size .32rem
          font-weight 400
          color #666
          margin-left .13rem
        }
      }
    }
  }
  .brandDesc {
    padding 0 .4rem
    text-align justify
    word-break break-all
    font-size 12px
    line-height 18px
    color #666
    font-weight 400
    overflow hidden
    transition all .5s
  }
  .openMore {
    display flex
    justify-content center
    align-items center
    height .74rem
    margin-top .21rem
    .left, .right {
      width 1.8rem
      height 1px
      background-color #ececec
    }
    .center {
      font-size 0
      margin 0 .5rem
      display flex
      align-items center
      span {
        color #666
        font-size .32rem
        font-weight 500
      }
      img {
        margin-left .1rem
        width .26rem
      }
    }
  }
</style>
