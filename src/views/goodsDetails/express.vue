<template lang="pug">
  .express
    transition(name="fade")
      .mask(v-show="expressShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .contentWrapper(v-show="expressShow")
        .title(@click="hide()")
          img(src="./back.png")
        scroll.content(ref="expressScroll")
          ul
            li(v-for="item in addressList", @click="addressChange(item)")
              .info
                .name {{item.ra_name}}
                .phone {{item.ra_phone}}
              .address
                .default(v-if="item.ra_default==='011'") [默认地址]
                .desc {{item.province_name}}{{item.city_name}}{{item.county_name}}{{item.ra_detailed_addr}}
        .btn(@click="$emit('select-city')") 选择城市
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "express",
    props: {
      addressList: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        expressShow: false
      }
    },
    watch:{
      expressShow(val) {
        if (val) {
          setTimeout(()=>{
            this.$refs.expressScroll.refresh()
          }, 520)
        }
      }
    },
    methods: {
      addressChange(item) {
        this.$emit('address-change', item)
        this.hide()
      },
      show() {
        this.expressShow = true
      },
      hide() {
        this.expressShow = false
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
  img {
    pointer-events none
  }
  .mask {
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    z-index 20
  }
  .express {
    .contentWrapper {
      position fixed
      bottom 0
      left 0
      width 100%
      height $height-pop-details
      z-index 30
      background #fff
      .title {
        height 1.33rem
        display flex
        align-items center
        padding 0 .53rem
        border-bottom 1px solid #d7d7d7
        img {
          width .26rem
        }
      }
      .content {
        height calc(100% - 1.33rem)
        overflow hidden
        ul {
          padding 0 .53rem
          li {
            min-height 1.6rem
            display flex
            flex-direction column
            justify-content center
            border-bottom 1px solid #d7d7d7
            line-height .42rem
            &:last-child {
              border none
            }
            .info {
              display flex
              color #333
              font-size .34rem
              .phone {
                margin-left .1rem
              }
            }
            .address {
              margin-top .13rem
              display flex
              font-size .29rem
              .default {
                color #ff0057
                margin-right .1rem
              }
              .desc {
                color #333
              }
            }
          }
        }
      }
      .btn {
        height 1.28rem
        width 100%
        position fixed
        bottom 0
        left 0
        background-color #ff0057
        color #fff
        line-height 1.28rem
        font-size .48rem
        text-align center
        font-weight 500
      }
    }
  }
</style>
