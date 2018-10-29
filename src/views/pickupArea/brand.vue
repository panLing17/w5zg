<template lang="pug">
  .brand.mescroll
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
      .storeWrapper
        .desc
          .left 支持专柜提货
          .right
            .text 共有<span>3</span>家专柜
            img(src="./img/more1.png")
        .address
          .left
            img(src="./img/address.png")
          .right
            .name 南京中央商场专柜
            .detail 南京市秦淮区中山南路79号 中央商场二期B座一楼（西区自动扶梯旁）
      .navWrapper
        scroll.navList(ref="nav", :data="navList", :scrollX="true", :scrollY="false", :stopPropagation="true")
          div
            ul(ref="navList")
              li(v-for="(item, index) in navList", :class="{active: index===navActive}", @click="navChange(item, index, $event)") {{item}}
        .arrow(@click="navArrow=!navArrow", ref="arrow")
          img(:src="!navArrow?require('./img/down2.png'):require('./img/up2.png')")
        .navContentWrapper
          transition(name="fold")
            .navContent(v-show="navArrow")
              ul
                li(v-for="(item, index) in navList", :class="{active: index===navActive}", @click="navChange(item, index, $event)") {{item}}
      .goodsListWrapper
        goods-list(:data="goodsList")
      .hotWrapper
        .floor
          img(src="./img/floor.png")
        .listWrapper
          ul.list
            li.item(v-for="item in hotList")
              .top
                .left
                  img()
                .right
                  .name 雅诗兰黛/Estée Lauder雅诗兰黛/Estée Lauder雅诗兰黛/Estée Lauder雅诗兰黛/Estée Lauder
                  .country
                    img
                    span 美国
                .more
                  span 进入品牌
                  img(src="./img/more2.png")
              .bottom
                ul
                  li(v-for="item in [1,1,1,1]")
                    .logo
                      img
                    .name 魅可MAC子弹头口红15魅可MAC子弹头口红15色
                    .price ￥99999.99
</template>

