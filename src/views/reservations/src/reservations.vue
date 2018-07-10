<template lang="pug">
  .wrapNav
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{listLength<99?'预约体验(试穿)':'预约体验单已满(99)'}}
      .topRight(slot="right")
        span(v-if="false") 管理
        img(src="../../../assets/img/share.png" v-if="false")
    .reservations.mescroll#reservationsMescroll
      .notice
        .img
          img(src="../../../assets/img/notice.png")
        .words
          .top 部分体验专柜只支持快递,不支持自提
          .bottom 因销售火爆,到店试穿款式以专柜现货为准
      ul.contList
        li(v-for="item in contLists")
          .topper(@click="$router.push({path:'/goodsDetailed',query:{id:item.gcGoodsSkuVO.gspu_id}})")
            .left
              img(:src="item.gcGoodsSkuVO.gi_image_url | img-filter" @click.prevent="")
            .right
              .up <span v-if="item.gcGoodsSkuVO.carry_type==1">专柜提货</span> {{item.gcGoodsSkuVO.gi_name}}
              .down
                .lefter
                  .realPay <span>实付</span> {{item.gcGoodsSkuVO.direct_supply_price | price-filter}}
                  .shoppePrice <span>专柜价</span> {{item.gcGoodsSkuVO.counter_interval | price-filter}}
                .righter
                  img(src="../../../assets/img/shoppingcartR.png" v-if="false")
          .bottommer
            .left
              img(src="../../../assets/img/didian.png")
              span {{item.store_name}}
            .right
              span 可体验
              span 可提货
      .lineDiv(v-if="false")
        span 已失效的宝贝
      ul.contList(v-if="false")
        li(v-for="item in invalid")
          .topper
            .left
              img(src="")
            .right
              .up <span>专柜提货</span> 大卫杜夫 冷水神秘水女士淡香水 50ml
              .down
                .lefter
                  .realPay <span>实付</span> ￥699
                  .shoppePrice <span>专柜价</span> ￥2000
                .righter
                  img(src="../../../assets/img/shoppingcartR.png" v-if="false")
          .bottommer
            .left
              img(src="../../../assets/img/didian.png")
              span 金鹰天地江宁店(1楼安娜专柜)
            .right
              span(v-if="item.store_type==212 || item.store_type==213") 可体验
              span(v-if="item.store_type==211 || item.store_type==213") 可提货
      .clearBtn(v-if="false") 清空已失效的商品
      .title
        img(src="../../../assets/img/recommend.png")
      recommend#dataId(ref="recommend")
    .deleteBtn(v-if="false")
      .left
        w-checkbox
        p 全选
      .right
        .btn 删除
</template>

