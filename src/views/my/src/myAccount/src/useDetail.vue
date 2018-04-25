<template lang="pug">
  .useDetailBox
    ul.contentList(v-if="!isEmpty")
      li.item(v-for="(item,index) in data")
        p.info ID: {{item.tn_serial_number}}
        p.info.last {{item.tn_created_time}}
        p.balance(:style="{'color':balanceColor}")
          span.left 余额
          span.right ￥{{item.tn_balance | number}}
        p.total 总额 ￥{{item.tn_amount | number}}
        p.dec.first 商户ID：{{item.tn_contract_id}}
        p.dec.last {{item.tn_end_time}} 前使用
        img.icon(:src="iconImg(index)")
        img.bg(:src="bgImg")
    .nodata(v-if="isEmpty")
      img(src="../../../../../assets/img/noCard.png")
</template>

<script>
    export default {
      name: "useDetail",
      data () {
        return {
          selectType: 0,
          data: null
        }
      },
      created () {
        this.getData(1);
      },
      filters: {
        number(value) {
          return Number(value).toFixed(2);
        }
      },
      watch: {
        '$route' (to, from) {
          this.selectType = to.params.id;
          if (this.selectType == 0) {
            this.getData(1);
          }else if (this.selectType == 1) {
            this.getData(0);
          }else {
            this.getData(2);
          }
        }
      },
      computed : {
        // 判断数据是否为空
        isEmpty () {
          if (this.data == null || this.data.length === 0) {
            return true;
          }else {
            return false;
          }
        },
        bgImg () {
          let img = '';
          switch (parseInt(this.selectType)) {
            case 0:
              img = require('../../../../../assets/img/ff80ab@2x.png');
              break;
            case 1:
              img = require('../../../../../assets/img/cccccc@2x.png');
              break;
            case 2:
              img = require('../../../../../assets/img/999999@2x.png');
              break;
          }
          return img;
        },
        balanceColor () {
          let col = '';
          if (parseInt(this.selectType) === 0) {
            col = 'rgb(245,0,87)';
          }else {
            col = 'rgb(153,153,153)';
          }
          return col;
        }
      },
      methods: {
        // 1全部 0已使用 2已失效
        getData (status) {
          this.data = null;
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'netcard/netcards',
            params: {status:status}
          }).then(function (response) {
            _this.data = response.data.data;
          })
        },
        iconImg(index) {
          let img = '';
          if (this.selectType == 0) {
            if (this.data[index].tn_amount == this.data[index].tn_balance ) {
              img = require('../../../../../assets/img/unused@2x.png');
            }else {
              img = require('../../../../../assets/img/someues@2x.png');
            }
          }else if (this.selectType == 1) {
            img = require('../../../../../assets/img/havebeenuesd@2x.png');
          }else {
            img = require('../../../../../assets/img/outofdate@2x.png');
          }
          return img;
        }
      }
    }
</script>

<style scoped>
  .useDetailBox {
    padding: 0 .2rem;
    box-sizing: border-box;
    margin-top: 2.43rem;
    height: calc(100vh - 2.43rem);
    overflow: auto;
  }
  .item {
    background: #fff;
    margin-top: .26rem;
    border-radius: .3rem;
    position: relative;
  }
  .info {
    color: rgb(153,153,153);
    font-size: .32rem;
    padding: .26rem .26rem 0 0;
    text-align: right;
  }
  .info.last {
    padding-top: .18rem;
  }
  .icon {
    position: absolute;
    top: .26rem;
    left: .26rem;
    width: 1rem;
  }
  .balance {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: .3rem;
    padding-right: .8rem;
    box-sizing: border-box;
  }
  .balance .left {
    font-size: .32rem;
    line-height: .32rem;
  }
  .balance .right {
    line-height: .7rem;
    font-size: .8rem;
    font-weight: 400;
    margin-left: .16rem;
    letter-spacing: -0.05rem;
  }
  .bg {
    width: 100%;
    position: absolute;
    top: 1.2rem;
    left: 0;
  }
  .total {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 2.3rem;
    z-index: 110;
    color: #fff;
    font-size: .48rem;
    font-weight: 400;
  }
  .dec {
    color: rgb(153,153,153);
    font-size: .32rem;
    padding: .16rem 0 0 .26rem;
  }
  .dec.first {
    padding-top: 1rem;
  }
  .dec.last {
    padding-bottom: .26rem;
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
  .nodata img {
    width: 2.6rem;
  }
</style>
