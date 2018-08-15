<template lang="pug">
  .searchResult
    search-filter(:brandData="result.aggs", @brandSearch="brandSearch")
    scroll.searchResultContent(ref="searchResultContent",
                              :data="result.rows",
                              :pullup="pullup",
                              @scrollToEnd="loadResult",
                              :listenScroll="listenScroll",
                              @scroll="scroll",
                              :probeType="probeType"
                              )
      .resultWrapper
        .noResult(v-show="!result && !result.rows.length")
          img(src="./noResult.png")
          .desc 抱歉，没有找到相关商品
        goods-list(:data="result.rows")
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
      result: {
        type: Object,
        default () {
          return {
            rows: [],
            aggs: []
          }
        }
      },
      hasMore: {
        type: Boolean,
        default: true
      }
    },
    data () {
      return {
        pullup: true,
        listenScroll: true,
        goTopShow: false,
        probeType: 3,
        currentHeight: document.documentElement.clientHeight || document.body.clientHeight
      }
    },
    created () {

    },
    methods: {
      brandSearch(biArr) {
        this.$emit('brandSearch', biArr)
      },
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
        this.$emit('loadMore')
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
