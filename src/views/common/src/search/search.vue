<template lang="pug">
  .search
    .searchHeader
      .left(@click="$router.go(-1)")
        img(src="./back.png")
      .center
        form(@submit.prevent="onSubmit")
          input(type="search", @search="dataReset({})", @enter="dataReset({})", placeholder="请输入商品类别 例如: 男装", v-model="query")
        img.searchImg(src="./search.png", @click.prevent="dataReset({})")
        img.cancelImg(src="./cancel.png", v-show="query", @click="query=''")
      .right(@click="search") 搜索
    // 未搜索时
    search-init(v-show="!showResult && !searchResult.length")
    // 联想查询
    associative-query(:data="associativeQuery", @associativeSelect="associativeSelect", v-show="associativeQuery.length")
    // 搜索结果
    search-result(
                  ref="searchResult",
                  v-show="showResult",
                  :page="page",
                  :rows="rows",
                  :result="searchResult",
                  :hasMore="hasMore",
                  :sortFieldType="sortFieldType",
                  @loadMore="search()",
                  @brandSearch="brandSearch",
                  @priceSearch="priceSearch"
                  )
</template>

<script>
  import AssociativeQuery from './associativeQuery'
  import SearchInit from './searchInit'
  import SearchResult from './searchResult'
  export default {
    name: "search",
    data () {
      return {
        query: '', //搜索词
        associativeQuery: [],
        searchResult: {
          aggs: [],
          rows: []
        },
        showResult: false,
        page: 1,
        rows: 6,
        hasMore: true,
        sortFieldType: 0,
        bi_id: '',
        sortType: 2
      }
    },
    methods: {
      priceSearch(priceChoose) {
        let price = priceChoose===2 ? 1 : 2
        let sortFieldType = 3
        if (priceChoose === 0) {
          sortFieldType = 0
        }
        this.dataReset({sortType: price, bi_id: this.bi_id, sortFieldType: sortFieldType})

      },
      brandSearch(biArr) {
        this.dataReset({sortType: this.sortType, bi_id: biArr, sortFieldType:this.sortFieldType})
      },
      associativeSelect (item) {
        this.query = item
        this.dataReset({})
      },
      onSubmit () {
        return false
      },
      search () {
        //关闭过滤器
        this.$refs.searchResult.closeFilter()
        let self =this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goodsSearch/v2/spus',
          params: {
            keywords: this.query,
            page: this.page,
            rows: this.rows,
            city_no: 100100,
            searchRuleConstant: 1,
            sortFieldType: this.sortFieldType,
            sortType: this.sortType,
            bi_id: this.bi_id
          }
        }).then(function(res){
          if (res) {
            if (!res.data.data.rows.length || res.data.data.rows.length < self.rows) {
              self.hasMore = false
            }
            self.page++
            self.searchResult.rows = self.searchResult.rows.concat(res.data.data.rows)
            self.searchResult.aggs = res.data.data.aggs
            self.associativeQuery = []
            self.showResult = true
          }
        })
      },
      dataReset ({sortType=2, bi_id='', sortFieldType=0}) {
        this.searchResult = {
          aggs: [],
          rows: []
        }
        this.page = 1
        this.hasMore = true
        this.sortType = sortType
        this.bi_id = bi_id
        this.sortFieldType = sortFieldType
        this.search()
      }
    },
    watch: {
      query(newQuery) {
        if (newQuery.length) {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiGoods + 'essuggest/searchSuggest',
            params: {
              keywords: this.query,
              size: 100
            }
          }).then(function(res){
            if (res && res.data.data) {
              self.associativeQuery = res.data.data
            }
          })
        }
      }
    },
    components: {
      SearchInit,
      AssociativeQuery,
      SearchResult
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  input::placeholder{
    color: #777777;
    font-size: .29rem;
  }
  .search {
    position: relative;
  }
  .searchHeader {
    display: flex;
    align-items: center;
    height: 1.3rem;
    border-bottom: 1px solid rgb(215,215,215);
    .left {
      flex: none;
      padding-left: .4rem;
      font-size: 0;
      img {
        width: .58rem;
      }
    }
    .center {
      flex: 1;
      margin: 0 .26rem;
      height: .8rem;
      position: relative;
      form {
        width: 100%;
        height: 100%;
        input {
          width: 100%;
          height: 100%;
          outline: none;
          background:rgb(246,246,246);
          border-radius:.4rem;
          border:1px solid rgb(236,236,236);
          padding: 0 .85rem;
          color: #333;
          font-size: .37rem;
          -webkit-appearance: none;
        }
      }

      .searchImg, .cancelImg {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .searchImg {
        left: .26rem;
        width: .45rem;
      }
      .cancelImg {
        right: .26rem;
        width: .37rem;
      }
    }
    .right {
      padding-right: .4rem;
      font-size: .4rem;
    }
  }
</style>
