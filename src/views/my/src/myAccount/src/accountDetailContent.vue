<template lang="pug">
  .accountDetailContent
    .detailBox(v-if="cashDetail")
      ul.detailList(v-if="selected==0")
        li(v-for="item in cashDetail")
          .block.top
            .left {{item.trade_type | tradeType}}
            .right {{item.trade_in_out=='126'?'-':'+'}}{{item.tran_money | number}}
          .block.center
            .left(v-if="selected==1") {{item.no}}
            .right(v-if="item.type") {{item.type}}
          .block.bottom
            .left {{item.trade_in_out=='126'?'订单号：':'退货单号'}}{{item.order_id}}
            .right {{item.creation_time}}
      ul.detailList(v-if="selected==1")
        li(v-for="item in cashDetail")
          .block.top
            .left {{item.dec}}
            .right {{item.price}}
          .block.center
            .left(v-if="selected==1") {{item.no}}
            .right(v-if="item.type") {{item.type}}
          .block.bottom
            .left() {{item.orderNo}}
            .right {{item.date}}
    .nodata(v-if="!cashDetail") 暂无相关记录流水
</template>

<script>
    export default {
      name: "accountDetailContent",
      data () {
        return {
          selected: 0,
          type: 1,
          cashDetail: [],
          logs:[]
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
          this.getData(this.selected);
        }
      },
      created () {
        this.getData(0);
      },
      methods: {
        getData (type) {
          let _this = this;
          this.logs = null;
          this.cashDetail = null;
          if (type == 0) {
            this.$ajax({
              method: 'get',
              url: this.$apiTransaction + 'logAccount/logs',
              params:{}
            }).then(function (response) {
              _this.logs  = response.data.data;
            })
          }else {
            this.$ajax({
              method: 'get',
              url: this.$apiTransaction + 'logThirdpay/logs',
              params:{}
            }).then(function (response) {
              _this.logs = response.data.data;
            })
          }
          // 过滤 1全部 2收入 3支出
          this.filterChange();
        },
        filterChange () {
          switch (parseInt(index)) {
            case 1:
              this.cashDetail = this.logs;
              break;
            case 2:
              this.logs.forEach((item, i) => {
                if (item.trade_in_out === '125') {
                  this.cashDetail.push(item);
                }
              });
              break;
            case 3:
              this.logs.forEach((item, i) => {
                if (item.trade_in_out === '126') {
                  this.cashDetail.push(item);
                }
              });
              break;
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
