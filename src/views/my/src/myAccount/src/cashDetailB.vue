<template lang="pug">
    .cashDetail
      nav-bar(background="white")
        .topLeft(slot="left")
          img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
        .topCenter(slot="center") 现金券明细
        .topRight(slot="right")
          p(style="color:#f50057; font-size: .4rem; font-weight: normal;", @click="openFilter") 筛选
      transition(name="fade")
        .mask(v-show="filterShow", @click="filterShow=false")
      .filterBoxWrapper
        transition(name="fold")
          .filterBox(v-show="filterShow")
            .btn(:class="{'active':filterActive===1}", @click="filterChange(1)") 全部
            .btn(:class="{'active':filterActive===2}", @click="filterChange(2)") 收入
            .btn(:class="{'active':filterActive===3}", @click="filterChange(3)") 支出
      .detailBox(v-if="cashDetail")
        ul.detailList
          li(v-for="item in cashDetail")
            .block.top
              .left {{item.trade_in_out=='126' ? '现金券发放':'现金券收入'}}
              .right {{item.trade_in_out==='125'?'+':'-'}}{{item.tran_money | number}}
            .block.center
              .left(v-if="item.cardNo") 卡号: {{item.cardNo}}
              .right(v-if="item.expire") 到期日: {{item.expire}}
            .block.bottom
              .left(v-if="item.userId") 用户ID: {{item.userId}}
              .right {{item.creation_time}}
      .nodata(v-if="!cashDetail") 暂无相关记录流水
</template>

<script>
    export default {
        name: "cashDetailB",
        data() {
          return {
            cashDetail: null,
            filterShow: false,
            filterActive: 1
          }
        },
      watch: {
        // 模态框出现禁止页面滑动
        filterShow (cur, old) {
          if (cur) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
          }else {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
          }
        }
      },
      filters: {
        // 保留两位小数点
        number (value) {
          return Number(value).toFixed(2);
        }
      },
      created () {
        this.getCashDetail();
      },
      methods: {
        getCashDetail () {
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'logNetcard/logs',
            params:{}
          }).then(function (response) {
            _this.logs = _this.cashDetail = response.data.data;
          })
        },
        filterChange (index) {
          this.filterActive = index;
          this.filterShow = false;
        },
        openFilter () {
          this.filterShow = true;
        }
      }
    }
</script>

<style scoped>
  .cashDetail {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
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
    height: 1.8rem;
    top: 1.3rem;
    left: 0;
    z-index:150;
  }
  .filterBox {
    position: absolute;
    z-index: 150;
    width: 100%;
    background: #fff;
    height: 1.8rem;
    transform: translate3d(0,0,0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: .8rem;
    box-sizing: border-box;
  }
  .filterBox.fold-enter-active, .filterBox.fold-leave-active {
    transition: all 0.5s;
  }
  .filterBox.fold-enter, .filterBox.fold-leave-to {
    transform: translate3d(0,-100%,0);
  }
  .btn {
    flex: none;
    width: 2.1rem;
    line-height: 1.3rem;
    height: 1.3rem;
    text-align: center;
    background: rgb(242,242,242);
    border-radius: .2rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .btn.active {
    background: rgb(255,128,171);
    color: #fff;
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
