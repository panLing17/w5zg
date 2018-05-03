<template lang="pug">
  .accountUniversalBox
    nav-bar(background="white")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem")
      .topCenter(slot="center") 通用券
      .topRight(slot="right")
    .balanceBox
      .balance {{balance | number}}
      .balanceDec 余额
    .tabBox
      .left 消费记录
      .right
        ul.list
          li.item(:class="{'active':itemActive===0}", @click="itemChange(0)") 全部
          li.item(:class="{'active':itemActive===1}", @click="itemChange(1)") 收入
          li.item(:class="{'active':itemActive===2}", @click="itemChange(2)") 支出
    .mescroll#mescroll
      .detailBox(v-if="!isEmpty")
        ul.detailList
          li(v-for="item in cashDetail", v-if="item.tran_money!=0")
            .block.top
              // 订单号
              .left 订单号: {{item.order_no}}
              // 交易金额 trade_in_out 126为支出 125为收入
              .right {{item.trade_in_out==='126'?'-':'+'}}{{item.tran_money | number}}
            .block.bottom
              .left 余额: {{item.trade_balance_money | number}}
              .right {{item.creation_time}}
      .nodata(v-if="isEmpty") 暂无相关记录
</template>

<script>
  import {mapState} from 'vuex'

  export default {
      name: "accountUniversalC",
      data () {
        return {
          cashDetail: null,
          itemActive: 0,
          balance: 0.00,
          tradeType: ''
        }
      },
      created () {
        this.getBalance();
      },
      mounted () {
        this.$mescrollInt("mescroll",this.upCallback);
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy();
      },
      filters: {
        // 保留两位小数点
        number (value) {
          return Number(value).toFixed(2)
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
        },
        ...mapState([
          "userData"
          ])
      },
      watch: {
        userData (value) {
          this.balance = value.cash_balance
        }
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
          if (this.tradeType.trim().length !== 0) {
            form.type = this.tradeType
          }
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'logAccount/logs',
            params: form
          }).then(function (response) {
            if (response.data.code === '081') {
              if (response.data.data && response.data.data.rows) {
                successCallback&&successCallback(response.data.data.rows);
              }else {
                successCallback&&successCallback([]);
              }
            } else {
              _this.mescroll.endErr();
            }
          })
        },
        getBalance () {
          this.balance = this.$store.state.userData.cash_balance;
        },
        // 过滤
        itemChange (index) {
          this.itemActive = index;
          switch (parseInt(index)) {
            case 0:
              this.tradeType = ''
              break;
            case 1:
              this.tradeType = '125'
              break;
            case 2:
              this.tradeType = '126'
              break;
          }
          this.cashDetail = []
          this.mescroll.scrollTo( 0, 300 );
          this.mescroll.destroy();
          this.$mescrollInt("mescroll",this.upCallback);
        }
      }
    }
</script>

<style scoped>
  .mescroll {
    position: fixed;
    top: 6.23rem;
    bottom: 0;
    width: 100%;
    height: auto;
  }
  .accountUniversalBox {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .balanceBox {
    width: 100%;
    height: 4rem;
    background: url("../../../../../assets/img/coupon@2x.png") no-repeat top center #ff80ab;
    background-size: auto 100%;
    position: relative;
    color: #fff;
    text-align: center;
  }
  .balance {
    line-height: 4rem;
    font-size: 1rem;
    font-weight: 400;
  }
  .balanceDec {
    position: absolute;
    bottom: .5rem;
    width: 100%;
    font-size: .4rem;
  }
  .tabBox {
    display: flex;
    justify-content: space-between;
    height: .93rem;
    background: #fff;
    padding: 0 .26rem;
    box-sizing: border-box;
    border-bottom: .013rem solid rgb(153,153,153);
  }
  .tabBox .left {
    flex: none;
    line-height: .93rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .tabBox .right {
    flex: none;
  }
  .tabBox .list {
    display: flex;
    align-items: center;
    height: 100%;
  }
  .tabBox .list .item {
    flex: none;
    width: 1.3rem;
    height: .66rem;
    line-height: .66rem;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .4rem;
    border-radius: .1rem;
    margin-right: .5rem;
  }
  .tabBox .list .item:last-child {
    margin: 0;
  }
  .tabBox .list .item.active {
    color: #fff;
    background: #ff80ab;
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
  img {
    pointer-events: none;
  }
</style>
