<template lang="pug">
  .searchResult
    search-filter
    scroll.searchResultContent
      .resultWrapper
        .noResult(v-show="!result.length")
          img(src="./noResult.png")
          .desc 抱歉，没有找到相关商品
      goods-list(:data="result")

</template>

<script>
  import Scroll from 'components/scroll'
  import SearchFilter from './searchFilter'
  import Loading from 'components/loading/loading'
  import GoodsList from './goodsList'
  export default {
    name: "searchResult",
    data () {
      return {
        result: [],
        page: 1,
        rows: 8
      }
    },
    created () {
      this._getRecommend()
    },
    methods: {
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
            self.result = self.result.concat(response.data.data)
          }
        })
      }
    },
    components: {
      Scroll,
      SearchFilter,
      Loading,
      GoodsList
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
