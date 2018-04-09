<template lang="pug">
  .accountDetailContent
    .detailBox(v-if="cashDetail")
      ul.detailList
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
          cashDetail: [
            {
              dec: '消费记录',
              price: '-779.00',
              orderNo: '订单号：25646856546545',
              date: '2018-03-15 15:45'
            },
            {
              dec: '消费退款',
              price: '+169.00',
              type: '余额',
              orderNo: '订单号：25646856546545',
              date: '2018-03-15 17:25'
            },
            {
              dec: '余额入账',
              price: '+2000.00',
              type: '已结算',
              orderNo: '订单号：25646856546545',
              date: '2018-03-15 16:17'
            },
            {
              dec: '余额提现',
              price: '-10000.00',
              orderNo: '订单号：25646856546545',
              date: '2018-03-15 16:17'
            }
          ]
        }
      },
      watch: {
        '$route' (to, from) {
          this.selected = to.params.id;
          if (this.selected == 0) {
            this.cashDetail = [
              {
                dec: '消费记录',
                price: '-779.00',
                orderNo: '订单号：25646856546545',
                date: '2018-03-15 15:45'
              },
              {
                dec: '消费退款',
                price: '+169.00',
                type: '余额',
                orderNo: '订单号：25646856546545',
                date: '2018-03-15 17:25'
              },
              {
                dec: '余额入账',
                price: '+2000.00',
                type: '已结算',
                orderNo: '订单号：25646856546545',
                date: '2018-03-15 16:17'
              },
              {
                dec: '余额提现',
                price: '-10000.00',
                orderNo: '订单号：25646856546545',
                date: '2018-03-15 16:17'
              }
            ]
          }else {
            this.cashDetail = [
              {
                dec: '消费记录',
                price: '-779.00',
                type: '微信',
                no:'流水单号：1545484784154151351',
                orderNo: '订单号：25646856546545',
                date: '2018-03-15 15:45'
              },
              {
                dec: '消费退款',
                price: '+169.00',
                no:'流水单号：1545484784154151351',
                type: '支付宝',
                orderNo: '订单号：25646856546545',
                date: '2018-03-15 17:25'
              }
            ]
          }
        }
      }
    }
</script>

<style scoped>
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
