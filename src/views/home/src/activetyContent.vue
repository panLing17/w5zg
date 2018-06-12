<template lang="pug">
  .content
    recommend(ref="recommend")
</template>

<script>
  import recommend from './tradingArea/src/recommend'
  export default {
    name: "activetyContent",
    components: {
      recommend
    },
    data () {
      return {
        parentId: '',
        parentType: '362'
      }
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/activity',
        y: this.mescroll.getScrollTop()
      })
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
</style>
