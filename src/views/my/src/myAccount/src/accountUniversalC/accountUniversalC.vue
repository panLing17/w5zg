<template lang="pug">
  .accountUniversalBox
    nav-bar(background="#f70057")
      .topLeft(slot="left", @click="$router.go(-1)")
        img(src="./back.png", style="width:.586rem")
      .topCenter(slot="center", style="color:#fff") 通用券
      .topRight(slot="right", @click="$router.push('/my/universalExplain')")
        img(src="./desc.png", style="width: 2rem")
    .tabBox.active(v-show="tabBoxActive")
      ul.list
        li.normalL.item(:class="{'active':itemActive===0}", @click="itemChange(0)") 全部明细
        li.special.item(:class="{'active':itemActive===1}", @click="itemChange(1)") 收入
        li.normalR.item(:class="{'active':itemActive===2}", @click="itemChange(2)") 支出
        li.line
    scroll.content(ref="scroll", :data="cashDetail", :pullup="pullup", @scrollToEnd="loadMore", :probeType="probeType", @scroll="scroll", :listenScroll="listenScroll", :pulldown="pulldown", @pullDownFun="pullDownFun")
      div
        .balanceBox(ref="balanceBox")
          .balance {{balance | number2}}
          .balanceDec 余额 (元)
        .tabBox
          ul.list
            li.normalL.item(:class="{'active':itemActive===0}", @click="itemChange(0)") 全部明细
            li.special.item(:class="{'active':itemActive===1}", @click="itemChange(1)") 收入
            li.normalR.item(:class="{'active':itemActive===2}", @click="itemChange(2)") 支出
            li.line
        .detailBox(ref="detailBox")
          ul.detailList
            li(v-for="item in cashDetail", v-if="item.tran_money!=0")
              .itemLeft
                img(:src="item.trade_in_out==='125'?require('./shou.png'):require('./zhi.png')")
              .itemCenter
                .name {{item.trade_type | tradeType}}
                .no 订单号：{{item.order_no}}
                .time {{item.creation_time}}
              .itemRight
                .price(:style="{color: item.trade_in_out==='125'?'#f70057':'#019f69'}") {{item.trade_in_out==='125'?'+':'-'}}{{item.tran_money | number}}
                .balancePrice 余额：{{item.trade_balance_money | number}}
        loading(v-show="hasMore")
        no-more(v-show="!hasMore && cashDetail.length")
          .nodata(v-show="!cashDetail.length")
            img(src="./cash.png")
            .desc 没有资金流水记录
</template>

<script>
  import Scroll from 'components/scroll'
  import Loading from 'components/loading/loading'
  import NoMore from 'components/noMore'
  export default {
      name: "accountUniversalC",
      data () {
        return {
          cashDetail: [],
          itemActive: 0,
          balance: 0,
          tradeType: '',
          pullup: true,
          pulldown: true,
          page: 1,
          rows: 10,
          hasMore: true,
          probeType: 3,
          tabBoxActive: false,
          listenScroll: true
        }
      },
      components: {
        Scroll,
        Loading,
        NoMore
      },
      created () {
        this.getBalance();
        this.getData()
      },
      mounted () {

      },
      beforeDestroy () {

      },
      filters: {
        number2 (value) {
          return Number(value).toFixed(2)
        },
        // 保留两位小数点
        number (value) {
          return parseFloat(Number(value).toFixed(2))
        },
        tradeType (value) {
          let text = '';
          switch(value) {
            case '121': text = '消费记录'; break;
            case '122': text = '余额提现'; break;
            case '124': text = '消费退款'; break;
            case '128': text = '余额入账（返点）'; break;
            case '127': text = '余额入账（分成）'; break;
            case '1211': text = '取消订单'; break;
          }
          return text;
        }
      },
      methods: {
        pullDownFun(){
          this.$refs.scroll.resetParams()
          this.getData()
        },
        scroll(pos) {
          // console.log(-pos.y+'==========='+this.$refs.balanceBox.offsetHeight)
          if (-pos.y >= this.$refs.balanceBox.offsetHeight) {
            this.tabBoxActive = true
          }else {
            this.tabBoxActive = false
          }
        },
        loadMore() {
          if (!this.hasMore) {
            return
          }
          this.page++
          this.getData()
        },
        getData() {
          let self = this;
          let form = {
            page: this.page,
            rows: this.rows
          };
          if (this.tradeType.trim().length !== 0) {
            form.type = this.tradeType
          }
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'logAccount/logs',
            params: form
          }).then(function (response) {
            if (response) {
              //self.$refs.scroll.resetParams()
              if (response.data.data) {
                self.cashDetail = self.cashDetail.concat(response.data.data.rows)
                if (self.cashDetail.length === 0 || self.cashDetail.length<self.rows) {
                  self.hasMore = false
                }
              } else {
                self.hasMore = false
              }

            }
          })
        },
        getBalance() {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiMember + 'member/currentMember',
            params: {}
          }).then(function (response) {
            if (response) {
              self.balance = response.data.data.cash_balance
            }
          })
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
          this.hasMore = true
          this.page = 1
          this.cashDetail = []
          this.tabBoxActive = false
          this.getData()

        }
      }
    }
