<template lang="pug">
  .marketBottom
    .tagWrapper
      ul.tagList
        li.tagItem(v-for="(item, index) in tagList", :class="{active: tagItemActive[index]}", :key="index", @click="tagCheck(index)") {{item.name}}
    .recommendWrapper
      recommend(ref="recommend")
</template>

<script>
  import recommend from '../../recommend'
  export default {
    name: "marketBottom",
    components: {recommend},
    data () {
      return {
        tagItemActive: [],
        tagList: [
          {
            name: '美妆护肤'
          },
          {
            name: '运动'
          },
          {
            name: '母婴'
          },
          {
            name: '日化'
          },
          {
            name: '配饰'
          },
          {
            name: '鞋'
          },
          {
            name: '数码3C'
          },
          {
            name: '进口食品'
          }
        ]
      }
    },
    created () {
      this.getCategory()
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/market',
        y: this.mescroll.getScrollTop()
      })
    },
    activated () {
      let _this = this
      this.$store.state.position.forEach((now) => {
        if (now.path === '/market') {
          _this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    mounted () {
      this.$mescrollInt("marketMescroll",this.upCallback,() => {}, () => {});
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/searchTradingArea') {
        from.meta.keepAlive = true
      } else {
        from.meta.keepAlive = false
      }
      next()
    },
    beforeDestroy () {
      console.log(1111)
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    methods: {
      getCategory () {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiApp + 'market/queryMarketCategory',
          params: {
            marketId  : this.$route.query.id
          },
        }).then(function (response) {
          if (response) {
            self.tagList = response.data.data
            self.initTagItemActive()
          }
        })
      },
      initTagItemActive () {
        let _this = this
        this.tagList.forEach(()=> {
          _this.tagItemActive.push(false)
        })
      },
      tagCheck (index) {
        this.tagItemActive.splice(index, 1, !this.tagItemActive[index])
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
        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiApp +  'market/queryRecommendGoods',
          params: {
            page: pageNum,
            rows: pageSize,
            marketId : this.$route.query.id
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response) {
            if (response.data.data && response.data.data.data) {
              successCallback&&successCallback(response.data.data.data);
            }else {
              successCallback&&successCallback([]);
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

</style>
