<template lang="pug">
  .content
    recommend(ref="recommend", background="rgb(242, 242, 242)")
    .noData(v-if="isEmpty") 暂无相关商品
</template>

<script>
  import recommend from '../../recommend'
  export default {
    name: "activetyContent",
    components: {
      recommend
    },
    props: {
      id: {
        type: Number,
        default: -1
      }
    },
    data () {
      return {
        parentId: '',
        isEmpty: false
      }
    },
    watch: {
      id () {
        this.mescroll.resetUpScroll();
      }
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/activity',
        y: this.mescroll.getScrollTop()
      })
    },
    activated () {
      let _this = this
      this.$store.state.position.forEach((now) => {
        if (now.path === '/activity') {
          _this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    mounted () {
      this.$mescrollInt("activityMescroll",this.upCallback);
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    methods: {
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll( isLock );
      },
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
        if (this.id===-1) {
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
            parentId: this.id,
            parentType: '362'
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
