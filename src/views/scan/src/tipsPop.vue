<template lang="pug">
  .tipsPop
    transition(name="fade")
      .mask(v-show="tipsPopShow", @touchmove.prevent="")
    transition(name="fold")
      .contentWrapper(v-show="tipsPopShow", @touchmove.prevent="")
        scroll.content(:data="data")
          div
            .title 抱歉，本单部分商品库存不足或失效，已为您降到最大库存
            ul
              li(v-for="item in data")
                .left
                  img(:src="item.logo")
                  .meng 库存不足
                .right
                  .name 阿迪达斯三叶草男鞋女鞋2018春史密斯绿尾小白鞋运动鞋板鞋S75187
                  .size 白色; 60ml
                  .desc 库存 0
        .btnWrapper
          span.back 返回购物车
          span.go 继续结算
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "tipsPop",
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        tipsPopShow: false
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  img {
    pointer-events none
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .mask {
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    background-color rgba(1,1,1,.5)
    z-index 1000
  }
  .contentWrapper {
    position fixed
    bottom 0
    left 0
    width 100%
    background-color #fff
    z-index 1010
    .content {
      max-height 10rem
      margin-bottom 1.3rem
      overflow hidden
      .title {
        height 1rem
        line-height 1rem
        color #f70057
        font-size .34rem
        font-weight 400
        text-align center
        border-bottom 1px solid #d7d7d7
      }
      ul {
        li {
          padding .26rem .4rem .26rem .53rem
          border-bottom 1px solid #d7d7d7
          display flex
          position relative
          &:last-child {
            border none
          }
          .left {
            font-size 0
            width 2.13rem
            height 2.13rem
            overflow hidden
            position relative
            img {
              width 100%
            }
            .meng {
              position absolute
              top 0
              left 0
              width 100%
              height 100%
              background-color rgba(0,0,0,.5)
              color #fff
              font-size .32rem
              text-align center
              font-weight 400
              line-height 2.13rem
            }
          }
          .right {
            width calc(100% - 2.45rem)
            margin-left .32rem
            .name {
              overflow : hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break break-all
              font-size .32rem
              font-weight 400
              color #666
              line-height .45rem
            }
            .size {
              color #999
              font-size .32rem
              font-weight 400
              line-height .45rem
              margin-top .13rem
            }
            .desc {
              position absolute
              bottom .26rem
              right .4rem
              color #999
              font-size .32rem
              font-weight 400
            }
          }
        }
      }
    }
    .btnWrapper {
      display flex
      background-color #fff
      height 1.3rem
      position absolute
      bottom 0
      left 0
      width 100%
      border-top 1px solid #d7d7d7
      span {
        flex 1
        font-size .42rem
        text-align center
        line-height 1.3rem
        color #666
        &.go {
          background-color #f70057
          color #fff
        }
      }
    }
  }
</style>
