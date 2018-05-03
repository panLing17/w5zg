<template lang="pug">
  .paymentResults
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") {{type==0?'支付成功':'支付失败'}}
      .topRight(slot="right")
    .mescroll#mescroll
      .content
        .successContent(v-if="type==0")
          .infoWrapper
            .price ￥{{price}}
            .dec 支付成功
            <!--.git 获得￥200.00元现金券-->
            .git (品牌商正在备货，请耐心等候)
            .btnWrapper
              .left(@click="$router.push('/home')") 返回首页
              <!--.right() 查看订单-->
        .errorContent(v-if="type==1")
          img.icon(src="../../../assets/img/图层15@2x.png")
          .dec 支付失败
          .btnWrapper
            .left(@click="$router.push('/home')") 返回首页
            .right(@click="$router.push('/my/orderManage')") 订单中心
        img.ewm(src="../../../assets/img/gzh.jpg")
        .recommendWrapper
          .recommendTitle 推荐
          w-recommend(:listData="recommendGoods")
</template>

<script>
  export default {
    name: "paymentResults",
    data () {
      return {
        recommendGoods: [],
        type: 0,
        price: 0
      }
    },
   created () {
      this.getData()
   },
    mounted () {
      this.$mescrollInt("mescroll",this.upCallback);
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
    },
    methods: {
      getData () {
        this.type = this.$route.query.type
        this.price = this.$route.query.price
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
          url:self.$apiGoods +  'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if(response.data.code === '081') {
            successCallback&&successCallback(response.data.data);//成功回调
          }else {
            self.mescroll.endErr();
          }
        })
      },
    }
  }
</script>

<style scoped>
  .mescroll {
    position: fixed;
    top: 1.3rem;
    bottom: 0;
    width: 100%;
    height: auto;
  }
  .paymentResults {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .errorContent, .successContent {
    text-align: center;
    font-size: 0;
    line-height: 1;
  }
  .errorContent {
    background: #fff;
    padding-bottom: .45rem;
  }
  .icon {
    width: 1.1rem;
    margin-top: .58rem;
  }
  .dec {
    font-size: .42rem;
    color: rgb(51,51,51);
    font-weight: 400;
    line-height: 1;
    margin-top: .48rem;
  }
  .btnWrapper {
    display: flex;
    justify-content: center;
    margin-top: .9rem;
  }
  .left, .right {
    flex: none;
    width: 2.6rem;
    height: .93rem;
    border-radius: .53rem;
    font-size: .34rem;
    line-height: .93rem;
    text-align: center;
  }
  .left {
    color: rgb(153,153,153);
    border: 1px solid rgb(153,153,153);
  }
  .right {
    color: rgb(245,0,87);
    border: 1px solid rgb(245,0,87);
    margin-left: 2rem;
  }
  .price {
    font-size: .48rem;
    color: rgb(51,51,51);
    padding-top: .72rem;
  }
  .successContent .dec {
    color: rgb(245,0,87);
    padding-bottom: .29rem;
    margin-top: .4rem;
  }
  .git {
    font-size: .32rem;
    color: rgb(153,153,153);

  }
  .infoWrapper {
    padding-bottom: .48rem;
    background: #fff;
  }
  .recommendTitle {
    height: .8rem;
    line-height: .8rem;
    text-align: center;
    font-size: .37rem;
    color: rgb(51,51,51);
    position: relative;
  }
  .recommendTitle:before, .recommendTitle:after {
    content: '';
    display: block;
    width: 1.5rem;
    height: 2px;
    background: #ccc;
    position: absolute;
    top: 50%;

    transform: translate(-50%, -50%);
  }
  .recommendTitle:before {
    left: 35%;
  }
  .recommendTitle:after {
    right: 20%
  }
  .ewm {
    width: 30%;
    margin-top: .26rem;
  }
  .content {
    text-align: center;
  }
</style>
