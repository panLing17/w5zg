<template lang="pug">
  .useDetailBox
    .totalPrice(v-show="selectType==0")
      span.desc 可用总额：
      span.price {{totalBalance}}
      span.desc 元
    ul.contentList(v-show="data && data.length")
      li.item(v-for="(item, index) in data")
        .left(:style="{'background-image': selectType==0?'url(' + require('./redBg.png') + ')':'url(' + require('./grayBg.png') + ')'}")
          .balance
            .icon ￥
            span {{item.tn_balance | number}}
          .balanceDesc 可用余额
        .right(:style="{'background-image': selectType==0?'url(' + require('./keyong.png') + ')':selectType==1?'url(' + require('./yishiyong.png') + ')':'url(' + require('./yiguoqi.png') + ')'}")
          .totalBalance 面额：￥{{item.tn_amount | number}}
          .desc1 领券：{{item.tn_created_time}}
          .desc2 有效期：{{item.tn_end_time}}
          .no 券号：{{item.tn_serial_number}}
    .noData(v-show="!data")
      img(src="./noResult.png")
      .noDataDesc {{selectType==0?'没有可用的现金券哦！':selectType==1?'您没有已使用的现金券！':'您没有已过期的现金券！'}}
</template>

<script>
    export default {
      name: "useDetail",
      data () {
        return {
          selectType: 0,
          data: []
        }
      },
      computed: {
        totalBalance () {
          let t = 0
          if (this.data) {
            this.data.forEach(item => {
              console.log(t)
              t += item.tn_balance
            })
          }
          return t
        }
      },
      created () {
        this.getData(1);
      },
      filters: {
        number(value) {
          return parseFloat(Number(value).toFixed(2));
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
      methods: {
        // 1未使用 0已使用 2已失效
        getData (status) {
          this.data = null;
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'netcard/netcards',
            params: {status:status}
          }).then(function (response) {
            if (response.data.data.length) {
              _this.data = response.data.data;
            }

          })
        }
      }
    }
</script>

<style scoped>
  .useDetailBox {
    padding: 0.26rem .4rem 0;
    box-sizing: border-box;
    margin-top: 2.26rem;
    height: calc(100vh - 2.43rem);
    overflow: auto;
  }
  .contentList {
    margin-top: .26rem;
  }
  .item {
    height: 2.93rem;
    display: flex;
    background: #fff;
    margin-bottom: .26rem;
  }
  .item .left {
    flex: none;
    width: 3rem;
    background-size: 100% 100%;
    line-height: 1;
  }
  .balance {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-top: .96rem;
    color: #fff;
    font-weight: 400;
  }
  .icon {
    font-size: .32rem;
  }
  .balance span {
    font-size: .53rem;
  }
  .balanceDesc {
    text-align: center;
    color: #fff;
    margin-top: .21rem;
    font-size: .32rem;
  }
  .item .right {
    flex: 1;
    padding-left: .53rem;
    line-height: 1;
    position: relative;
    background-size: 100% 100%;
  }
  .totalBalance {
    margin-top: .58rem;
    color: #666;
    font-size: .37rem;
    font-weight: 400;
  }
  .desc1, .desc2 {
    color: #777;
    font-size: .29rem;
  }
  .desc1 {
    margin-top: .21rem;
  }
  .desc2 {
    margin-top: .13rem;
  }
  .no {
    height: .61rem;
    position: absolute;
    bottom: 0;
    left: .53rem;
    line-height: .61rem;
    width: 100%;
    color: #999;
    font-size: .29rem;
  }
  .noData {
    font-size: 0;
    text-align: center;
  }
  .noData img {
    margin-top: 1.33rem;
    width: 2.6rem;
  }
  .noDataDesc {
    margin-top: .26rem;
    color: #777;
    font-size: .37rem;
  }
  img {
    pointer-events: none;
  }
  .totalPrice {
    height: 1.33rem;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 .53rem;
  }
  .desc {
    color: #333;
    font-size: .37rem;
  }
  .price {
    color: #f70057;
    font-size: .42rem;
    font-weight: bold;
    margin-left: .2rem;
  }
</style>
