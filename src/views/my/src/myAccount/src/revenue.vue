<template lang="pug">
  .revenue
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 预计收入明细
      .topRight(slot="right")
        p(style="color:#f50057; font-size: .4rem; font-weight: normal;", @click="filterShow=true") 筛选
    transition(name="fade")
      .mask(v-show="filterShow", @click="filterShow=false")
    .filterBoxWrapper
      transition(name="fold")
        .filterBox(v-show="filterShow")
          .btnWrapper
            .btn(:class="{'active':filterActive===1}", @click="filterChange(1)") 全部
            .btn(:class="{'active':filterActive===2}", @click="filterChange(2)") 代购分成
            .btn(:class="{'active':filterActive===3}", @click="filterChange(3)") 现金券返点
          .btnWrapper
            .btn(:class="{'active':filterActive===4}", @click="filterChange(4)") 余额入账
            .btn(:class="{'active':filterActive===5}", @click="filterChange(5)") 代购退款
            .btn(:class="{'active':filterActive===6}", @click="filterChange(6)") 返点退款
    .content
      .detailBox(v-if="cashDetail")
        ul.detailList
          li(v-for="item in cashDetail")
            .block.top
              .left {{item.dec}}
              .right {{item.price}}
            .block.center
              .left {{item.no}}
            .block.bottom
              .right {{item.date}}
      .nodata(v-if="!cashDetail") 暂无相关记录流水
</template>

<script>
    export default {
      name: "revenue",
      data () {
        return {
          cashDetail: [
            {
              dec: '消费记录',
              price: '-779.00',
              no:'流水单号：1545484784154151351',
              date: '2018-03-15 15:45'
            },
            {
              dec: '消费退款',
              price: '+169.00',
              no:'流水单号：1545484784154151351',
              date: '2018-03-15 17:25'
            }
          ],
          filterShow: false,
          filterActive: 1
        }
      },
      methods: {
        filterChange (index) {
          this.filterActive = index;
          this.filterShow = false;
        }
      }
    }
</script>

<style scoped>
  .revenue {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
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
    color: rgb(153,153,153);
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
    height: 3.5rem;
    top:1.3rem;
    left:0;
    z-index: 150;
  }
  .filterBox {
    position: absolute;
    z-index: 150;
    width: 100%;
    background: #fff;
    height: 3.5rem;
    transform: translate3d(0,0,0);
    padding:0 .8em;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .filterBox.fold-enter-active, .filterBox.fold-leave-active {
    transition: all 0.5s;
  }
  .filterBox.fold-enter, .filterBox.fold-leave-to {
    transform: translate3d(0,-100%,0);
  }
  .btnWrapper {
    display: flex;
    justify-content: space-between;
  }
  .btn {
    flex: none;
    width: 2.26rem;
    line-height: 1.3rem;
    height: 1.3rem;
    text-align: center;
    border-radius: .21rem;
    font-size: .4rem;
    color: rgb(51,51,51);
    background: rgb(242,242,242);
  }
  .btn.active {
    background: rgb(255,128,171);
    color: #fff;
  }
</style>