<script>
  import Banner from 'components/custom/banner/banner.vue'
  import Scroll from 'components/scroll'
  import GoodsList from 'components/goodsList'
  export default {
    name: "brand",
    data() {
      return {
        brandDescShowAll: false,
        brandDescInitHeight: 'auto',
        brandDescMaxHeight: 0,
        navList: ['全部',1,1,1,1,1,1,1,1,1,1,1,1,'胡德夫胡德夫好多分'],
        navArrow: false,
        navActive: 0,
        screenWidth: document.documentElement.offsetWidth || document.body.clientWidth,
        goodsList: [],
        hotList: [1,1,1,1,1,1,1,1,1,1,1]
      }
    },
    mounted() {
      this.initBrandDescHeight()
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
      },
      navChange(item, index, e) {
        if (this.navActive === index) {
          return
        }
        this.navActive = index
        let liWidth = this.$refs.navList.children[index].offsetWidth
        let arrowWidth = this.$refs.arrow.offsetWidth
        if (e.clientX <= (this.screenWidth / 2)) {
          // 代表左边
          if (e.clientX <= liWidth) {
            this.$refs.nav.scrollToElement(this.$refs.navList.children[Math.max(0,index-1)], 300)
          }
        } else {
          // 代表右边
          if ((this.screenWidth - e.clientX) <= (liWidth + arrowWidth)) {
            let pos = Math.min(this.$refs.navList.children.length-1, index+1)
            let totalWidth = 0;
            for (let i = 0; i<= pos; i++) {
              totalWidth += this.$refs.navList.children[i].offsetWidth
            }
            totalWidth = totalWidth + arrowWidth -this.screenWidth
            this.$refs.nav.scrollTo(-totalWidth, 0, 300)
          }
        }
      }
    },
    components: {
      Banner,
      Scroll,
      GoodsList
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
  .storeWrapper {
    border-top .16rem solid #f2f2f2
    .desc {
      display flex
      justify-content space-between
      align-items center
      padding 0 .4rem
      height 1.14rem
      .left {
        display flex
        align-items center
        color #666
        font-size .32rem
        font-weight 400
        padding 0 .16rem
        height .64rem
        border 1px solid #ccc
      }
      .right {
        display flex
        align-items center
        font-size 0
        .text {
          font-size .32rem
          color #666
          font-weight 400
          span {
            color #f70057
          }
        }
        img {
          width .32rem
        }
      }
    }
    .address {
      display flex
      padding 0 .13rem .26rem
      .left {
        font-size 0
        img {
          margin-top .1rem
          width .32rem
        }
      }
      .right {
        margin-left .1rem
        .name {
          color #666
          font-size .37rem
          font-weight 500
        }
        .detail {
          margin-top .13rem
          color #999
          font-size .32rem
          font-weight 400
        }
      }
    }
  }
  .navWrapper {
    border-top .16rem solid #f2f2f2
    position relative
    .navList {
      width calc(100% - .96rem)
      overflow hidden
      height .96rem
      div {
        position absolute
        ul {
          height .96rem
          white-space nowrap
          li {
            display inline-block
            padding 0 .32rem
            height 100%
            line-height .96rem
            color #333
            font-size .37rem
            font-weight 400
            &.active {
              background-color #FF387E
              color #fff
            }
          }
        }
      }
    }
    .arrow {
      position absolute
      top 0
      right 0
      font-size 0
      img {
        width .96rem
      }
    }
    .navContentWrapper {
      position absolute
      top .96rem
      left 0
      overflow hidden
      z-index 10
    }
    .navContent {
      width 100%
      background-color #fff
      border-top 1px solid #ccc
      ul {
        display flex
        flex-wrap wrap
        li {
          width 25%
          height .96rem
          line-height .96rem
          color #333
          font-size .37rem
          font-weight 400
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
          flex-wrap nowrap
          padding 0 .2rem
          text-align center
          &.active {
            color #f70057
          }
        }
      }
    }
  }
  .goodsList {
    border-top .13rem solid #f2f2f2
  }
  .hotWrapper {
    .floor {
      font-size 0
      display flex
      align-items center
      justify-content center
      height .96rem
      img {
        width 3.2rem
      }
    }
    .listWrapper {
      .list {
        .item {
          padding-bottom .4rem
          border-bottom .16rem solid #f2f2f2
          &:last-child{
            border-bottom none
          }
          .top {
            padding .26rem .4rem
            position relative
            display flex
            .left {
              width 1.7rem
              height 1.7rem
              border-radius .13rem
              border 1px solid #ccc
              overflow hidden
              font-size 0
              background-color #65aadd
              img {
                width 100%
              }
            }
            .right {
              margin-left .34rem
              width calc(100% - 2.04rem)
              .name {
                margin-top .26rem
                color #333
                font-size .37rem
                font-weight bold
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
              }
              .country {
                margin-top .16rem
                display flex
                font-szie 0
                align-items center
                img {
                  width .64rem
                  height .64rem
                  border-radius 50%
                  background-color #65aadd
                }
                span {
                  margin-left .13rem
                  font-size .32rem
                  color #666
                  font-weight 400
                }
              }
            }
            .more {
              position absolute
              right .4rem
              bottom .61rem
              display flex
              align-items center
              font-size 0
              span {
                font-size .32rem
                font-weight 400
                color #666
              }
              img {
                width .18rem
              }
            }
          }
          .bottom {
            ul {
              display flex
              justify-content space-between
              padding 0 .4rem
              li {
                .logo {
                  width 2.13rem
                  height 2.13rem
                  overflow hidden
                  font-size 0
                  background-color #65aadd
                  img {
                    width 100%
                  }
                }
                .name {
                  margin-top .26rem
                  width 2.13rem
                  overflow : hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  font-size .32rem
                  color #333
                  font-weight 500
                }
                .price {
                  margin-top .21rem
                  font-size .32rem
                  color #f70057
                  font-weight 500
                  width 2.13rem
                  overflow hidden
                  text-overflow ellipsis
                  white-space nowrap
                }
              }
            }
          }
        }
      }
    }
  }
  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0,-100%,0);
  }
</style>
