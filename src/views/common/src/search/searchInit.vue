<template lang="pug">
  scroll.searchContent(:data="searchData")
    div
      .hotWrapper
        .blockTitle
          .title 热搜词
        .hotContent
          .twoRow(ref="moreContent", :style="{'max-height': hotHeight}")
            ul
              li(v-for="(item, index) in hot", @click="wordSearch(item)") {{item.search_word}}
                img(v-if="item.pic_url", :src="item.pic_url | img-filter")
          .moreWrapper(v-show="hotMoreShow", @click="hotMoreClick")
            img(:src="hotMore?require('./more2.png'):require('./more1.png')")
      .historyWrapper(v-show="history.length")
        .blockTitle
          .title 历史搜索
          .clear(@click="clearHistory")
            img(src="./clear.png")
        .hotContent
          .twoRow(ref="moreContent2", :style="{'max-height': historyHeight}")
            ul
              li(v-for="(item, index) in history", @click="wordSearch(item)") {{item}}
          .moreWrapper(v-show="historyMoreShow", @click="historyMoreClick")
            img(:src="historyMore?require('./more4.png'):require('./more3.png')")
      .categoryWrapper
        .blockTitle
          .title 热门分类
        scroll.categoryHeader(ref="categoryHeader", :data="category", :scrollX="horizontalScrollX", :scrollY="horizontalScrollY", :stopPropagation="horizontalStopPropagation")
          div
            ul(ref="categoryList")
              li(v-for="(item, index) in category", :class="{active: currentCategory===index}", @click="categoryChange(item, index, $event)") {{item.gc_name}}
        .categoryContent
          ul
            li(v-for="item in categoryList", @click="wordSearch(item)") {{item.gc_name}}
              img(v-if="item.gc_icon_url", :src="item.gc_icon_url | img-filter")
</template>

<script>
  import Scroll from 'components/scroll'
  import Flag from './flag'
  export default {
    name: "searchInit",
    created () {
      this.minHeight = parseFloat(this.$method.getStyle(document.getElementsByTagName('html')[0], 'fontSize')) * 2.22
      this.hotHeight2 = ''
      this.historyHeight2 = ''
      this._getHotData()
      this._getHistory()
      this._getCategory()
    },
    data () {
      return {
        hot: [],
        history: [],
        category: [],
        horizontalScrollX: true,
        horizontalScrollY: false,
        horizontalStopPropagation: true,
        currentCategory: 0,
        screenWidth: document.documentElement.offsetWidth || document.body.clientWidth,
        hotMore: false,
        hotHeight: 'none',
        hotMoreShow: false,
        historyMore: false,
        historyHeight: 'none',
        historyMoreShow: false
      }
    },
    computed: {
      categoryList () {
        if(this.category.length) {
          return this.category[this.currentCategory].nextStepList
        } else {
          return []
        }

      },
      searchData () {
        return this.hot.concat(this.categoryList)
      }
    },
    mounted() {
    },
    methods: {
      hotMoreClick() {
        if (!this.hotMore) {
          this.hotHeight = this.hotHeight2
        } else {
          this.hotHeight = '2.2rem'
        }
        this.hotMore = !this.hotMore
      },
      historyMoreClick() {
        if (!this.historyMore) {
          this.historyHeight = this.historyHeight2
        } else {
          this.historyHeight = '2.2rem'
        }
        this.historyMore = !this.historyMore
      },
      wordSearch(item) {
        this.$emit('wordSearch', item)
      },
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
          url: self.$apiGoods + 'goodsSearch/v2/getHotSearchWord',
          params: {}
        }).then(function(res){
          if (res) {
            self.hot = res.data.data
            self.$nextTick(()=>{
              if (self.$refs.moreContent.offsetHeight > self.minHeight) {
                self.hotHeight2 = self.$refs.moreContent.offsetHeight + 'px'
                self.hotHeight = '2.22rem'
                self.hotMoreShow = true
              }
            })
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
              if (res.data.data.length) {
                self.history = res.data.data
                self.$nextTick(() => {
                  if (self.$refs.moreContent2.offsetHeight > self.minHeight) {
                    self.historyHeight2 = self.$refs.moreContent2.offsetHeight + 'px'
                    self.historyHeight = '2.22rem'
                    self.historyMoreShow = true
                  }
                })
              }
            }
          })
        }
      },
      _getCategory () {
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goodsSearch/v2/getHotGoodClass',
          params: {}
        }).then(function(res){
          if (res) {
            self.category = res.data.data
          }
        })
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
  }
  .twoRow {
    overflow hidden
    transition all 0.5s
    ul {
      padding: 0 .4rem
      li {
        display: inline-block;
        position relative
        padding:0 .426rem;
        background: #f6f6f6;
        color: #333;
        font-size: .34rem;
        line-height: .85rem;
        margin: 0 .26rem .26rem 0;
        border-radius .42rem
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
        img {
          width .4rem
          position absolute
          right -0.05rem
          bottom .5rem
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
        img {
          width .4rem
          position absolute
          right -0.05rem
          bottom .5rem
        }
      }
    }
  }
  .moreWrapper {
    font-size: 0;
    img{
      width: 100%;
    }
  }
</style>
