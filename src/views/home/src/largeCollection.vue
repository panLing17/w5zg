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
          bankList: [],
          id: ''
        }
      },
      created () {
        this.id = this.$route.query.actId
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
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy()
      },
      activated () {
        let _this = this
        if (this.id != this.$route.query.actId) {
          this.id = this.$route.query.actId
          this.getList();
        }else {
          this.position.forEach((now) => {
            if (now.path === this.$route.path) {
              _this.mescroll.scrollTo(now.y, 0);
            }
          })
        }
      },
      deactivated () {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: this.mescroll.getScrollTop()
        })
      },
      mounted () {
        this.$mescrollInt("largeMescroll",this.upCallback, () => {}, () => {})
      },
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
              actId: this.id,
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
        }
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
