<template lang="pug">
  .accountUniversalBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 通用券
      .topRight(slot="right")
    .balanceBox
      .balance 2000.00
      .balanceDec 余额
    .tabBox
      .left 消费记录
      .right
        ul.list
          li.item(:class="{'active':itemActive===0}", @click="itemChange(0)") 全部
          li.item(:class="{'active':itemActive===1}", @click="itemChange(1)") 收入
          li.item(:class="{'active':itemActive===2}", @click="itemChange(2)") 支出
    .detailBox(v-if="cashDetail")
      ul.detailList
        li(v-for="item in cashDetail")
          .block.top
            .left 订单号: {{item.orderNo}}
            .right {{item.price}}
          .block.center
            .left(v-if="item.project") {{item.project}}
          .block.bottom
            .left 余额: {{item.balance}}
            .right {{item.date}}
    .nodata(v-if="!cashDetail") 暂无相关记录
</template>

<script>
    export default {
      name: "accountUniversalC",
      data () {
        return {
          cashDetail: [
            {
              orderNo:'2015548574874',
              price:'+400.00',
              project: '个性休闲修身西装',
              balance: '200.00',
              date: '2018-4-5 12:00'
            },
            {
              orderNo:'2015548574874',
              price:'+400.00',
              balance: '200.00',
              date: '2018-4-5 12:00'
            },
            {
              orderNo:'2015548574874',
              price:'+400.00',
              project: '个性休闲修身西装',
              balance: '200.00',
              date: '2018-4-5 12:00'
            }
          ],
          itemActive: 0
        }
      },
      methods: {
        itemChange (index) {
          this.itemActive = index;
          this.cashDetail = [
            {
              orderNo:'1111111',
              price:'+400.00',
              project: '个性休闲修身西装',
              balance: '200.00',
              date: '2018-4-5 12:00'
            },
            {
              orderNo:'222222',
              price:'+400.00',
              balance: '200.00',
              date: '2018-4-5 12:00'
            },
            {
              orderNo:'333333',
              price:'+400.00',
              project: '个性休闲修身西装',
              balance: '200.00',
              date: '2018-4-5 12:00'
            }
          ]
        }
      }
    }
</script>

<style scoped>
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
</style>
