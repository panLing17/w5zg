<template lang="pug">
  .wrapper
    transition(name="fade")
      .mask(v-show="checkGoodsShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .content(@touchmove.prevent="", v-if="checkGoodsShow")
        scroll.contentWrapper(:data="data")
          div
            .title 抱歉，本单部分商品库存不足或失效，已为您降到最大库存
            ul.list
              li.item(v-for="item in data", v-if="item.status_flag!=='VALID'")
                .left
                  img(:src="item.logo | img-filter")
                  .model(v-show="item.status_flag==='NO_STORAGE_NUM' || item.status_flag==='GOOD_STATUS_ERROR'") {{item.status_flag==='NO_STORAGE_NUM'?'库存不足':'失效'}}
                .right
                  .name {{item.gi_name}}
                  .size
                    ul
                      li(v-for="spec in item.specVOList") {{spec.gspec_value}};
                  .flag {{item.status_flag==='NO_STORAGE_NUM'?'库存 0':item.status_flag==='GOOD_STATUS_ERROR'?'失效商品':'库存 '+ item.storage_num}}
        .bottom
          .one(v-show="btnType===0", @click="hide()") 返回购物车
          .two(v-show="btnType===1")
            .left(@click="hide()") 返回购物车
            .right(@click="$emit('go-order', false)") 继续结算
          .two(v-show="btnType===2")
            .left(@click="$router.go(-1)") 返回购物车
            .right(@click="$emit('submit-order', false)") 剔除商品
          .one(v-show="btnType===3", @click="$router.go(-1)") 返回购物车
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "checkGoods",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      },
      btnType: {
        type: Number // 0 返回购物车 1 继续结算 2 剔除商品
      }
    },
    data() {
      return {
        checkGoodsShow: false
      }
    },
    methods: {
      show() {
        this.checkGoodsShow = true
      },
      hide() {
        this.checkGoodsShow = false
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
    background-color rgba(0,0,0,.5)
    z-index 400
  }
  .content {
    position fixed
    bottom $height-footer
    left 0
    width 100%
    height 11.33rem
    background-color #fff
    z-index 400
    .contentWrapper {
      height calc(100% - 1.3rem)
      overflow hidden
      .title {
        heihgt 1rem
        line-height 1rem
        text-align center
        color #f70057
        font-size .34rem
        font-weight 400
        border-bottom 1px solid #d7d7d7
      }
      .list {
        .item {
          height 2.6rem
          display flex
          padding .32rem .4rem 0 .53rem
          position relative
          border-bottom 1px solid #d7d7d7
          &:last-child {
            border none
          }
          .left {
            width 2.13rem
            height 2.13rem
            overflow hidden
            border-radius .13rem
            position relative
            img {
              width 100%
            }
            .model {
              position absolute
              top 0
              left 0
              width 100%
              height 100%
              background-color rgba(0,0,0,.5)
              color #fff
              font-size .32rem
              font-weight 400
              text-align center
              line-height 2.13rem
            }
          }
          .right {
            margin-left .32rem
            width calc(100% - 2.45rem)
            .name {
              color #666
              font-size .32rem
              font-weight 400
              line-height .45rem
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .size {
              margin-top .13rem
              ul {
                display flex
                li {
                  line-height .45rem
                  text-overflow ellipsis
                  overflow hidden
                  white-space nowrap
                  color #999
                  font-size .32rem
                  font-weight 400
                }
              }
            }
            .flag {
              position absolute
              right .4rem
              bottom .26rem
              color #999
              font-size .32rem
              font-weight 400
            }
          }
        }
      }
    }
    .bottom {
      position absolute
      bottom 0
      left 0
      width 100%
      height 1.3rem
      text-align center
      line-height 1.3rem
      font-size .42rem
      font-weight 400
      border-top 1px solid #d7d7d7
      .one {
        background-color #f70057
        height 100%
        color #fff
      }
      .two {
        display flex
        .left {
          flex 1
          background-color #fff
          color #666
        }
        .right {
          flex 1
          background-color #f70057
          color #fff
        }
      }
    }
  }
</style>
