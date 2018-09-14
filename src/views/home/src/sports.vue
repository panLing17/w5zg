<template lang="pug">
  .sports
    nav-bar(background="white", v-if="navShow")
      .topLeft(slot="left", @click="back")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 8rem;text-align: center;") {{$route.query.title}}
      .topRight(slot="right", @click="shareClick")
        img(v-if="shareShow", src="../../../assets/img/shareImg.png", style="width: .58rem")
    .mescroll#sportsMescroll(:style="{top: navShow?'1.3rem':'0'}")
      .content
        carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:4rem")
          div(v-for="tag in banner", style="width:100%" )
            img(:src="tag.ac_phone_image | img-filter" , style="width:100%;height:4rem")
        .recommendWrapper(v-if="!isEmpty")
          recommend(ref="recommend")
        .noData(v-if="isEmpty") 暂无推荐商品
</template>

<script>
  import {mapState} from 'vuex'
  import recommend from './recommend'
  import {activityShare} from 'assets/js/mixin.js'
  // 引入bus

    export default {
      name: "sports",
      mixins:[activityShare],
      data () {
        return {
          banner: [],
          recommendGoods: [],
          parentId: null,
          parentType: null,
          isEmpty: false
        }
      },
      components: {
        recommend
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
      computed: {
        ...mapState(['userData', 'position'])
      },
        created () {
        this.showShare()
        this.getParmas();
        // 获取banner
        this.getBanner();
      },
      mounted () {
        this.$mescrollInt("sportsMescroll",this.upCallback,() => {}, () => {});
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy()
      },
      deactivated () {
        this.$store.commit('setPosition', {
          path: '/sports',
          y: this.mescroll.getScrollTop()
        })
      },
      activated () {
        let _this = this
        if (this.parentId != this.$route.query.actId) {
          this.getParmas();
          this.getBanner();
          this.mescroll.resetUpScroll()
        }else {
          this.position.forEach((now) => {
            if (now.path === '/sports') {
              _this.mescroll.scrollTo(now.y, 0);
            }
          })
        }

      },
      methods: {
        // 锁定或者解锁上拉加载
        lockUpDown (isLock) {
          this.mescroll.lockUpScroll( isLock );
        },
        back () {
          this.$method.back.apply(this)
        },
        getParmas () {
          this.parentId = this.$route.query.actId;
          this.parentType = this.$route.query.parentType;
        },
        getBanner () {
          let acCataType;
          switch (this.parentType) {
            case '361': acCataType = 114; break;
            case '362': acCataType = 115; break;
            case '363': acCataType = 116; break;
          }
          let self = this
          this.$ajax({
            method: 'get',
            url: this.$apiApp + 'index/advertiseContentList',
            params: {
              acCataType: acCataType,
              acCataTypeId: this.$route.query.actId
            },
          }).then(function (response) {
            self.banner = response.data.data
          })
        },
        upCallback: function(page) {
          let self = this;
          this.getListDataFromNet(page.num, page.size, function(curPageData) {
            if (page.num === 1 && curPageData.length === 0 ) {
              self.isEmpty = true
            }else {
              self.$refs.recommend.more(curPageData,page.num,page.size)
            }
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
  .mescroll {
    position: fixed;
    /*top: 1.3rem;*/
    bottom: 0;
    height: auto;
    width: 100%;

  }
  .sports {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .recommendWrapper {
    margin-top: .26rem;
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