</script>

<style scoped lang="stylus">
  .mescroll {
    position: fixed;
    top: 7.38rem;
    bottom: 0;
    width: 100%;
    height: auto;
  }
    .content {
      height: calc(100vh - 1.3rem);
      overflow hidden
      position relative
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
    height: 5.12rem;
    /*padding: .42rem .4rem 0;*/
    background: url("./bg.png") no-repeat bottom center #fff;
    background-size: 9.2rem 4.69rem;
    position: relative;
    color: #fff;
    text-align: center;
  }
  .balance {
    position: absolute;
    top: 1.44rem;
    width: 100%;
    font-size: 1.28rem;
    font-weight: 400;
  }
  .balanceDec {
    position: absolute;
    top: 2.93rem;
    width: 100%;
    font-size: .37rem;
  }
  .tabBox {
    width: 100%;
    height: .96rem;
    background: #fff;
    box-sizing: border-box;
    border-bottom: .013rem solid #cecece;
  }
  .tabBox.active {
    position absolute
    top 1.3rem
    left 0
    z-index 10
  }
  .tabBox .list {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .tabBox .item {
    height: 100%;
    flex: none;
    line-height: .96rem;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .4rem;
    position: relative;
  }
  .normalL, .normalR {
    width: 35%;
  }
  .item.special{
    width: 30%;
  }
  .normalL:before, .normalR:before {
    content: '';
    width: 1px;
    height: .66rem;
    background: #cecece;
    display: block;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .normalL:before {
    right: 0;
  }
  .normalR:before {
    left: 0;
  }
  .tabBox .list .item.active {
    color: #f70057;
  }
  .tabBox .list .item.active:after {
    content: '';
    width: 1.86rem;
    height: .08rem;
    background: #f70057;
    display: block;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .detailBox {
    background: #fff;
    min-height: calc(100vh - 8.9rem);
  }
  .detailList {
    padding: 0 .4rem;
    box-sizing: border-box;
  }
  .detailList li {
    height: 2.26rem;
    border-bottom: 1px solid #cecece;
    display: flex;
    align-items: center;
    .itemLeft {
      font-size 0
      img {
        width 1rem
      }
    }
    .itemCenter {
      flex 1
      margin 0 .26rem
      line-height 1
      .name {
        font-size .37rem
        color #333
        font-weight 400
      }
      .no {
        color #666
        font-size .32rem
        margin-top .26rem
      }
      .time {
        font-size .29rem
        margin-top .16rem
        color #666
      }
    }
    .itemRight {
      line-height 1
      text-align right
      .price {
        font-size .42rem
        font-weight 400
      }
      .balancePrice {
        color #666666
        font-size .29rem
        margin-top .21rem
      }
    }
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
    margin-top: 1.6rem;
    width: 100%;
    text-align: center;
    font-size: 0;
    background: rgb(242,242,242);
    img {
      width: 2.66rem;
    }
    .desc {
      color: #777;
      font-size: .37rem;
      margin-top: .26rem;
    }
  }
  img {
    pointer-events: none;
  }
</style>
