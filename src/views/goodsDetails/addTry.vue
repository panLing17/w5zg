<template lang="pug">
  .addTry
    transition(name="fade")
      .mask(v-show="addTryShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .contentWrapper(v-show="addTryShow")
        .title
          .left(@click="hide")
            img(src="./back2.png")
          .center 专柜提货
          .right(@click="$router.push('/reservations')")
            img(src="./try.png")
        .content
          scroll.left(ref="tryLeft", :data="data")
            ul
              li(v-for="(item, index) in data", :class="{active: active===index}", @click="active=index") {{item.cityName}}
          scroll.right(ref="tryRight", :data="rightList")
            ul
              li(v-for="item in rightList", @click="addTry(item)")
                .name
                  img(src="./address2.png")
                  span {{item.bs_name}}
                .address {{item.bs_address}}
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "addTry",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      spuId: {
        type: Number
      }
    },
    data() {
      return {
        addTryShow: false,
        active: 0
      }
    },
    watch: {
      addTryShow(newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.tryLeft.refresh()
            this.$refs.tryRight.refresh()
          }, 520)
        }
      }
    },
    computed: {
      rightList() {
        return this.data[this.active] ? this.data[this.active].storeList : []
      }
    },
    methods: {
      addTry(item) {
        let self =this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/addTryOn',
          params: {
            gspuId: this.spuId,
            storeId: item.bs_id
          }
        }).then(function(res){
          if(res) {
            self.$notify({
              content: '预约专柜成功',
              bottom: 1.8
            })
          }
        })
      },
      // 当页面刷新时数据初始化
      refreshData() {
        Object.assign(this.$data, this.$options.data())
      },
      show() {
        this.addTryShow = true
      },
      hide() {
        this.addTryShow = false
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
    z-index 30
  }
  img {
    pointer-events none
  }
  .contentWrapper {
    height $height-pop-details
    position fixed
    bottom 0
    left 0
    width 100%
    background-color #fff
    z-index 30
    .title {
      height 1.33rem
      display flex
      justify-content space-between
      align-items center
      border-bottom 1px solid #d7d7d7
      position relative
      .left {
        padding-left .4rem
        img {
          width .58rem
        }
      }
      .left, .right {
        font-size 0
      }
      .center {
        position absolute
        top 50%
        left 50%
        transform translate(-50%, -50%)
        font-size .48rem
        color #333
        font-weight 400
      }
      .right {
        padding-right .32rem
        img {
          width 2.35rem
        }
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
