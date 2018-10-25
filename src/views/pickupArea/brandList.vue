<template lang="pug">
  .brand
    .header
      .back
        img(src="./img/back.png")
      .title 专柜品牌
    .contentWrapper
      scroll.content(ref="scroll", :data="data", :listenScroll="true", :probeType="3", @scroll="scroll")
        div
          .list(v-for="item in data", ref="list")
            .name {{item.name}}
            ul.chunk
              li.item(v-for="chunk in item.items")
                .left(v-lazy-container="{ selector: 'img'}")
                  img(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+chunk.ac_phone_image+'?x-oss-process=style/compress'",
                      :data-error="require('../../assets/img/default/brand.png')",
                      :data-loading="require('../../assets/img/default/brand.png')",
                      :key="chunk")
                .right {{chunk.name}}
      .navWrapper
        .nav(v-for="(item,index) in data", :class="{active: index===currentIndex}", @click="toChunk(index)") {{item.name}}
      .fixedName {{data[currentIndex].name}}
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "brandList",
    data() {
      return {
        data: [
          {
            "name": "★ Hot City",
            "shortcut": "★",
            "items": [
              {
                "name": "BEIJING",
                "value": 1
              },
              {
                "name": "SHANGHAI",
                "value": 2
              }
            ]
          },
          {
            "name": "A",
            "items": [
              {
                "name": "ANSHAN",
                "value": 3
              },
              {
                "name": "ANQING",
                "value": 4
              }
            ]
          },
          {
            "name": "B",
            "items": [
              {
                "name": "BEIJING",
                "value": 1
              },
              {
                "name": "BAYINGUOLENGZHOU",
                "value": 5
              },
              {
                "name": "BOERTALAZHOU",
                "value": 6
              }
            ]
          },
          {
            "name": "C",
            "items": [
              {
                "name": "CHENGDU",
                "value": 7
              }
            ]
          },
          {
            "name": "E",
            "items": [
              {
                "name": "EERDUOSI",
                "value": 8
              },
              {
                "name": "EZHOU",
                "value": 9
              },
              {
                "name": "ENSHIZHOU",
                "value": 10
              }
            ]
          },
          {
            "name": "F",
            "items": [
              {
                "name": "FUZHOU",
                "value": 11
              },
              {
                "name": "FOSHAN",
                "value": 12
              },
              {
                "name": "FANGCHENGGANG",
                "value": 13
              }
            ]
          },
          {
            "name": "G",
            "items": [
              {
                "name": "GUANGZHOU",
                "value": 14
              },
              {
                "name": "GUIYANG",
                "value": 15
              }
            ]
          },
          {
            "name": "H",
            "items": [
              {
                "name": "HANGZHOU",
                "value": 16
              },
              {
                "name": "HETIANDIQU",
                "value": 17
              }
            ]
          },
          {
            "name": "Z",
            "items": [
              {
                "name": "ZHENGZHOU",
                "value": 18
              },
              {
                "name": "ZHANGJIAKOU",
                "value": 19
              },
              {
                "name": "ZHANGJIAJIE",
                "value": 20
              },
              {
                "name": "ZHUHAI",
                "value": 21
              },
              {
                "name": "ZHONGSHAN",
                "value": 22
              },
              {
                "name": "ZIGONG",
                "value": 23
              },
              {
                "name": "ZIYANG",
                "value": 24
              },
              {
                "name": "ZHAOZHUANG",
                "value": 25
              },
              {
                "name": "ZHOUSHAN",
                "value": 26
              },
              {
                "name": "ZUNYI",
                "value": 27
              },
              {
                "name": "ZIBO",
                "value": 28
              },
              {
                "name": "ZHUZHOU",
                "value": 29
              },
              {
                "name": "ZHONGWEI",
                "value": 30
              }
            ]
          }
        ],
        currentIndex: 0,
        chunkHeight: []
      }
    },
    mounted() {
      this.initDomData()
    },
    methods: {
      initDomData() {
        this.$nextTick(()=>{
          let height = 0
          this.chunkHeight.push(height)
          for(let i=0;i<this.$refs.list.length;i++) {
            height+=parseFloat(this.$method.getStyle(this.$refs.list[i], 'height'))
            this.chunkHeight.push(height)
          }
        })
      },
      scroll(pos) {
        const chunkHeight = this.chunkHeight
        if (pos.y>0){
          return
        }
        for (let i = 0; i < chunkHeight.length - 1; i++) {
          let height1 = chunkHeight[i]
          let height2 = chunkHeight[i + 1]
          if (-pos.y >= Math.floor(height1) && -pos.y < Math.floor(height2)) {
            this.currentIndex = i
            this.diff = height2 + pos.y
            return
          }
        }
        this.currentIndex = chunkHeight.length - 2
      },
      toChunk(index) {
        this.$refs.scroll.scrollToElement(this.$refs.list[index], 500)
      }
    },
    components: {
      Scroll
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
    position relative
    height "calc(100vh - %s)" % $height-header
    overflow hidden
    margin-top $height-header
    .content {
      height 100%
      overflow hidden
      .name {
        height .9rem
        display flex
        align-items center
        background-color #f6f6f6
        color #333
        font-size .37rem
        font-weight bold
        padding 0 .8rem 0 .4rem
      }
      .chunk {
        .item {
          height 1.49rem
          display flex
          align-items center
          flex-wrap nowrap
          width 100%
          overflow hidden
          padding 0 .8rem 0 .4rem
          .left {
            font-size 0
            width 1rem
            height 1rem
            overflow hidden
            border-radius 50%
            border 1px solid #d7d7d7
            img {
              width 100%
            }
          }
          .right {
            margin-left .26rem
            font-size .37rem
            font-weight 400
            color #333
            overflow hidden
            width calc(100% - 1.26rem)
            text-overflow ellipsis
            white-space nowrap
          }
        }
      }
    }
    .navWrapper {
      position absolute
      right .26rem
      top .26rem
      z-index 10
      width .53rem
      padding .16rem 0 .32rem 0
      border 1px solid #ccc
      border-radius .26rem
      background-color #fff
      .nav {
        width 100%
        text-align center
        padding .16rem 0
        font-size .32rem
        font-weight 500
        color #333
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        &.active {
          color #f70057
          font-weight bold
        }
      }
    }
    .fixedName {
      position absolute
      top 0
      left 0
      width 100%
      height .9rem
      color #f70057
      font-size .37rem
      font-weight bold
      display flex
      align-items center
      padding 0 .8rem 0 .4rem
      background-color #f6f6f6
    }
  }
</style>
