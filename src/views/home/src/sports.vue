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
              span.current ￥{{item.price | round}}
              span.save 可省XXX元
</template>

<script>
    export default {
      name: "sports",
      data () {
        return {
          banner: [],
          recommendGoods: [],
          parentId: null,
          parentType: null
        }
      },
      filters: {
        round (value) {
          if (value === "null") {
            return value;
          }else {
            return Math.round(value);
          }
        }
      },
      created () {
        // 获取banner
        this.getBanner();
        this.getParmas();
      },
      mounted () {
        this.$mescrollInt("sportsMescroll",this.upCallback);
      },
      methods: {
        getParmas () {
          this.parentId = this.$route.params.parentId;
          this.parentType = this.$route.params.parentType;
        },
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
            url:self.$apiApp +  'acactivitydetail/spus',
            params: {
              page: pageNum,
              rows: pageSize,
              parentId: this.parentId,
              parentType: this.parentType
            },
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
          }).then(function (response) {
            successCallback&&successCallback(response.data.data.rows);//成功回调
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
    position: relative;
  }
  .img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    max-height: 4rem;
  }
  .nameWrapper {
    padding: 0 .1rem;
    font-size: .26rem;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    height: 1rem;
    margin-top: 4.2rem;
  }
  .maybe {
    padding: .1rem .2rem;
    background: rgb(245,0,87);
    color: #fff;
    border-radius: .4rem;
    display: inline-block;
    margin-right: .13rem;
  }
  .name {
    color: rgb(51,51,51);
  }
  .price {
    margin-top: .33rem;
    padding:0 .1rem .26rem;
    font-size: .29rem;
    color: rgb(245,0,87);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .current {
    font-weight: 400;
    margin-right: .26rem;
  }
</style>
