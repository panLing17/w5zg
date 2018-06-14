<template lang="pug">
  .wrap
    nav-bar(background="white")
      .topLeft(slot="left", @click="back")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center", style="width: 5rem;text-align: center;") {{$route.query.title}}
      .topRight(slot="right")
    .mescroll#twoLevelMescroll
      .contentWrapper
        .block
          .blockTitle
            .name 大牌推荐
            .more(v-if="brand.show", :class="{down: !brand.status, up: brand.status}", @click="dropCheck(0)")
          ul.brandList(:style="{'max-height': brand.height}", ref="brand")
            li.brandItem(v-for="(item, index) in brandList", :key="index", @click="toNext(0, index)")
              img.brandImg(:src="item.image | img-filter")
              .brandName {{item.title}}
          .noData(v-if="noDataShow.brand") 暂无大牌推荐
        .block
          .blockTitle
            .name 精选分类
            .more(v-if="category.show", :class="{down: !category.status, up: category.status}", @click="dropCheck(1)")
          ul.categoryList(:style="{'max-height': category.height}", ref="category")
            li.categoryItem(v-for="(item, index) in categoryList", :key="index", @click="toNext(1, index)")
              img.categoryImg(:src="item.image | img-filter")
              .categoryName {{item.title}}
          .noData(v-if="noDataShow.category") 暂无精选分类
        img.louceng(src="../../../../../assets/img/louceng2.png")
        .recommendWrapper
          recommend(ref="recommend")
          .noData(v-if="noDataShow.goods") 暂无相关商品
</template>

<script>
  import recommend from '../../tradingArea/src/recommend'
  export default {
    name: "twoLevel",
    components: { recommend },
    data () {
      return {
        brand: {
          show: true,
          status: false,
          height: '5.32rem',
          auto: 'none'
        },
        category: {
          show: true,
          status: false,
          height: '3.36rem',
          auto: 'none'
        },
        noDataShow: {
          brand: false,
          category: false,
          goods: false
        },
        brandList: [],
        categoryList: []
      }
    },
    beforeRouteEnter (to, from , next) {
      to.meta.keepAlive = false
      next();
    },
    beforeRouteLeave (to, from, next) {
      to.meta.keepAlive = true
      next()
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/twoLevel',
        y: this.mescroll.getScrollTop()
      })
    },
    activated () {
      if (this.parentId == this.$route.query.id || !this.$route.query.id) {
        let _this = this
        this.$store.state.position.forEach((now) => {
          if (now.path === '/twoLevel') {
            _this.mescroll.scrollTo(now.y, 0);
          }
        })
      } else {
        this.parentId = this.$route.query.id
        this.mescroll.resetUpScroll();
      }
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    mounted () {
      this.$mescrollInt("twoLevelMescroll",this.upCallback,() => {}, () => {});
      this.getBrandList()
      this.getCategoryList()
    },
    methods: {
      toNext (status, index) {
        let obj;
        if (status === 0) {
          obj = this.brandList[index]
        } else if(status === 1) {
          obj = this.categoryList[index]
        }
        switch (obj.url_type) {
          // 跳外链
          case '143': window.location.href = obj.url; break;
          // 跳3级页面模板1 362代表从2级跳3级
          case '145': this.$router.push({ path: '/home/sports',query:{parentType: '362',actId:obj.id,title: obj.title}}); break;
          // 跳商品详情
          case '141': this.$router.push({ path: '/goodsDetailed', query: { id: obj.relate_id }}); break;
          // 跳3级页面模板2
          case '149': this.$router.push({ path: '/home/activity', query: { actId: obj.id, title: obj.title, parentType: '362'}}); break;
        }
      },
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          if (page.num === 1 && curPageData.length === 0 ) {
            self.noDataShow.goods = true
          }else {
            self.noDataShow.goods = false
          }
          self.$refs.recommend.more(curPageData,page.num,page.size)
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
            parentId: this.$route.query.actId,
            parentType: this.$route.query.parentType
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
      },
      getBrandList () {
        let _this = this;
        this.$ajax({
          url: this.$apiApp + 'acActivityContent/acActivityContentList',
          methods: 'get',
          params: {
            actId: this.$route.query.actId,
            parentType: this.$route.query.parentType,
            conType: '482'
          }
        }).then((response) => {
          if (response) {
            _this.brandList = response.data.data;
            if (_this.brandList.length <= 0) {
              _this.noDataShow.brand = true
            } else {
              _this.noDataShow.brand = false
            }
            if (_this.brandList.length <= 9) {
              _this.brand.show = false
            } else {
              _this.$nextTick(()=> {
                _this.getHeight()
              })
            }
          }
        })
      },
      getCategoryList () {
        let _this = this;
        this.$ajax({
          url: this.$apiApp + 'acActivityContent/acActivityContentList',
          methods: 'get',
          params: {
            actId: this.$route.query.actId,
            parentType: this.$route.query.parentType,
            conType: '483'
          }
        }).then((response) => {
          if (response) {
            _this.categoryList = response.data.data;
            if (_this.categoryList.length <= 0) {
              _this.noDataShow.category = true
            } else {
              _this.noDataShow.category = false
            }
            if (_this.categoryList.length <= 10) {
              _this.category.show = false
            } else {
              _this.$nextTick(()=> {
                _this.getHeight()
              })
            }
          }
        })
      },
      getHeight () {
        this.brand.height = 'none'
        this.category.height = 'none'
        this.$nextTick(()=>{
          this.brand.auto = this.$refs.brand.offsetHeight + 'px'
          this.category.auto = this.$refs.category.offsetHeight + 'px'
          this.brand.height = '5.32rem'
          this.category.height = '3.36rem'
        })
      },
      dropCheck (index) {
        if (index === 0) {
          this.brand.status = !this.brand.status
          if (this.brand.status) {
            this.brand.height = this.brand.auto
          } else {
            this.brand.height = '5.32rem'
          }
        }

        if (index === 1) {
          this.category.status = !this.category.status
          if (this.category.status) {
            this.category.height = this.category.auto
          } else {
            this.category.height = '3.36rem'
          }
        }
      },
      back () {
        if (window.history.length<=2) {
          this.$router.push('/home')
        } else {
          this.$router.go(-1)
        }
      }
    }
  }
