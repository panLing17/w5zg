<template lang="pug">
  .cashDetail
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 账户明细
      .topRight(slot="right")
        p(style="color:#f50057; font-size: .4rem; font-weight: normal;", @click="openFilter") 筛选
    transition(name="fade")
      .mask(v-show="filterShow", @click.stop="filterShow=false")
    .filterBoxWrapper
      transition(name="fold")
        .filterBox(v-show="filterShow")
          .btn(:class="{'active':filterActive===1}", @click="filterChange(1)") 全部
          .btn(:class="{'active':filterActive===2}", @click="filterChange(2)") 收入
          .btn(:class="{'active':filterActive===3}", @click="filterChange(3)") 支出
    .mescroll#mescroll
      .detailBox(v-if="!isEmpty")
        ul.detailList
          li(v-for="item in cashDetail")
            .block.top
              .left {{item.trade_in_out=='126' ? '消费记录':'消费退款'}}
              .right {{item.trade_in_out=='126'?'-':'+'}}{{item.tran_money | number}}
            .block.center
              .left 流水单号：{{item.trade_no}}
              .right {{item.payment_channel | paymentChannel}}
            .block.bottom
              .left {{item.trade_in_out=='126'?'订单号：':'退货单号：'}}{{item.order_no}}
              .right {{item.creation_time}}
      .nodata(v-if="isEmpty") 暂无相关记录流水
</template>

<script>
  export default {
    name: "accountC",
    data() {
      return {
        cashDetail: null,
        filterShow: false,
        filterActive: 1
      }
    },
    filters: {
      // 保留两位小数点
      number (value) {
        return Number(value).toFixed(2);
      },
      paymentChannel (value) {
        let text = '';
        switch(value) {
          case '131': text = '支付宝'; break;
          case '132': text = '微信'; break;
          case '133': text = '银联'; break;
          default: text = '其他';
        }
        return text;
      }
    },
    computed: {
      // 判断数据是否为空
      isEmpty () {
        if (this.cashDetail == null || this.cashDetail.length === 0) {
          return true;
        }else {
          return false;
        }
      }
    },
    mounted () {
      this.$mescrollInt("mescroll",this.upCallback);
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy();
    },
    methods: {
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          if(page.num === 1){
            self.cashDetail = [];
          }
          self.cashDetail = self.cashDetail.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        let _this = this;
        let form = {
          page: pageNum,
          rows: pageSize
        };
        if (this.filterActive === 2) {
          form.type = '125';
        }else if (this.filterActive === 3) {
          form.type = '126';
        }
        this.$ajax({
          method: 'get',
          url: this.$apiTransaction + 'logThirdpay/logs',
          params: form
        }).then(function (response) {
          if (response.data.data && response.data.data.rows && response.data.data.rows.length>0) {
            successCallback&&successCallback(response.data.data.rows);//成功回调
          }else {
            _this.mescroll.endErr();
          }
        })
      },
      filterChange (index) {
        this.filterActive = index;
        this.filterShow = false;
        this.cashDetail = []
        this.mescroll.resetUpScroll( true )
        this.mescroll.scrollTo( 0, 300 );
      },
      openFilter () {
        this.filterShow = true;
      }
    }
  }
</script>

<style scoped>
  .cashDetail {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .mask {
    width: 100%;
    height: calc(100% - 1.3rem);
    position: fixed;
    top: 1.3rem;
    left: 0;
    z-index: 101;
    background: rgba(51,51,51,.5);
    opacity: 1;
  }
  .mask.fade-enter-active, .mask.fade-leave-active {
    transition: all 0.5s;
  }
  .mask.fade-enter, .mask.fade-leave-to {
    opacity: 0;
  }
  .filterBoxWrapper {
    width: 100%;
    overflow: hidden;
    position: fixed;
    height: 1.8rem;
    top: 1.3rem;
    left: 0;
    z-index:150;
  }
  .filterBox {
    position: absolute;
    z-index: 150;
    width: 100%;
    background: #fff;
    height: 1.8rem;
    transform: translate3d(0,0,0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .8rem;
    box-sizing: border-box;
  }
  .filterBox.fold-enter-active, .filterBox.fold-leave-active {
    transition: all 0.5s;
  }
  .filterBox.fold-enter, .filterBox.fold-leave-to {
    transform: translate3d(0,-100%,0);
  }
  .btn {
    flex: none;
    width: 2.1rem;
    line-height: 1.3rem;
    height: 1.3rem;
    text-align: center;
    background: rgb(242,242,242);
    border-radius: .2rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .btn.active {
    background: rgb(255,128,171);
    color: #fff;
  }
  .detailBox {
    background: #fff;
  }
  .detailList {
    padding: 0 .2rem;
    box-sizing: border-box;
  }
  .detailList li {
    height: 2rem;
    border-bottom: 1px solid #999;
    position: relative;
  }
  .detailList li:last-child {
    border: none;
  }
  .block {
    width: 100%;
    position: absolute;
    left: 0;
    display: flex;
    justify-content: space-between;
    line-height: 1;
  }
  .left {
    flex: none;
  }
  .right {
    flex: 1;
    text-align: right;
  }
  .top {
    top: .26rem;
    font-size: .35rem;
    color: rgb(51,51,51);
  }
  .center {
    top: 50%;
    transform: translateY(-70%);
    color: rgb(51,51,51);
    font-size: .3rem;
  }
  .bottom {
    bottom: .4rem;
    font-size: .3rem;
    color: rgb(153,153,153);
  }
  .nodata {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    color: rgb(153,153,153);
    font-size: .4rem;
  }
</style>
