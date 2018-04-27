<template lang="pug">
  .sports
    nav-bar(background="white")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") {{$route.query.title}}
      .topRight(slot="right")
    .mescroll#sportsMescroll
      .content
        carousel(:indicators="true", :auto="5000", v-if="banner.length > 0", :responsive="0", style="height:4rem")
          div(v-for="tag in banner", style="width:100%" )
            img(:src="tag.ac_phone_image | img-filter" , style="width:100%;height:4rem")
        .recommendWrapper(v-if="!isEmpty")
          w-recommend(:listData="recommendGoods")
          <!--ul.list-->
            <!--li.item(v-for="item in recommendGoods", @click="$router.push({path: '/goodsDetailed',query: {id: item.gspu_id}})")-->
              <!--img.img(:src="item.gi_image_url | img-filter")-->
              <!--.nameWrapper-->
                <!--// carry_type 1可自提 2不可自提-->
                <!--span.maybe(v-if="item.carry_type===1") 专柜提货-->
                <!--span.name {{item.gi_name}}-->
              <!--.price-->
                <!--span.current ￥{{item.price | round}}-->
                <!--span.save(v-if="userData.member_type !== '092' && item.economize_price !== 0") 可省{{item.economize_price}}元-->
        .noData(v-if="isEmpty") 暂无推荐商品
</template>

<script>
  import {mapState} from 'vuex'
    export default {
      name: "sports",
      data () {
        return {
          banner: [],
          recommendGoods: [],
          parentId: null,
          parentType: null,
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
      computed: {
        ...mapState(['userData']),
        // 判断数据是否为空
        isEmpty () {
          if (this.recommendGoods == null || this.recommendGoods.length === 0) {
            this.$nextTick(()=> {
              this.mescroll.hideUpScroll();
            })
            return true;
          }else {
            return false;
          }
        }
      },
      created () {
        this.getParmas();
        // 获取banner
        this.getBanner();

      },
      mounted () {
        this.$mescrollInt("sportsMescroll",this.upCallback);
      },
      methods: {
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
            if(page.num === 1){
              self.recommendGoods = [];
            }
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
            if (response.data.data && response.data.data.rows && response.data.data.rows.length>0) {
              successCallback&&successCallback(response.data.data.rows);//成功回调
            }else {
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
    top: 1.3rem;
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
  /*.list {*/
    /*display: flex;*/
    /*justify-content: space-between;*/
    /*flex-wrap: wrap;*/
    /*padding: .2rem;*/
  /*}*/
  /*.item {*/
    /*float: left;*/
    /*width: 49%;*/
    /*!*border: solid 1px #ccc;*!*/
    /*background:#fff;*/
    /*border-radius: 5px;*/
    /*overflow: hidden;*/
    /*margin-bottom: .2rem;*/
    /*position: relative;*/
  /*}*/
  /*.img {*/
    /*position: absolute;*/
    /*top: 0;*/
    /*left: 0;*/
    /*width: 100%;*/
    /*max-height: 4rem;*/
  /*}*/
  /*.nameWrapper {*/
    /*padding: 0 .1rem;*/
    /*font-size: .32rem;*/
    /*!*line-height: 1.5;*!*/
    /*display: -webkit-box;*/
    /*-webkit-box-orient: vertical;*/
    /*-webkit-line-clamp: 2;*/
    /*overflow: hidden;*/
    /*margin-top: 4.2rem;*/
    /*height: .85rem;*/
  /*}*/
  /*.maybe {*/
    /*padding: .1rem .2rem;*/
    /*background: rgb(245,0,87);*/
    /*color: #fff;*/
    /*border-radius: .4rem;*/
    /*display: inline-block;*/
    /*margin-right: .13rem;*/
    /*line-height: 1;*/
  /*}*/
  /*.name {*/
    /*color: rgb(51,51,51);*/
  /*}*/
  /*.price {*/
    /*margin-top: .33rem;*/
    /*padding:0 .1rem .26rem;*/
    /*font-size: .29rem;*/
    /*color: rgb(245,0,87);*/
    /*overflow: hidden;*/
    /*text-overflow: ellipsis;*/
    /*white-space: nowrap;*/
    /*display: flex;*/
    /*justify-content: space-between;*/
  /*}*/
  /*.current {*/
    /*font-weight: 400;*/
    /*margin-right: .26rem;*/
  /*}*/
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
