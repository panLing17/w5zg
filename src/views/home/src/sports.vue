<template lang="pug">
  .sports.mescroll#sportsMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 运动
      .topRight(slot="right")
    .content
      carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:4rem")
        div(v-for="tag in banner", style="width:100%" , @click="goActivity(tag.ac_id,tag.linkType)")
          img(:src="tag.ac_phone_image | img-filter" , style="width:100%;height:4rem")
      .recommendWrapper
        w-recommend(:listData="recommendGoods", background="#fff")
</template>

<script>
    export default {
      name: "sports",
      data () {
        return {
          banner: [],
          recommendGoods: []
        }
      },
      created () {
        // 获取banner
        this.getBanner();
      },
      mounted () {
        this.$mescrollInt("sportsMescroll",this.upCallback);
      },
      methods: {
        getBanner () {
          let self = this
          this.$ajax({
            method: 'get',
            url: this.$apiApp + 'index/advertiseContentList',
            params: {
              acCataType: 111
            },
          }).then(function (response) {
            self.banner = response.data.data
          })
        },
        upCallback: function(page) {
          let self = this;
          this.getListDataFromNet(page.num, page.size, function(curPageData) {
            if(page.num === 1) self.recommendGoods = []
            self.recommendGoods = self.recommendGoods.concat(curPageData)
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
            url:self.$apiGoods +  'goodsSearch/goodsRecommendationList',
            params: {
              page: pageNum,
              rows: pageSize
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            successCallback&&successCallback(response.data.data);//成功回调
          })
        }
      }
    }
</script>

<style scoped>
  .mescroll {
    top: 0;
    bottom: 0;
    height: auto;
  }
  .sports {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
    padding-top: .26rem;
  }
  .recommendWrapper {
    margin-top: .26rem;
  }
  .carousel-dot {
    text-indent: 100px;
  }
</style>
