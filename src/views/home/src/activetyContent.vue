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
    mounted () {
      // this.$mescrollInt("activityMescroll",this.upCallback);
    },
    methods: {
      upCallback: function(page) {
        // this.mescroll.endErr();

        // let self = this;
        // this.getListDataFromNet(page.num, page.size, function(curPageData) {
        //   self.$refs.recommend.more(curPageData,page.num,page.size)
        //   self.mescroll.endSuccess(curPageData.length)
        // }, function() {
        //   //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        //   self.mescroll.endErr();
        // })
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

</style>
