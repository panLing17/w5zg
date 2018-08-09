<template lang="pug">
  scroll.searchContent(:data="searchData")
    div
      .hotWrapper
        .blockTitle
          .title 热搜词
        scroll.hotContent(:data="hot", :scrollX="horizontalScrollX", :scrollY="horizontalScrollY", :stopPropagation="horizontalStopPropagation")
          .twoRow
            ul
              li(v-for="(item, index) in hot", v-if="index%2===0") {{item.search_word}}
                flag(v-if="item.type", :flag="item.type")
            ul
              li(v-for="(item, index) in hot", v-if="index%2===1") {{item.search_word}}
                flag(v-if="item.type", :flag="item.type")
      .historyWrapper(v-show="history.length")
        .blockTitle
          .title 历史搜索
          .clear(@click="clearHistory")
            img(src="./clear.png")
        scroll.hotContent(:style="{height:history.length>6?'2.37rem':'1.4rem'}", :data="history", :scrollX="horizontalScrollX", :scrollY="horizontalScrollY", :stopPropagation="horizontalStopPropagation")
          .twoRow(v-if="history.length>6")
            ul
              li(v-for="(item, index) in history", v-if="index%2===0") {{item}}
            ul
              li(v-for="(item, index) in history", v-if="index%2===1") {{item}}
          .oneRow(v-else)
            ul
              li(v-for="item in history") {{item}}
      .categoryWrapper
        .blockTitle
          .title 热门分类
        scroll.categoryHeader(ref="categoryHeader", :data="category", :scrollX="horizontalScrollX", :scrollY="horizontalScrollY", :stopPropagation="horizontalStopPropagation")
          div
            ul(ref="categoryList")
              li(v-for="(item, index) in category", :class="{active: currentCategory===index}", @click="categoryChange(item, index, $event)") {{item.name}}
        .categoryContent
          ul
            li(v-for="item in categoryList") {{item.title}}
              flag(v-if="item.type", :flag="item.type")
</template>