<script>
  import {mapState} from 'vuex'
  import recommend from './recommend'
  export default {
    name: "reservations",
    components:{recommend},
    data(){
      return{
        listLength:"", //预约数组的长度
        contLists:[], //预约的数组
        invalid:[{},{}], //失效的数组
      }
    },
    computed: mapState(['position']),
    created(){

    },
    activated () {
      this.showList();
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    mounted(){
      this.showList();
      this.$mescrollInt("reservationsMescroll", this.upCallback, () => {
        this.position.forEach((now) => {
          if (now.path === this.$route.path) {
            this.mescroll.scrollTo(now.y, 0);
          }
        })
      }, (obj) => {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
    },
    methods:{
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll(isLock)
      },
     //列表展示
      showList(){
        let self = this;
        self.$ajax({
          method:"post",
          url:self.$apiGoods + "tryOn/queryTryOnSpu",
          params:{
            page:1,
            rows:99
          }
        }).then(function(res){
          console.log(res.data.data.length);
          self.listLength = res.data.data.length;
          self.contLists = res.data.data;
        })
      },

      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          self.$refs.recommend.more(curPageData,page.num,page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        let self = this;
        self.$ajax({
          method: 'post',
          url:self.$apiGoods + 'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback&&successCallback(response.data.data);//成功回调
        })
      },

      }
    }
</script>

<style scoped>
  #reservationsMescroll{
    position: fixed;
    top: 1.28rem;
    bottom: 0;
  }
  .wrapNav{
    background-color: rgb(242,242,242);
  }
  .reservations{
    background-color: rgb(242,242,242);
    min-height: 100vh;
  }
  .topCenter{
    width: 4.5rem;
    font-size: .5rem;
    font-weight: 400;
    text-align: center;
  }
  .topRight{
    padding-right: .2rem;
  }
  .topRight span{
    display: inline-block;
    font-weight: 400;
    font-size: .4rem;
    padding-top: .1rem;
  }
  .topRight img{
    width: .65rem;
    vertical-align: middle;
    margin-left: .6rem;
    margin-top: -.1rem;
  }
  /*警告--开始*/
  .notice{
    padding: .3rem;
    display: flex;
    background-color: #fff;
    border-bottom: .5px solid #f2f2f2;
  }
  .notice .img img{
    width: .65rem;
  }
  .notice .words{
    padding-left: .3rem;
    font-size: .4rem;
  }
  .notice .words .top{
    color: rgb(247,0,88);
    /*margin-bottom: .05rem;*/
  }
  /*警告--结束*/
  /*内容列表--开始*/
  .contList li{
    margin-top: .3rem;
    padding: .2rem .3rem;
    background-color: #fff;
  }
  .contList li .topper{
    display: flex;
    border-bottom: .5px solid #f2f2f2;
    padding-bottom: .2rem;
  }
  .topper .left{
    width: 2.8rem;
    height: 2.8rem;
  }
  .topper .left img{
    width: 2.8rem;
    height: 2.8rem;
  }
  .topper .right{
    padding-left: .3rem;
    width: 0;
    flex-grow: 1;
  }
  .topper .right .up{
    font-size: .36rem;
    padding-top: .1rem;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
    line-height: 22px;
  }
  .topper .right .up span{
    /*display: inline-block;*/
    border: .5px solid rgb(204,204,204);
    border-radius: .1rem;
    color: rgb(153,153,153);
    padding: 0 .08rem;
    font-size: .3rem;
    margin-right: .1rem;
    line-height: 18px;
  }
  .topper .right .down{
    display: flex;
    justify-content: space-between;
    margin-top: .8rem;
  }
  .topper .right .down .lefter{
    display: flex;
  }
  .realPay{
    font-size: .45rem;
    color: rgb(244,0,87);
    font-weight: 500;
    display: flex;
    align-items: center;
  }
  .realPay span{
    font-size: .25rem;
    border: .5px solid rgb(244,0,87);
    border-radius: .3rem;
    padding: 0 .15rem;
    margin-right: .1rem;
  }
  .shoppePrice{
    display: flex;
    align-items: center;
    margin-left: .2rem;
    color: rgb(119,119,119);
    font-weight: 600;
  }
  .shoppePrice span{
    font-weight: 400;
  }
  .topper .right .down .righter img{
    width: .65rem;
  }
  .bottommer{
    display: flex;
    justify-content: space-between;
    padding-top: .2rem;
  }
  .bottommer .left{
    width: 60%;
    display: flex;
  }
  .bottommer .left img{
    width: .32rem;
    height: .4rem;
    vertical-align: middle;
  }
  .bottommer .left span{
    font-size: .34rem;
    margin-left: .2rem;
    margin-top: -.03rem;
    color: rgb(160,160,160);
  }
  .bottommer .right{
    display: flex;
    align-items: center;
  }
  .bottommer .right span{
    border: .5px solid rgb(244,0,87);
    border-radius: .1rem;
    color: rgb(244,0,87);
    padding: 0 .05rem;
    margin-left: .2rem;
    font-size: .25rem;
  }
  /*内容列表--结束*/
  /*已失效的宝贝--开始*/
  .lineDiv{
    border-top: 1px solid rgb(215,215,215);
    margin: 1.5rem .3rem 1rem;
    position: relative;
  }
  .lineDiv span{
    display: inline-block;
    background-color: #f2f2f2;
    padding: .3rem;
    color: rgb(119,119,119);
    font-size: .35rem;
    position: absolute;
    top: -.6rem;
    left: 3.3rem;
  }
  /*已失效的宝贝--结束*/
  /*清空已失效的按钮--开始*/
  .clearBtn{
    width: 4.5rem;
    height: 1rem;
    margin: 1rem auto 0;
    border: .5px solid rgb(102,102,102);
    border-radius: 1rem;
    text-align: center;
    line-height: 1rem;
    font-size: .35rem;
    color: rgb(102,102,102);
  }
  /*清空已失效的按钮--结束*/
  /*批量删除--开始*/
  .deleteBtn{
    height: 1.2rem;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
  }
  .deleteBtn .left{
    display: flex;
    align-items: center;
    font-size: .4rem;
    padding-left: .5rem;
  }
  .deleteBtn .left p{
    margin-top: -.1rem;
    margin-left: .1rem;
  }
  .deleteBtn .right{
    display: flex;
    align-items: center;
  }
  .deleteBtn .right .btn{
    line-height: 1.2rem;
    font-size: .4rem;
    width: 3rem;
    background-color: #f59122;
    color: #fff;
    text-align: center;
  }
  /*批量删除--结束*/
  /*推荐--开始*/
  .title{
    height: 1rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }
  .title img{
    width: 55%;
  }
</style>
