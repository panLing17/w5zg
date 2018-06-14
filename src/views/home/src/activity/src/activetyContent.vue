<template lang="pug">
  .content
    recommend(ref="recommend")
    .noData(v-if="isEmpty") 暂无相关商品
</template>

<script>
  import recommend from '../../tradingArea/src/recommend'
  export default {
    name: "activetyContent",
    components: {
      recommend
    },
    data () {
      return {
        parentId: '',
        parentType: '',
        isEmpty: false
      }
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/activity',
        y: this.mescroll.getScrollTop()
      })
    },
    activated () {
      if (this.parentId == this.$route.query.id || !this.$route.query.id) {
        let _this = this
        this.$store.state.position.forEach((now) => {
          if (now.path === '/activity') {
            _this.mescroll.scrollTo(now.y, 0);
          }
        })
      } else {
        this.parentId = this.$route.query.id
        this.parentType = this.$route.query.parentType
        this.mescroll.resetUpScroll();
      }
    },
    beforeRouteUpdate  (to, from, next) {
      if (this.parentId == to.query.id) {
        let _this = this
        this.$store.state.position.forEach((now) => {
          if (now.path === '/activity') {
            _this.mescroll.scrollTo(now.y, 0);
          }
        })
      } else {
        this.parentId = to.query.id
        this.parentType = this.$route.query.parentType
        this.mescroll.resetUpScroll();
      }
      next();
    },
    beforeRouteLeave (to, from, next) {
      to.meta.keepAlive = true
      next()
    },
    created () {
      this.parentId = this.$route.query.id
      this.parentType = this.$route.query.parentType
    },
    mounted () {
      this.$mescrollInt("activityMescroll",this.upCallback);
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    methods: {
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          if (page.num == 1 && curPageData.length <= 0) {
            self.isEmpty = true
          } else {
            self.isEmpty = false
          }
          self.$refs.recommend.more(curPageData,page.num,page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        if (!this.parentId) {
          successCallback&&successCallback([])
          return
        }
        let self = this
        self.$ajax({
          method: 'post',
          url:self.$apiApp +  'acactivitydetail/spus',
          params: {
            page: pageNum,
            rows: pageSize,
            parentId: this.parentId,
            parentType: this.parentType
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response.data.code === '081') {
            if (response.data.data && response.data.data.rows) {
              successCallback&&successCallback(response.data.data.rows);
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
.uuu {
  height: 5rem;
  overflow-y: scroll;
}
  li {
    height: 2rem;

  }
  .noData {
    margin-top: 3rem;
    text-align: center;
    color: #999;
    font-size: .4rem;
  }
</style>
