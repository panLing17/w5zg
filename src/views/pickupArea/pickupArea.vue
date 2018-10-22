<template lang="pug">
  .mescroll#areaMescroll
    .header
      .back
        img(src="./img/back.png")
      .title
        img(src="./img/title.png")
    .searchWrapper
      .left
        input(type="text", :placeholder="searchDefaultText", v-model="query")
        img.search(src="./img/search.png")
        img.del(src="./img/del.png", v-show="query.length>0")
      .right 搜索
    .fixedContent
      .tab
        .left(:class="{active: tabActive===0}") 品牌
        .right(:class="{active: tabActive===1}") 商圈
      .brand(v-show="tabActive===0")
        ul
          li(v-for="(item, index) in brandList", :class="{'margin-top': index>3}")
            .logo
              img
            .name {{item}}
          li.last
            span 全部<br/>品牌
            img(src="./img/more.png")
        .line1
        .line2
        .line3
        .line4
      .area(v-show="tabActive===1")
</template>

<script>
  export default {
    name: "pickupArea",
    data() {
      return {
        searchDefaultText: '雅诗兰黛',
        query: '',
        tabActive: 0,
        brandList: [1,1,1,1,1,1,1]
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .mescroll {
    background-color #fff
  }
  .header {
    position relative
    height $height-header
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
      line-height $height-header
      img {
        width 3.2rem
      }
    }
  }
  .searchWrapper {
    display flex
    height 1.17rem
    .left {
      flex 1
      padding-left .4rem
      position relative
      display flex
      align-items center
      input {
        width 100%
        height .8rem
        border 1px solid #ececec
        outline none
        border-radius .4rem
        background-color #f6f6f6
        padding-left .96rem
        color #777
        font-size .29rem
        font-weight 400
      }
      .search {
        position absolute
        left .66rem
        top 50%
        transform translateY(-50%)
        width .42rem
      }
      .del {
        position absolute
        right .18rem
        top 50%
        transform translateY(-50%)
        width .58rem
      }
    }
    .right {
      width 1.5rem
      font-size .37rem
      color #777
      font-weight 500
      text-align center
      line-height 1.17rem
    }
  }
  .fixedContent {
    border-top .16rem solid #f2f2f2
    .tab {
      display flex
      height 1rem
      .left, .right {
        padding 0 .4rem 0 .32rem
        line-height 1rem
        font-size .37rem
        font-weight 500
        color #333
        position relative
        &.active {
          color #f70057
        }
      }
      .left.active, .right.active {
        &:before {
          content ''
          display block
          height .05rem
          width .7rem
          background-color #f70057
          position absolute
          left 50%
          bottom .13rem
          transform translateX(-50%)
        }
      }
      .left {
        &:after {
          content ''
          display block
          height .37rem
          width .05rem
          background-color #979797
          position absolute
          right 0
          top 50%
          transform translateY(-50%)
        }
      }
      .right {}
    }
    .brand {
      position relative
      ul {
        padding 0 .5rem
        display flex
        flex-wrap wrap
        li {
          display flex
          flex-direction column
          font-size 0
          margin-right .32rem
          margin-bottom .26rem
          &:nth-child(4n) {
            margin-right 0
          }
          &.margin-top {
            margin-top .13rem
          }
          .logo {
            width 2rem
            height 2rem
            overflow hidden
            background-color orange
          }
          img {
            width 2rem
          }
          .name {
            margin-top .13rem
            font-size .32rem
            font-weight 400
            color #666
            line-height 1
            text-align center
          }
          &.last {
            width 2rem
            height 2rem
            display flex
            align-items center
            flex-direction row
            padding-left .58rem
            span {
              font-size .37rem
              font-weight 400
              color #333
            }
            img {
              margin-left .13rem
              width .32rem
            }
          }
        }
      }
      .line1 {
        width 90%
        height .05rem
        background-color #ececec
        position absolute
        top 48%
        left 50%
        transform translate(-50%, -80%)
      }
      .line2, .line3, .line4 {
        height 4.9rem
        width .05rem
        background-color #ececec
        position absolute
        top 0
      }
      .line2 {
        left 2.65rem
      }
      .line3 {
        left 4.95rem
      }
      .line4 {
        left 7.3rem
      }
    }
  }
</style>
