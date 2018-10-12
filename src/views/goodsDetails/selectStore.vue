<template lang="pug">
  .selectStore
    transition(name="fade")
      .mask(v-show="selectStoreShow", :class="{background: from===1}", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .contentWrapper(v-if="selectStoreShow", :style="{bottom: from===0?0:'1.38rem'}")
        .title
          .left(@click="hide")
            img(src="./back2.png")
          .center 专柜提货
          .right(@click="hide")
            img(src="./close.png")
        .content
          scroll.left(ref="storeLeft", :data="data")
            ul
              li(v-for="(item, index) in data", :class="{active: active===index}", @click="active=index") {{item.cityName}}
          scroll.right(ref="storeRight", :data="rightList")
            ul
              li(v-for="item in rightList", @click="storeSelect(item)")
                .name
                  img(src="./address2.png")
                  span {{item.bs_name}}
                .address {{item.bs_address}}
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "selectStore",
    props: {
      from: {
        type: Number,
        default: 0
      },
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        selectStoreShow: false,
        active: 0
      }
    },
    watch: {
      selectStoreShow(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.storeLeft.refresh()
            this.$refs.storeRight.refresh()
          }, 520)
        }
      },
    },
    computed: {
      rightList() {
        return this.data[this.active] ? this.data[this.active].storeList : []
      }
    },
    methods: {
      storeSelect(item) {
        this.$emit('store-select', item)
        this.hide()
      },
      // 当页面刷新时数据初始化
      refreshData() {
        Object.assign(this.$data, this.$options.data())
      },
      show() {
        this.selectStoreShow = true
      },
      hide() {
        this.selectStoreShow = false
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
    z-index 400
    &.background {
      background-color rgba(0,0,0,.5)
    }
  }
  .contentWrapper {
    height $height-pop-details
    position fixed
    left 0
    width 100%
    background-color #fff
    z-index 400
    .title {
      height 1.33rem
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #d7d7d7
      .left {
        padding-left .4rem
      }
      .left, .right {
        font-size 0
        img {
          width .58rem
        }
      }
      .center {
        font-size .48rem
        color #333
        font-weight 400
      }
      .right {
        padding-right .4rem
      }
    }
    .content {
      display flex
      height calc(100% - 1.33rem)
      .left {
        width 26%
        ul {
          li {
            padding 0.34rem 0.53rem
            border-bottom 1px solid #d7d7d7
            font-size .4rem
            color #333
            line-height .56rem
            &:last-child {
              border none
            }
            &.active {
              background-color #f2f2f2
              color #f70057
              border-color #f2f2f2
            }
          }
        }
      }
      .right {
        width 74%
        background #f2f2f2
        ul {
          padding 0 .4rem
          li {
            min-height 2.13rem
            display flex
            flex-direction column
            justify-content center
            border-bottom 1px solid #d7d7d7
            .name {
              font-size 0
              img {
                width .26rem
              }
              span {
                color #333
                font-size .37rem
                line-height .53rem
                word-break break-all
              }
            }
            .address {
              color #666
              font-size .32rem
              line-height .53rem
              word-break break-all
            }
          }
        }
      }
    }
  }
</style>
