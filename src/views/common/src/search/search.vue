<template lang="pug">
  .search
    .searchHeader
      .left(@click="back")
        img(src="./back.png")
      .center
        form(@submit.prevent="onSubmit")
          input(type="search", @search="dataReset({clearFilter: true})", @enter="dataReset({clearFilter: true})", :placeholder="placeholder", v-model="query", v-focus="focus")
        img.searchImg(src="./search.png", @click.prevent="dataReset({clearFilter: true})")
        img.cancelImg(src="./cancel.png", v-show="query", @click="cancelQuery")
      .right(@click="dataReset({clearFilter: true})") 搜索
    // 未搜索时
    search-init(v-show="searchInit", @wordSearch="wordSearch", :showFlag="searchInit", ref="searchInit")
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
                  :likesResult="likesResult",
                  :hotResult="hotResult",
                  @loadMore="search()",
                  @brandSearch="brandSearch",
                  @priceSearch="priceSearch",
                  @priceFilter="priceFilter",
                  @resetSearch="resetSearch"
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
        associativeQuery: [], //联想词列表
        searchResult: { //搜索列表
          aggs: [],
          rows: []
        },
        likesResult: [], //近似商品列表
        hotResult: [], //热搜商品列表
        searchInit: true, //是否显示搜索初始化页面
        showResult: false, //是否显示搜索结果页面
        page: 1, //分页
        rows: 6, //一页的长度
        hasMore: true, //是否还有显示加载中
        sortFieldType: 0, //搜索接口字段 排序字段类型
        bi_id: '', //搜索接口字段 品牌ID集合 以逗号分隔
        sortType: 2, //搜索接口字段 排序 2 升序 1 降序
        searchType: 1, //相似搜索接口字段 1 相似 2 热搜
        searchEnd: false, // 搜索结果是否到底
        startPrice: '', //价格区间筛选最低价格
        endPrice: '', //价格区间筛选最高价格,
        associativeOpen: true, //是否调联想搜索接口
        focus: false,
        placeholder: '', //默认搜索词
        brandReset: true, //品牌列表是否重新赋值
      }
    },
    directives: {
      focus: {
        // 指令的定义
        inserted: function (el) {
          el.focus()
        },
        update: function (el) {
          el.focus()
        }
      }
    },
    created() {
      if (this.$route.query.key) {
        this.query = this.$route.query.key
        this.dataReset({})
      }
      this._getDefaultWord()
      this.pushHistory = true
      window.history.pushState(null, null, window.location.href)
    },
    deactivated() {
      this.focus = false
      this.pushHistory = false
    },
    activated() {
      if (!this.pushHistory) {
        window.history.pushState(null, null, window.location.href)
      }
      this.focus = true
      if (this.$route.query.key) {
        this.query = this.$route.query.key
        this.dataReset({})
      }
      this._getDefaultWord()
    },
    mounted() {
      this.focus = true
    },
    methods: {
      // 如果是在搜索结果显示时点击返回按钮返回到搜索初始化
      back() {
        if(this.showResult && !this.$route.query.from) {
          this.cancelQuery()
        } else {
          this.$router.go(-2)
          setTimeout(() => {
            this.cancelQuery()
          }, 500)
        }
      },
      // 所有值恢复出厂
      cancelQuery() {
        this.query = ''
        this.$refs.searchResult.hideTop()
        this.searchResult = {
          aggs: [],
          rows: []
        }
        this.associativeQuery = []
        this.showResult = false
        this.likesResult = []
        this.hotResult = []
        this.hasMore = true
        this.sortFieldType = 0
        this.bi_id = ''
        this.sortType = 2
        this.page = 1
        this.searchEnd = false
        this.searchType = 1
        this.searchInit = true
        this.$refs.searchResult.clearFilter()
      },
      // 初始化界面所有关键词点击回调
      wordSearch(item) {
        this.associativeOpen = false
        if (item.search_word) {
          this.query = item.search_word
        } else if (item.gc_name){
          this.query = item.gc_name
        } else {
          this.query = item
        }
        this.dataReset({})
        setTimeout(()=>{
          this.associativeOpen = true
        }, 20)

      },
      // 点击综合
      resetSearch() {
        this.dataReset({sortFieldType: 0, bi_id: this.bi_id, brandReset: this.brandReset})
      },
      // 过滤器价格区间筛选回调
      priceFilter(data) {

        this.dataReset({sortType: this.sortType,
          bi_id: this.bi_id,
          sortFieldType: typeof data.min === 'string'?0:3,
          startPrice: data.min,
          endPrice: data.max,
          brandReset: this.brandReset})
      },
      // 过滤器价格排序点击回调
      priceSearch(priceChoose) {
        let price = priceChoose===2 ? 1 : 2
        let sortFieldType = 3
        if (priceChoose === 0) {
          sortFieldType = 0
        }
        this.dataReset({sortType: price, bi_id: this.bi_id, sortFieldType: sortFieldType, startPrice: this.startPrice, endPrice: this.endPrice, brandReset: this.brandReset})

      },
      // 过滤器品牌筛选回调
      brandSearch(biArr) {
        this.dataReset({sortType: this.sortType, bi_id: biArr, sortFieldType:this.sortFieldType, startPrice: this.startPrice, endPrice: this.endPrice, brandReset: false})
      },
      // 联想搜索词点击回调
      associativeSelect (item) {
        this.query = item
        this.dataReset({})
      },
      onSubmit () {
        return false
      },
      // 调搜索接口
      search () {
        if (this.query.trim().length===0) {
          return
        }
        this.searchInit = false
        //关闭过滤器
        this.$refs.searchResult.closeFilter()
        this.focus = false
        // 如果搜索结果触底就调相似/热搜接口
        if (this.searchEnd) {
          this.searchOther()
          return
        }
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
            bi_id: this.bi_id,
            startPrice: this.startPrice,
            endPrice: this.endPrice
          }
        }).then(function(res){
          if (res) {
            self.$refs.searchInit._getHistory()
            self.associativeQuery = []
            self.showResult = true
            if (!res.data.data.rows.length && self.page===1) {
              self.searchEnd = true
              self.searchType = 2
              self.searchOther()
              return Promise.reject()
            }
            self.searchResult.rows = self.searchResult.rows.concat(res.data.data.rows)
            if(self.brandReset) {
              self.searchResult.aggs = res.data.data.aggs
            }
            self.page++
            if (!res.data.data.rows.length || res.data.data.rows.length < self.rows) {
              self.page = 1
              self.searchEnd = true
              self.searchOther()
            }
          }
        }).catch(()=>{})
      },
      // 调相似/热搜接口
      searchOther() {
        let self =this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goodsSearch/v2/spusOther',
          params: {
            keywords: this.query,
            page: this.page,
            rows: this.rows,
            city_no: 100100,
            sortFieldType: this.sortFieldType,
            sortType: this.sortType,
            bi_id: this.bi_id,
            searchType: this.searchType,
            startPrice: this.startPrice,
            endPrice: this.endPrice
          }
        }).then(function(res){
          if (res) {
            if (self.searchType === 1) {
              if (!res.data.data.rows && self.page === 1) {
                self.searchType = 2
                self.searchOther()
                return Promise.reject()
              }
              if (res.data.data.rows && (res.data.data.rows.length < self.rows)) {
                self.searchType = 2
                self.searchOther()
                return Promise.reject()
              }
              self.page++
              self.likesResult = self.likesResult.concat(res.data.data.rows)
            } else if (self.searchType === 2) {
              self.hotResult = self.hotResult.concat(res.data.data.rows)
              self.page++
              if (!res.data.data.rows || !res.data.data.rows.length || res.data.data.rows.length<self.rows) {
                self.hasMore = false
              }

            }
          }
        }).catch(()=>{})
      },
      // 点搜索按钮触发，先把一些数据恢复出厂值
      dataReset ({sortType=2, bi_id='', sortFieldType=0, startPrice='', endPrice='', brandReset=true, clearFilter=false}) {
        if (clearFilter) {
          this.$refs.searchResult.clearFilter()
        }
        this.hotResult = []
        this.$refs.searchResult.hideTop()
        this.likesResult = []
        this.searchType = 1
        this.searchResult.rows = []
        this.startPrice = startPrice
        this.endPrice = endPrice
        this.page = 1
        this.hasMore = true
        this.sortType = sortType
        this.bi_id = bi_id
        this.sortFieldType = sortFieldType
        this.searchEnd = false
        this.brandReset = brandReset
        if (this.query.trim().length===0) {
          this.query = this.placeholder
          this.associativeOpen = false
          setTimeout(()=>{
            this.associativeOpen = true
          }, 20)
        }

        this.search()

      },
      _getDefaultWord() {
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goodsSearch/v2/getDefaultSeWord',
          params: {
          }
        }).then(function(res){
          self.placeholder = res.data.data
        })
      }
    },
    watch: {
      // 输入框里搜索词发生变化时调联想搜索接口
      query(newQuery) {
        // 点击热搜词、热搜栏目、历史搜索时不需要调用联想搜索
        if (!this.associativeOpen) {
          return
        }
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
              if (self.associativeQuery.length) {
                self.searchInit = false
              }
            }
          })
        } else {
          this.associativeQuery = []
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
    height: 100vh;
    overflow: hidden;
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
