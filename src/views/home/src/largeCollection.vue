<template lang="pug">
  .largeConllection
    nav-bar(background="white")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="color: rgb(245,0,87);width: 5rem;text-align: center;") {{$route.query.title}}
      .topRight(slot="right")
    .content(v-if="!isEmpty")
      ul.list
        li.item(v-for="item in bankList", @click="toNext(item.url_type,item.url,item.id,item.relate_id, item.title)")
          img(:src="item.image | img-filter", style="width: 100%; height: 100%;")
    .noData(v-if="isEmpty") 暂无更多活动
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
      computed: {
        // 判断数据是否为空
        isEmpty () {
          if (this.bankList == null || this.bankList.length === 0) {
            return true;
          }else {
            return false;
          }
        }
      },
      mounted () {
        // this.$mescrollInt("largeMescroll",this.upCallback);
      },
      beforeRouteLeave (to, from, next) {
        if (to.path === '/home/sports') {
          to.meta.keepAlive = true
        }
        next()
      },
      methods: {
        getList () {
          let _this = this;
          this.$ajax({
            url: this.$apiApp + 'acActivityContent/acActivityContentList',
            methods: 'get',
            params: {
              actId: this.$route.query.actId,
              parentType: this.$route.query.parentType
            }
          }).then((response) => {
            this.bankList = response.data.data;
          })
        },
        toNext (type, url, id, relateId, title) {
          switch (type) {
            // 跳外链
            case '143': window.location.href = url; break;
            // 跳3级页面 362代表从2级跳3级
            case '145': this.$router.push({path: '/home/sports',query:{parentType: '362',actId:id,title: title}}); break;
            // 跳商品详情
            case '141': this.$router.push({ path: '/goodsDetailed', query: { id: relateId }}); break;
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
    margin-bottom: .26rem;
    width: 100%;
    height: 3.33rem;
  }
  .noData {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    color: rgb(153,153,153);
    font-size: .4rem;
  }
  img {
    pointer-events: none;
  }
</style>
