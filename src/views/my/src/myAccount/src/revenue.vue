<template lang="pug">
  .revenue
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 预计收入明细
      .topRight(slot="right")
        p(style="color:#f50057; font-size: .4rem; font-weight: normal;", @click="filterShow=true") 筛选
    transition(name="fade")
      .mask(v-show="filterShow", @click.stop="filterShow=false")
    .filterBoxWrapper
      transition(name="fold")
        .filterBox(v-show="filterShow")
          .btnWrapper
            .btn(:class="{'active':filterActive===1}", @click="filterChange(1,0)") 全部
            .btn(:class="{'active':filterActive===2}", @click="filterChange(2,127)") 消费提成
            .btn(:class="{'active':filterActive===3}", @click="filterChange(3,122)") 提现金额
          .btnWrapper
            .btn(:class="{'active':filterActive===4}", @click="filterChange(4,128)") 消费返点
            .btn(:class="{'active':filterActive===5}", @click="filterChange(5,123)") 充值提成
            .btn(:class="{'active':filterActive===6}", @click="filterChange(6,124)") 返点退款
    .mescroll#mescroll
      .content
        .detailBox(v-if="!isEmpty")
          ul.detailList
            li(v-for="item in cashDetail")
              .block.top
                .left {{item.trade_type | tradeType}}
                .right {{item.trade_in_out==='125'?'+':'-'}}{{item.tran_money | number}}
              .block.center
                .left 流水单号: {{item.serial_number}}
              .block.bottom
                .right {{item.creation_time}}
        .nodata(v-if="isEmpty") 暂无相关记录流水
</template>

<script>
    export default {
      name: "revenue",
      data () {
        return {
          cashDetail: [],
          filterShow: false,
          filterActive: 1,
          type: 0
        }
      },
      filters: {
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
        },
        // 保留两位小数点
        number (value) {
          return Number(value).toFixed(2);
        }
      },
      computed: {
        // 判断数据是否为空
        isEmpty () {
          if (this.cashDetail === null || this.cashDetail.length === 0) {
            this.$nextTick(()=> {
              this.mescroll.hideUpScroll();
            })
            return true;
          }else {
            return false;
          }
        }
      },
      created () {
        this.getData(0);
      },
      mounted () {
        this.$mescrollInt("mescroll",this.upCallback);
      },
      beforeDestroy () {
        this.mescroll.hideTopBtn();
        this.mescroll.destroy();
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
            rows: pageSize,
            type: this.type+''
          };

          this.$ajax({
            method: 'get',
            url: this.$apiTransaction + 'logAccount/logs/unsettle',
            params: form
          }).then(function (response) {
            if (response.data.data && response.data.data.rows && response.data.data.rows.length>0) {
              successCallback&&successCallback(response.data.data.rows);//成功回调
            }else {
              _this.mescroll.endErr();
            }
          })
        },
        filterChange (index,type) {
          this.filterActive = index;
          this.filterShow = false;
          this.type = type
          this.cashDetail = []
          this.mescroll.resetUpScroll( true )
          this.mescroll.scrollTo( 0, 300 );
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
