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
        ul.list
          li.item(v-for="item in recommendGoods")
            img.img(:src="item.gi_image_url | img-filter")
            .nameWrapper
              // carry_type 1可自提 2不可自提
              span.maybe(v-if="item.carry_type===1") 可自提
              span.name {{item.gi_name}}}
            .price
              span.current ￥{{item.price}}
              span.save 可省XXX元
</template>

<script>
    export default {
      name: "sports",
      data () {
        return {
          banner: [],
          recommendGoods: [],
          keywords: null
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
          this.keywords = this.$route.params.keywords;
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
            url:self.$apiGoods +  'goodsSearch/spus',
            params: {
              page: pageNum,
              rows: pageSize,
              keywords: this.keywords
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
  .list {
    background: #fff;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding: .2rem;
  }
  .item {
    float: left;
    width: 49%;
    border: solid 1px #ccc;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: .2rem;
  }
  .img {
    width: 100%;
  }
  .nameWrapper {
    padding: 0 .1rem;
    font-size: .4rem;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 1.2rem;
  }
  .maybe {
    padding: 0 .15rem;
    background: rgb(245,0,87);
    color: #fff;
    border-radius: .4rem;
  }
</style>
