<template lang="pug">
  .shoppingCart
    .headerWrapper
      .nav
        .back
          img(src="./img/back.png")
        .title 扫码购物车
      .scan
        .left 正品低价 · 专柜自提 · 极致体验
        .right
          img(src="./img/scan.png")
          span 继续扫码
    scroll.contentWrapper
      .content
        ul.itemWrapper
          li.item(v-for="(item, index) in data.commList")
            .left
              img(:src="item.")
            .right
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "shoppingCart",
    data() {
      return {
        data: []
      }
    },
    created() {
      this.goodsAdd()
    },
    methods: {
      // 加入购物车
      goodsAdd() {
        if (!window.sessionStorage.getItem('barCode')) {
          this.getData()
          return
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/querySendShoppingCartList1',
          params: {},
        }).then(function (res) {
          if (res) {
            window.sessionStorage.removeItem('barCode')
            self.getData()
          }
        })
      },
      // 获取购物车数据
      getData() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/querySendShoppingCartList1',
          params: {},
        }).then(function (res) {
          if (res) {
            self.data = res.data.data
          }
        })
      },
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  img {
    pointer-events none
  }
  .shoppingCart {
    position absolute
    top 0
    left 0
    width 100%
    height 100vh
    background #f2f2f2
    .headerWrapper {
      .nav {
        height 1.3rem
        background-color #f70057
        display flex
        position relative
        .back {
          padding 0.33rem .4rem
          font-size 0
          img {
            width .64rem
          }
        }
        .title {
          font-size .48rem
          color #fff
          font-weight 500
          line-height 1.3rem
          position absolute
          top 0
          left 50%
          transform translateX(-50%)
        }
      }
      .scan {
        height 1.3rem
        display flex
        justify-content space-between
        align-items center
        background-color #4a4a4a
        padding 0 .4rem
        .left {
          font-size .32rem
          font-weight 400
          color rgba(255,255,255,.7)
        }
        .right {
          display flex
          width 3.4rem
          height .96rem
          align-items center
          justify-content center
          background-color #ff8500
          border-radius .13rem
          img {
            width .42rem
          }
          span {
            margin-left .13rem
            font-size .37rem
            color #fff
            font-weight 400
          }
        }
      }
    }
  }
</style>
