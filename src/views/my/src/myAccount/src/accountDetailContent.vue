<template lang="pug">
  .mescroll#mescroll
    .accountDetailContent
      .detailBox(v-if="!isEmpty")
        ul.detailList(v-if="selected==0")
          li(v-for="item in cashDetail")
            .block.top
              .left {{item.trade_type | tradeType}}
              .right {{item.trade_in_out=='126'?'-':'+'}}{{item.tran_money | number}}
            .block.center
              .right {{item.status_name}}
            .block.bottom
              .left {{item.trade_in_out=='126'?'订单号：':'退货单号：'}}{{item.order_no}}
              .right {{item.creation_time}}
        ul.detailList(v-if="selected==1")
          li(v-for="item in cashDetail")
            .block.top
              .left {{item.trade_type | tradeType}}
              .right {{item.trade_in_out=='126'?'-':'+'}}{{item.tran_money | number}}
            .block.center
              .left 流水单号：{{item.trade_no}}
              .right {{item.payment_channel}}
            .block.bottom
              .left {{item.trade_in_out=='126'?'订单号：':'退货单号：'}}{{item.order_id}}
              .right {{item.creation_time}}
      .nodata(v-if="isEmpty") 暂无相关记录流水
</template>

<script>
    export default {
      name: "accountDetailContent",
      data () {
        return {
          selected: 0,
          type: 1,
          cashDetail: []
        }
      },
      computed: {
        // 判断数据是否为空
        isEmpty () {
          if (this.cashDetail == null || this.cashDetail.length === 0) {
            this.$nextTick(()=> {
              this.mescroll.hideUpScroll();
            })
            return true;
          }else {
            return false;
          }
        }
      },
      filters: {
        // 保留两位小数点
        number (value) {
          return Number(value).toFixed(2);
        },
        tradeType (value) {
          let text = '';
          switch(value) {
            case '121': text = '消费记录'; break;
            case '122': text = '余额提现'; break;
            case '124': text = '消费退款'; break;
            case '128': text = '余额入账（返点）'; break;
            case '127': text = '余额入账（分成）'; break;
          }
          return text;
        }
      },
      watch: {
        '$route' (to, from) {
          this.selected = to.params.id;
          this.type = to.params.type;
          this.cashDetail = []
          this.mescroll.resetUpScroll( true )
          this.mescroll.scrollTo( 0, 300 );
        }
      },
      created () {
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
          if (this.type === '2') {
            form.type = '125';
          }else if (this.type === '3') {
            form.type = '126';
          }
          let url = ''
          if (this.selected == 0) {
            url = 'logAccount/logs'
          }else {
            url = 'logThirdpay/logs'
          }
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + url,
            params: form
          }).then(function (response) {
            if (response.data.data && response.data.data.rows && response.data.data.rows.length>0) {
              successCallback&&successCallback(response.data.data.rows);//成功回调
            }else {
              _this.mescroll.endErr();
            }
          })
        }
      }
    }
</script>

<style scoped>
  .mescroll {
    position: fixed;
    top:0rem;
    bottom: 0;
    width: 100%;
    height: auto;
  }
  .accountDetailContent {
    margin-top: 1.3rem;
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
