<template lang="pug">
  .searchResult
    search-filter
    scroll.searchResultContent(ref="searchResultContent",
                              :data="result",
                              :pullup="pullup",
                              @scrollToEnd="loadResult",
                              :listenScroll="listenScroll",
                              @scroll="scroll",
                              :probeType="probeType"
                              )
      .resultWrapper
        .noResult(v-show="!result.length")
          img(src="./noResult.png")
          .desc 抱歉，没有找到相关商品
        goods-list(:data="result")
        loading(v-show="hasMore")
        no-more(v-show="!hasMore")
    go-top(v-show="goTopShow", @goTop="goTop")
</template>

<script>
  import Scroll from 'components/scroll'
  import SearchFilter from './searchFilter'
  import Loading from 'components/loading/loading'
  import GoodsList from './goodsList'
  import GoTop from 'components/goTop/goTop'
  import NoMore from 'components/noMore'
  export default {
    name: "searchResult",
    props: {
      page: {
        type: Number,
        default: 1
      },
      rows: {
        type: Number,
        default: 6
      },
      data: {
        type: Object,
        default () {
          return {}
        }
      }
    },
    data () {
      return {
        result: [],
        pullup: true,
        hasMore: true,
        listenScroll: true,
        goTopShow: false,
        probeType: 3,
        currentHeight: document.documentElement.clientHeight || document.body.clientHeight
      }
    },
    created () {
      this._getRecommend()
    },
    methods: {
      scroll(pos) {
        if (-pos.y > (this.currentHeight - 100)) {
          this.goTopShow = true
        } else {
          this.goTopShow = false
        }
      },
      goTop() {
        this.$refs.searchResultContent.scrollTo(0,0,300)
      },
      loadResult() {
        if (!this.hasMore) {
          return
        }
        this.page++
        this._getRecommend()
      },
      _getRecommend() {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goodsSearch/goodsRecommendationList',
          params: {
            page: this.page,
            rows: this.rows
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response) {
            if (!response.data.data.length) {
              self.hasMore = false
              return
            }
            self.result = self.result.concat(response.data.data)
          }
        })
      }
    },
    components: {
      Scroll,
      SearchFilter,
      Loading,
      GoodsList,
      GoTop,
      NoMore
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .searchResult {
    height: "calc(100vh - %s)" % $height-header;
    overflow hidden
  }
  .searchResultContent {
    height calc(100vh - 2.5rem)
    background rgb(242,242,242)
    overflow hidden
  }
  .noResult {
    height 6.34rem
    text-align center
    img {
      margin-top 1rem
      width 2.66rem
    }
    .desc {
      margin-top .26rem
      font-size .37rem
      color rgb(119,119,119)
      line-height 1
    }
  }

</style>