<script>
  import Scroll from 'components/scroll'
  import Flag from './flag'
  export default {
    name: "searchInit",
    created () {
      this._getHistory()
    },
    data () {
      return {
        hot: [
          {
            name: '雅诗兰黛',
            type: null
          },
          {
            name: '阿迪达斯',
            type: null
          },
          {
            name: '水之月',
            type: null
          },
          {
            name: '耐克',
            type: 1
          },
          {
            name: '费雪',
            type: null
          },
          {
            name: '自然堂',
            type: null
          },
          {
            name: '面膜',
            type: null
          },
          {
            name: '口红',
            type: 2
          },
          {
            name: '洗面奶',
            type: null
          },
          {
            name: '奶粉',
            type: null
          },
          {
            name: '尿不湿',
            type: null
          }
        ],
        history: [],
        category: [
          {
            name: '超市',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          },
          {
            name: '美妆个护',
            list: [
              {
                title: '自然堂',
                type: null
              },
              {
                title: '水之密语',
                type: null
              },
              {
                title: '海飞丝',
                type: null
              },
              {
                title: '黑人',
                type: 1
              },
              {
                title: '欧莱雅',
                type: null
              },
              {
                title: '潘婷',
                type: null
              }
            ]
          },
          {
            name: '运动户外',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          },
          {
            name: '母婴用品',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          },
          {
            name: '鞋靴箱包',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          },
          {
            name: '女鞋',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          },
          {
            name: '男装',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          },
          {
            name: '女装',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          },
          {
            name: '玩具',
            list: [
              {
                title: '面包',
                type: null
              },
              {
                title: '干脆面',
                type: null
              },
              {
                title: '薯片',
                type: null
              },
              {
                title: '沐浴露',
                type: 1
              },
              {
                title: '洗发水',
                type: null
              },
              {
                title: '酒',
                type: null
              },
              {
                title: '饮料',
                type: 2
              },
              {
                title: '水果',
                type: null
              },
              {
                title: '蔬菜',
                type: null
              }
            ]
          }
        ],
        horizontalScrollX: true,
        horizontalScrollY: false,
        horizontalStopPropagation: true,
        currentCategory: 0,
        screenWidth: document.documentElement.offsetWidth || document.body.clientWidth
      }
    },
    computed: {
      categoryList () {
        return this.category[this.currentCategory].list
      },
      searchData () {
        return this.hot.concat(this.categoryList)
      }
    },
    created() {
      this._getHotData()
    },
    methods: {
      clearHistory () {
        this.$confirm({
          title: '确认',
          message: '清除所有搜索历史记录？',
          confirm: () => {
            let self = this
            self.$ajax({
              method: 'post',
              url: self.$apiGoods + 'goodsSearch/deleteGoodsHistoryList',
              params: {}
            }).then(function(res){
              if (res) {
                self.history = []
              }
            })
          },
          noConfirm: () => {}
        })
      },
      categoryChange(item, index, e) {
        if (this.currentCategory === index) {
          return
        }
        this.currentCategory = index
        let liWidth = this.$refs.categoryList.children[index].offsetWidth
        let ulLeft = parseFloat(this.$method.getStyle(this.$refs.categoryList, 'paddingLeft'))
        if (e.clientX <= (this.screenWidth / 2)) {
          // 代表左边
          if (e.clientX <= (liWidth + ulLeft)) {
            this.$refs.categoryHeader.scrollToElement(this.$refs.categoryList.children[Math.max(0,index-1)], 300)
          }
        } else {
          // 代表右边
          if ((this.screenWidth - e.clientX) <= liWidth) {
            let pos = Math.min(this.$refs.categoryList.children.length-1, index+1)
            let totalWidth = 0;
            for (let i = 0; i<= pos; i++) {
              totalWidth += this.$refs.categoryList.children[i].offsetWidth
            }
            totalWidth = totalWidth + ulLeft -this.screenWidth
            this.$refs.categoryHeader.scrollTo(-totalWidth, 0, 300)
          }
        }
      },
      _getHotData () {
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goodsSearch/getHotSearchWord',
          params: {}
        }).then(function(res){
          if (res) {
            self.history = res.data.data
          }
        })
      },
      _getHistory () {
        if (localStorage.getItem('token')) {
          let self =this
          self.$ajax({
            method: 'post',
            url: self.$apiGoods + 'goodsSearch/queryGoodsHistoryList',
            params: {}
          }).then(function(res){
            if (res) {
              self.hot = res.data.data
            }
          })
        }
      }
    },
    components: {
      Scroll,
      Flag
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .searchContent {
    height: "calc(100vh - %s)" % $height-header;
  }
  .hotWrapper, .historyWrapper {
    border-bottom: .16rem solid rgb(242,242,242);
  }
  .blockTitle {
    height: 1.28rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .4rem;
    .title {
      border-left: .1rem solid rgb(206,206,206);
      padding-left: .13rem;
      font-size:.37rem;
      color:rgb(51,51,51);
      font-weight: 400;
    }
    .clear {
      img {
        width: .58rem;
      }
    }
  }
  .hotContent {
    width: 100%;
    height: 2.37rem;
    overflow: hidden;
  }
  .twoRow, .oneRow {
    position: absolute;
    ul:nth-child(2) {
      top: 1.12rem;
    }
    ul {
      white-space: nowrap;
      padding-left: .4rem;
      li {
        display: inline-block;
        position relative
        padding:.186rem .426rem;
        background: #f6f6f6;
        color: #333;
        font-size: .34rem;
        line-height: 1;
        margin: 0 .26rem .26rem 0;
        border-radius .42rem
        i {
          color: #fff;
        }
      }
    }
  }
  .categoryHeader {
    border-bottom: 1px solid rgb(215,215,215);
    width: 100%;
    height: 0.756rem;
    overflow hidden
    div {
      position absolute
    }
    ul {
      white-space nowrap
      padding-left: .4rem;
      li {
        display inline-block
        padding: 0 .32rem;
        height: 0.73rem;
        font-size: .37rem;
        color: #333;
        border-bottom: 0.08rem solid #fff;
      }
      li.active {
        color: rgb(247,0,87);
        border-bottom-color rgb(247,0,87)
      }
    }
  }

  .categoryContent {
    ul {
      padding:.37rem  .29rem .1rem;
      li {
        margin: 0 .26rem .26rem 0;
        position relative
        display inline-block
        padding .186rem .426rem
        border-radius:.42rem
        border:1px solid rgb(206,206,206);
        line-height: 1;
        font-size: .34rem;
        color: #333;
      }
    }
  }
</style>
