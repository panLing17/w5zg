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
    .customWrapper(ref="customWrapper")
    .fixedContent
      .tab
        .left(:class="{active: tabActive===0}", @click="tabActive=0") 品牌
        .right(:class="{active: tabActive===1}", @click="tabActive=1") 商圈
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
        ul(ref="areaUl")
          li(v-for="(item, index) in areaList", ref="areaLi")
            img
            .name {{item}}
        .openMore(v-show="areaList.length>8", @click="toggleArea")
          img(:src="areaShowAll?require('./img/up.png'):require('./img/down.png')")
      .listWrapper
        ul.list
          li.item(v-for="(item, index) in list")
            .picture
              img.img
            .content
              .left
                img
              .right
                .name 雅诗兰黛 | 南京中央商场专柜雅诗兰黛 | 南京中央商场专柜雅诗兰黛 | 南京中央商场专柜
                .flagWrapper
                  .flag 专柜自提
                  .flag 预约体验
                .address
                  img(src="./img/address.png")
                  span 南京市秦淮区中山南路79号南京市秦淮区中山南路79号
                .activeWrapper
                  .active
                    span.desc 活动
                    span.text 雅诗兰黛眼霜限时抢购，仅售350元！
</template>

<script>
  export default {
    name: "pickupArea",
    data() {
      return {
        searchDefaultText: '雅诗兰黛',
        query: '',
        tabActive: 1,
        brandList: [1,1,1,1,1,1,1],
        areaList: [1,1,1,1,1,1,1,1,1],
        areaShowAll: false,
        list: [1,1,1,1,1,1,1]
      }
    },
    created() {
      this.areaInitHeight = 0
      this.areaMaxHeight = 0
      this.getData()
    },
    mounted() {
      this.getAreaInitHeight()
    },
    methods: {
      getData() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'acPageInfo/pageComponentList',
          params: {
            pi_id: 1,
            flag: 0
          }
        }).then(function (res) {
          if (res) {
            res.data.data.forEach((item, index) => {
              item.content = JSON.parse(item.content)
              switch (item.pci_id) {
                case 1:
                  self.createBanner(item.content)
                  break
                case 2:
                  self.createSuspension(item.content)
                  break
                case 3:
                  self.createTwoColumn(item.content)
                  break
                case 4:
                  self.createTwoColumn(item.content)
                  break
                case 5:
                  self.createTwoColumn(item.content)
                  break
                case 6:
                  self.createTransverseSliding(item.content)
                  break
              }
            })
          }
        })
      },
      // 新建banner
      createBanner(data) {
        let el = document.createElement("div")
        el.id = 'bannerWrapper'
        this.$refs.customWrapper.appendChild(el)
        this.$banner({
          data:data.picList,
          id: 'bannerWrapper'
        })
      },
      // 新建多栏栏组件
      createTwoColumn(data) {
        let el = document.createElement("div")
        el.id = 'twoColumnWrapper'
        this.$refs.customWrapper.appendChild(el)
        this.$multiColumn({
          data: data.picList,
          id: 'twoColumnWrapper'
        })
      },
      // 新建悬浮按钮
      createSuspension(data) {
        let el = document.createElement("div")
        el.id = 'suspension'
        this.$refs.customWrapper.appendChild(el)
        this.$suspension({
          data: data.picList[0],
          id: 'suspension'
        })
      },
      // 新建横向滑动
      createTransverseSliding(data) {
        console.log(data)
        let el = document.createElement("div")
        el.id = 'transverseSliding'
        this.$refs.customWrapper.appendChild(el)
        this.$transverseSliding({
          data: data.picList,
          id: 'transverseSliding'
        })
      },
      // 获取商圈的两行高度和最高高度
      getAreaInitHeight() {
        this.$nextTick(()=>{
          if (this.areaList.length>8) {
            this.areaInitHeight = (parseFloat(this.$method.getStyle(this.$refs.areaLi[0], 'height')) + parseFloat(this.$method.getStyle(this.$refs.areaLi[0], 'marginBottom'))) * 2 + 'px'
            this.areaMaxHeight = this.$method.getStyle(this.$refs.areaUl, 'height')
            this.$refs.areaUl.style.height = this.areaInitHeight
          }
        })
      },
      // 展开收起商圈
      toggleArea() {
        this.areaShowAll = !this.areaShowAll
        this.$refs.areaUl.style.height = this.areaShowAll?this.areaMaxHeight:this.areaInitHeight
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  img {
    pointer-events none
  }
  .mescroll {
    background-color #fff
    position absolute
    top 0
    bottom $height-footer
    left 0
    height auto
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
      line-height $height-header
      img {
        width 3.2rem
      }
    }
  }
  .searchWrapper {
    margin-top $height-header
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
        -webkit-appearance: none;
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
    .area {
      ul {
        padding 0 .26rem
        display flex
        flex-wrap wrap
        transition all 0.5s
        overflow hidden
        li {
          width 2.18rem
          height 1.49rem
          background-color orange
          overflow hidden
          font-size 0
          position relative
          margin-right .24rem
          margin-bottom .24rem
          border-radius .1rem
          &:nth-child(4n) {
            margin-right 0
          }
          img {
            width 100%
          }
          .name {
            position absolute
            top 0
            left 0
            width 100%
            text-align center
            line-height 1.49rem
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            color #fff
            font-size .4rem
            font-weight bold
          }
        }
      }
      .openMore {
        font-size 0
        img {
          width 100%
        }
      }
    }
    .listWrapper {
      .list {
        .item {
          border-top .16rem solid #f2f2f2
          padding .48rem .4rem
          .picture {
            position relative
            font-size 0
            width 100%
            height 3.7rem
            overflow hidden
            background-color orange
            border-radius .13rem
            .img {
              width 100%
            }
          }
          .content {
            display flex
            justify-content space-between
            margin-top .4rem
            .left {
              width 1.17rem
              height 1.17rem
              font-size 0
              overflow hidden
              background-color orange
              border-radius 50%
              img {
                width 100%
              }
            }
            .right {
              width 85%
              overflow hidden
              .name {
                margin-top .08rem
                color #333
                font-size .37rem
                font-weight bold
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
              }
              .flagWrapper {
                margin-top .26rem
                display flex
                .flag {
                  height .37rem
                  padding 0 .1rem
                  display inline-flex
                  align-items center
                  color #333
                  font-size 9px
                  font-weight 400
                  border 1px solid #ccc
                  border-radius .05rem
                  margin-right .13rem
                  &:last-child {
                    margin-right 0
                  }
                }
              }
              .address {
                margin-top .26rem
                font-size 0
                img {
                  width .32rem
                }
                span {
                  color #999
                  font-size .32rem
                  font-weight 400
                  margin-left .1rem
                  line-height 1.5
                }
              }
              .activeWrapper {
                margin-top .26rem
                .active {
                  color #f70057
                  .desc {
                    height .37rem
                    font-size 11px
                    border 1px solid #f70057
                    border-radius .05rem
                    padding 0 .1rem
                    display inline-flex
                    align-items center
                  }
                  .text {
                    font-size .32rem
                    margin-left .05rem
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
