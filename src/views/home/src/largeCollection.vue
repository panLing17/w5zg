<template lang="pug">
  .largeConllection
    nav-bar(background="white", v-if="navShow")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 5rem;text-align: center;") {{$route.query.title}}
      .topRight(slot="right", @click="shareClick")
        img(v-if="shareShow", src="../../../assets/img/shareImg.png", style="width: .58rem")
    .mescroll#largeMescroll
      .content(ref="largeConllection")
        ul.list
          li.item(v-for="(item, index) in bankList", @click="toNext(item, item.url_type,item.url,item.id,item.relate_id, item.title)", :key="index")
            img(:src="item.image | img-filter", style="width: 100%; height: 100%;")
    <!--.noData(v-if="isEmpty") 暂无更多活动-->
</template>

<script>
  import {activityShare} from 'assets/js/mixin.js'
    export default {
      name: "largeCollection",
      mixins:[activityShare],
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
      // deactivated () {
      //   this.$store.commit('setPosition', {
      //     path: '/largeCollection',
      //     y: this.mescroll.getScrollTop()
      //   })
      // },
      // activated () {
      //   let _this = this
      //   this.$store.state.position.forEach((now) => {
      //     if (now.path === '/largeCollection') {
      //       _this.mescroll.scrollTo(now.y, 0);
      //     }
      //   })
      // },
      // beforeRouteEnter (to, from , next) {
      //   to.meta.keepAlive = false
      //   next();
      // },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy()
      },
      mounted () {
        this.$mescrollInt("largeMescroll",this.upCallback, () => {
          // this.$store.state.position.forEach((now) => {
          //   if (now.path === this.$route.path) {
          //     this.mescroll.scrollTo(now.y, 0);
          //   }
          // })
        }, (obj) => {
          this.$store.commit('setPosition', {
            path: this.$route.path,
            y: obj.preScrollY
          })
        });
      },
      // beforeRouteLeave (to, from, next) {
      //   if (to.path === '/home/sports') {
      //     to.meta.keepAlive = true
      //   }
      //   next()
      // },
      methods: {
        upCallback: function (page) {
          // this.mescroll.endErr()
          this.mescroll.endSuccess(0)
          this.mescroll.lockDownScroll( true );
          this.mescroll.lockUpScroll( true );
        },
        getList () {
          let _this = this;
          this.$ajax({
            url: this.$apiApp + 'acActivityContent/acActivityContentList',
            methods: 'get',
            params: {
              actId: this.$route.query.actId,
              parentType: this.$route.query.parentType,
              conType: '481'
            }
          }).then((response) => {
            _this.bankList = response.data.data;
            _this.$nextTick(()=>{
              _this.$store.state.position.forEach((now) => {
                if (now.path === _this.$route.path) {
                  _this.mescroll.scrollTo(now.y, 0);
                }
              })
            })
          })
        },
        toNext (item, type, url, id, relateId, title) {
          this.$method.goActivity.call(this, item, 2)
          // switch (type) {
          //   // 跳外链
          //   case '143': window.location.href = url; break;
          //   // 跳3级页面 362代表从2级跳3级
          //   case '145': this.$router.push({path: '/home/sports',query:{parentType: '362',actId:id,title: title}}); break;
          //   // 跳商品详情
          //   case '141': this.$router.push({ path: '/goodsDetailed', query: { id: relateId }}); break;
          //   // 跳3级页面模板2
          //   case '149': this.$router.push({ path: '/activity', query: { actId: id, title: title, parentType: '362'}}); break;
          // }
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
