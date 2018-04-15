<template lang="pug">
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
          this.getData();
        }
      },
      created () {
        this.getData();
      },
      methods: {
        getData () {
          let _this = this;
          this.cashDetail = [];
          let form = {};
          if (this.type == 2) {
           form.type = '125'
          }else if (this.type == 3) {
            form.type = '126'
          }
          if (this.selected == 0) {
            this.$ajax({
              method: 'get',
              url: this.$apiTransaction + 'logAccount/logs',
              params:form
            }).then(function (response) {
              _this.cashDetail  = response.data.data;
            });
          }else {
            this.$ajax({
              method: 'get',
              url: this.$apiTransaction + 'logThirdpay/logs',
              params:form
            }).then(function (response) {
              _this.cashDetail = response.data.data;
            });
          }
        }
      }
    }
</script>

<style scoped>
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
