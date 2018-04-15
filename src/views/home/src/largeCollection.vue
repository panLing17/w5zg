<template lang="pug">
  .largeConllection.mescroll#largeMescroll
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center", style="color: rgb(245,0,87);") 大牌云集
      .topRight(slot="right")
    .content
      ul.list
        li.item(v-for="item in bankList", @click="toNext(item.url_type,item.url)")
          img(:src="item.image | img-filter", style="width: 100%; height: 100%;")
</template>

<script>
    export default {
      name: "largeCollection",
      data () {
        return {
          bankList: []
        }
      },
      created () {
        this.getList();
      },
      mounted () {
        // this.$mescrollInt("largeMescroll",this.upCallback);
      },
      methods: {
        getList () {
          let _this = this;
          this.$ajax({
            url: this.$apiApp + 'acActivityContent/acActivityContentList',
            methods: 'get',
            params: {
              actId: this.$route.params.actId
            }
          }).then((response) => {
            this.bankList = response.data.data;
          })
        },
        toNext (type, url) {
          switch (type) {
            // 跳外链
            case '344': window.location.href = url; break;
            // 跳3级页面
            case '342': this.$router.push(`/home/sports/${url}`); break;
            // 跳商品详情
            case '343': this.$router.push({ path: '/goodsDetailed', query: { id: url }}); break;
          }
        }
        // upCallback: function(page) {
        //   let self = this;
        //   this.getListDataFromNet(page.num, page.size, function(curPageData) {
        //     if(page.num === 1) self.bankList = []
        //     self.bankList = self.bankList.concat(curPageData)
        //     self.mescroll.endSuccess(curPageData.length)
        //   }, function() {
        //     //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        //     self.mescroll.endErr();
        //   })
        // },
        // getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        //   let self = this
        //   self.$ajax({
        //     method: 'post',
        //     url:self.$apiGoods +  'goodsSearch/goodsRecommendationList',
        //     params: {
        //       page: pageNum,
        //       rows: pageSize
        //     },
        //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        //   }).then(function (response) {
        //     successCallback&&successCallback(response.data.data);//成功回调
        //   })
        // }
      }
    }
</script>

<style scoped>
  .largeConllection {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .item {
    margin-top: .26rem;
    width: 100%;
    height: 3.33rem;
  }
</style>
