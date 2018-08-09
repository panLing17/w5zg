<template lang="pug">
  .paymentResults
    .header
      .back(@click="$router.go(-1)")
        img(src="../../../assets/img/paymentResults2.png")
      .title 支付结果
    .mescroll#mescroll
      .content
        .success(v-if="type==0")
          .iconWrapper
            img(src="../../../assets/img/paymentResults0.png")
          .descWrapper
            .desc1 支付成功
            .desc2 品牌商开始备货啦，请耐心等候
          .btnWrapper
            .left(@click="$router.push('/home')") 返回首页
            .right(@click="$router.push('/my/orderManage')") 查看订单
        .error(v-if="type==1")
          .iconWrapper
            img(src="../../../assets/img/paymentResults1.png")
          .descWrapper
            .desc1 支付失败
            .desc2 已为您保留到“待支付”订单中，请尝试重新
          .btnWrapper
            .left(@click="$router.push('/home')") 返回首页
            .right(@click="$router.push('/my/orderManage?id=1')") 订单中心
        .louceng
          img(src="../../../assets/img/paymentResults3.png")
      Recomment(ref="paymentResultsRecomment", background="rgb(243,243,243)")
</template>

<script>
  import Recomment from './recommend'
  export default {
    name: "paymentResults",
    components: {
      Recomment
    },
    data () {
      return {
        recommendGoods: [],
        type: 0
      }
    },
   created () {
     this.getData()
     this.getUserData()
   },
    mounted () {
      this.$mescrollInt("mescroll",this.upCallback,() => {}, () => {});
    },
    deactivated () {
      this.$store.commit('setPosition', {
        path: '/paymentResult',
        y: this.mescroll.getScrollTop()
      })
    },
    activated () {
      let _this = this
      this.$store.state.position.forEach((now) => {
        if (now.path === '/paymentResult') {
          _this.mescroll.scrollTo(now.y, 0);
        }
      })
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
    },
    methods: {
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll( isLock );
      },
      getUserData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          if (response) {
            self.$store.commit('userDataChange', response.data.data)
          }
        })
      },
      getData () {
        if (this.$route.query.type) {
          this.type = this.$route.query.type
        }
      },
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          self.$refs.paymentResultsRecomment.more(curPageData,page.num,page.size)

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
  .paymentResults {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }
  .mescroll {
    position: absolute;
    top: 1.3rem;
    bottom: 0;
    width: 100%;
    height: auto;
  }
  .header {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 1.3rem;
    background: rgb(247, 0, 87);
    color: #fff;
  }
  .back {
    position: absolute;
    left: .4rem;
  }
  .back img {
    width: .586rem;
  }
  .title {
    font-size: .48rem;
  }
  .iconWrapper {
    font-size: 0;
    text-align: center;
    padding: 1.2rem 0 .53rem;
  }
  .iconWrapper img {
    width: 2rem;
  }
  .descWrapper {
    line-height: 1;
    text-align: center;
  }
  .desc1 {
    font-size: .42rem;
    color:rgb(51,51,51);
    margin-bottom: .4rem;
  }
  .desc2 {
    font-size: .32rem;
    color:rgb(119,119,119);
  }
  .error .btnWrapper .right {
    color: rgb(247,0,87);
    border: 1px solid rgb(247,0,87);
  }
  .btnWrapper {
    margin-top: .53rem;
    display: flex;
    justify-content: center;
  }
  .left, .right {
    width: 2.56rem;
    height: .85rem;
    border-radius: .5rem;
    color: #666;
    border: 1px solid #333;
    line-height: .85rem;
    text-align: center;
  }
  .left {
    margin-right: .8rem;
  }
  .louceng {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.44rem;
    background: rgb(243,243,243);
  }
  .louceng img {
    width: 4.18rem;
  }
  img {
    pointer-events: none;
  }
</style>
