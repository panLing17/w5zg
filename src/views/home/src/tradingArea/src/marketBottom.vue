<template lang="pug">
  .marketBottom
    .tagWrapper
      ul.tagList
        li.tagItem(v-for="(item, index) in tagList", :class="{active: tagItemActive===index}", :key="index", @click="tagCheck(index)") {{item.gc_name}}
    .recommendWrapper
      recommend(ref="recommend")
</template>

<script>
  import recommend from './recommend'
  export default {
    name: "marketBottom",
    components: {recommend},
    data () {
      return {
        tagItemActive: -1,
        tagList: [],
        marketId: '',
        goodsUrl: '',
        goodsParams: {}
      }
    },
    created () {
      this._initData(this.$apiApp, 'market/queryRecommendGoods',{marketId  : this.$route.query.id})
      this.getCategory()
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/market',
        y: this.mescroll.getScrollTop()
      })
    },
    activated () {
      this.tagItemActive = -1
      if (this.marketId == this.$route.query.id) {
        let _this = this
        this.$store.state.position.forEach((now) => {
          if (now.path === '/market') {
            _this.mescroll.scrollTo(now.y, 0);
          }
        })
      } else {
        this._initData(this.$apiApp, 'market/queryRecommendGoods',{marketId  : this.$route.query.id})
        this.mescroll.resetUpScroll();
        this.getCategory()
      }
    },
    // beforeRouteUpdate (to, from, next) {
    //   this._initData(this.$apiGoods, 'goodsSearch/spus',{keywords: to.query.brandName})
    //   this.mescroll.resetUpScroll();
    //   next()
    // },
    mounted () {
      this.$mescrollInt("marketMescroll",this.upCallback,() => {}, () => {});
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    methods: {
      _initData (api, url, obj) {
        this.marketId = this.$route.query.id
        this.goodsUrl = api +  url
        this.goodsParams = obj
      },
      getCategory () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiApp + 'market/queryMarketCategory',
          params: {
            marketId  : this.marketId
          },
        }).then(function (response) {
          if (response) {
            self.tagList = response.data.data
            // self.initTagItemActive()
          }
        })
      },
      // initTagItemActive () {
      //   let _this = this
      //   this.tagList.forEach(()=> {
      //     _this.tagItemActive.push(false)
      //   })
      // },
      tagCheck (index) {
        this.tagItemActive = index
        this.$router.push({path: '/goodsList', query: { name: this.tagList[index].gc_name, searchRuleConstant: 2}})
        // this.tagItemActive.splice(index, 1, !this.tagItemActive[index])
        // let keywords = []
        // this.tagItemActive.forEach((item, index) => {
        //   if (item === true) {
        //     keywords.push(this.tagList[index].gc_name)
        //   }
        // })
        // keywords = keywords.join(' ')
        // this._initData(this.$apiGoods, 'goodsSearch/spus',{keywords: keywords})
        // this.mescroll.resetUpScroll();
      },
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          self.$refs.recommend.more(curPageData,page.num,page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        this.goodsParams.page = pageNum
        this.goodsParams.rows = pageSize
        let self = this
        self.$ajax({
          method: 'post',
          url:this.goodsUrl,
          params: this.goodsParams,
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response) {
            if (response.data.data instanceof Array) {
              successCallback&&successCallback(response.data.data);
            } else {
              successCallback&&successCallback(response.data.data.data);
            }
          } else {
            self.mescroll.endErr();
          }
        })
      }
    }
  }
</script>

<style scoped>

  .tagWrapper {
    padding: .26rem .26rem .13rem;
  }
  .tagList {
    display: flex;
    flex-wrap: wrap;
  }
  .tagItem {
    width: 2.26rem;
    height: .8rem;
    text-align: center;
    line-height: .8rem;
    border: 1px solid #d7d7d7;
    border-radius: 1.33rem;
    margin: 0 .1466rem .13rem 0;
    box-sizing: border-box;
    font-size: .34rem;
    color: #333;
  }
  .tagItem:nth-child(4n) {
    margin-right: 0;
  }
  .tagItem.active {
    background: #ffe8f0;
    border: 1px solid #f70057;
    color: #f70057;
  }
  .recommendWrapper {
    padding-top: .2rem;
  }

</style>