</script>

<style scoped>
  .mescroll {
    position: fixed;
    top: 1.3rem;
    left: 0;
    bottom: 0;
    height: auto;
  }
  .block {
    padding: 0 .26rem;
  }
  .blockTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.2rem;
  }
  .name {
    flex: none;
    font-size: .48rem;
    color: #333;
    font-weight: bold;
  }
  .more {
    flex: none;
    width: 1rem;
    height: 1rem;
  }
  .more.down {
    background: url("../../../../../assets/img/ic_page_xljt@2x.png") no-repeat center right;
    background-size: .37rem;
  }
  .more.up {
    background: url("../../../../../assets/img/ic_page_fhjt@2x.png") no-repeat center right;
    background-size: .37rem;
  }
  .brandList {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    transition: all 0.5s;
  }
  .brandItem {
    width: 2.933rem;
    height: 1.6rem;
    position: relative;
    margin: 0 .3333rem .26rem 0;
    border: 1px solid #fff;
    box-sizing: border-box;
    border-radius: 0.13rem;
    overflow: hidden;
  }
  .brandItem:nth-child(3n) {
    margin-right: 0;
  }
  .brandImg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: .13rem;
    z-index: -1;
  }
  .brandName {
    font-size: .42rem;
    color: #fff;
    line-height: 1;
    margin-top: .73rem;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .categoryList {
    padding: 0 .26rem;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    transition: all 0.5s;
  }
  .categoryItem {
    margin: 0 .8rem .26rem 0;
    width: 1.133rem;
    height: 1.55rem;
    overflow: hidden;
    position: relative;
  }
  .categoryItem:nth-child(5n) {
    margin-right: 0;
  }
  .categoryImg {
    width: 1.133rem;
    height: 1.133rem;
    pointer-events: none;
  }
  .categoryName {
    position: absolute;
    bottom: 0;
    left: 0;
    text-align: center;
    font-size: .26rem;
    color: #333;
    width: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .louceng {
    margin-top: .26rem;
    width: 100%;
    pointer-events: none;
  }
  .noData {
    line-height: 2rem;
    text-align: center;
    color: #999;
    font-size: .4rem;
  }
</style>
