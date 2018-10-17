<template lang="pug">
  .verify
    transition(name="fade")
      .mask(@touchmove.prevent="", v-show="verifyShow", @click="verifyShow=false")
    transition(name="fade")
      .contentWrapper(@touchmove.prevent="", v-show="verifyShow")
        .content {{content}}
        .btnWrapper
          .btnLeft(v-show="leftText", @click="clickLeft") {{leftText}}
          .btnRight(v-show="rightText", @click="clickRight") {{rightText}}
</template>

<script>
  export default {
    name: "verify",
    props: {
      leftText: {
        type: String
      },
      rightText: {
        type: String
      },
      leftFn: {
        type: Function
      },
      rightFn: {
        type: Function
      },
      content: {
        type: String
      }
    },
    data() {
      return {
        verifyShow: false
      }
    },
    methods: {
      clickLeft() {
        if (this.leftFn) {
          this.leftFn()
        } else {
          this.verifyShow = false
        }
      },
      clickRight() {
        if (this.rightFn) {
          this.rightFn()
        }
        this.verifyShow = false
      }
    }
  }
</script>

<style scoped lang="stylus">
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
    background-color rgba(1,1,1,.5)
    z-index 1000
  }
  .contentWrapper {
    width 8.26rem
    border-radius .13rem
    overflow hidden
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    z-index 1010
    background-color #fff
    .content {
      min-height 2.8rem
      text-align center
      padding 1.22rem .4rem 0
      color #666
      font-size .4rem
      font-weight 400
    }
    .btnWrapper {
      display flex
      height 1.2rem
      border-top 1px solid #d7d7d7
      .btnLeft, .btnRight {
        flex 1
        font-size .42rem
        font-weight 400
        line-height 1.2rem
        text-align center
      }
      .btnLeft {
        color #999
      }
      .btnRight {
        color #fff
        background-color #f70057
      }
    }
  }
</style>
