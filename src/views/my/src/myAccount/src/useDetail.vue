<template lang="pug">
  .useDetailBox
    ul.contentList
      li.item(v-for="(item,index) in data")
        p.info ID: {{item.id}}
        p.info.last {{item.date}}
        p.balance(:style="{'color':balanceColor}")
          span.left 余额
          span.right ￥{{item.balance}}
        p.total 总额 ￥{{item.total}}
        p.dec.first 商户ID：{{item.comId}}
        p.dec.last {{item.expire}} 前使用
        img.icon(:src="iconImg(index)")
        img.bg(:src="bgImg")
</template>

<script>
    export default {
      name: "useDetail",
      data () {
        return {
          selectType: 0,
          data: [
            {
              useType: '1',
              id: '201812321312',
              date: '2018-3-15',
              balance: '200.00',
              total: '200.00',
              comId: '201852536XC',
              expire: '2018-4-15'
            },
            {
              useType: '2',
              id: '201812321312',
              date: '2018-3-15',
              balance: '50.00',
              total: '200.00',
              comId: '201852536XC',
              expire: '2018-4-15'
            },
            {
              useType: '2',
              id: '201812321312',
              date: '2018-3-15',
              balance: '150.00',
              total: '200.00',
              comId: '201852536XC',
              expire: '2018-4-15'
            }
          ]
        }
      },
      watch: {
        '$route' (to, from) {
          this.selectType = to.params.id;
          console.log(this.selectType)
        }
      },
      computed : {
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
        iconImg(index) {
          let img = '';
          switch (parseInt(this.data[index].useType)) {
            case 1:
              img = require('../../../../../assets/img/unused@2x.png');
              break;
            case 2:
              img = require('../../../../../assets/img/someues@2x.png');
              break;
            case 3:
              img = require('../../../../../assets/img/havebeenuesd@2x.png');
              break;
            case 4:
              img = require('../../../../../assets/img/outofdate@2x.png');
              break;
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
</style>
