<template lang="pug">
  .mescroll.goodsMescroll
    // 导航-------------------------------------------------------------------------------------------
    .headerWrapper
      .back(@click="goBack")
        img(src="./back@2x.png")
    // 轮播图-------------------------------------------------------------------------------------------
    .banner(v-if="banner.length")
      slider
        div(v-for="item in banner")
          img(:src="item.gi_img_url | img-filter")
    // 红字说明-------------------------------------------------------------------------------------------
    .descWrapper
      ul.type1(v-if="goodsData.carry_type===1")
        li 专柜提货
        li 专柜比价,未省钱,白送
        li 赔付电话4008-947-999
      ul.type2(v-else)
        li 暂仅快递配送
        li 客服电话4008-947-999
    // 商品名称-------------------------------------------------------------------------------------------
    .goodsName {{goodsData.gi_name}}
    // 价格----------------------------------------------------------------------------------------------
    .priceWrapper
      .real
        .realTag 实付价
        .realIcon ￥
        .realPrice
          ul
            li(v-for="item in $method.arrayPrice(goodsData.min_direct_supply_price)") {{item}}
      .other
        .price1
          span 专柜价:
          span {{goodsData.min_counter_price | price-filter}}
        .price2
          span 用券立减:
          span {{(goodsData.min_counter_price-goodsData.min_direct_supply_price) | price-filter}}
      .appointmentBtn(v-if="goodsData.carry_type===1")
        img(src="./xin.png")
        span 预约体验
    // 现金券-------------------------------------------------------------------------------------------------
    .ticketWrapper
      .left 余额:
      .right
        .ticket1
          span 现金券
          span {{userData.netcard_balance | price-filter}}
        .ticket2
          span 通用券
          span {{userData.cash_balance | price-filter}}
    // 规格-----------------------------------------------------------------------------------------------------
    .sizeWrapper
      .left 规格:
      .right
        .noSize 请选择规格
      .arrow
        img(src="./arrow.png")
    // 配送方式选择---------------------------------------------------------------------------------------------
    .distributionWrapper
      .left 配送:
      .right
        .btn 快递配送
        .btn 专柜自提
      .arrow
        img(src="./arrow.png")
    //地址展示---------------------------------------------------------------------------------------------------
    .addressWrapper
      .noAddress 请选择配送方式

</template>

<script>
  import Slider from 'components/slider'
  import {mapGetters} from 'vuex'
  export default {
    name: "goodsDetails",
    data () {
      return {
        banner: [], // 轮播图
        spuId: '',
        goodsData: {}, // 商品详情数据
      }
    },
    created() {
      this.getDetailsData()
    },
    computed: {
      ...mapGetters(['userData'])
    },
    methods: {
      // 根据spuid获取详情内容
      getDetailsData() {
        this.spuId = this.$route.query.id
        if (!this.spuId) {
          return
        }
        let self =this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'gcdetails/spu/detail',
          params: {
            gspuId: this.spuId
          }
        }).then(function(res){
          if (res) {
            self.goodsData = res.data.data
            self.banner = res.data.data.spu_banner
          }
        })
      },
      // 后退
      goBack () {
        if (window.history.length>1) {
          this.$router.go(-1)
        } else {
          this.$router.push('/home')
        }
      },
    },
    components: {
      Slider
    }
  }
</script>

<style scoped lang="stylus">
  img {
   pointer-events none
  }

  .headerWrapper {
    display flex
    position fixed
    width 100%
    top 0
    left 0
    z-index 10
    .back {
     font-size 0
     padding .26rem .4rem
     img {
       width .8rem
     }
    }
  }

  .banner {
    height 10rem
    overflow hidden
    position relative
  }
  .descWrapper {
    font-size .266rem
    .type1 {
      color #ff0057
      li {
        background-color #ffe8f0
      }
    }
    .type1, .type2 {
      display flex
      padding .4rem 0 .213rem .4rem
      li {
        line-height .4rem
        margin-right .133rem
        padding 0 .08rem
        border-radius .213rem
        &:last-child {
          padding 0
          margin-right 0
          background-color #fff
        }
      }
    }
    .type2 {
      color rgb(246,122,77)
      li {
        background-color rgb(255,239,232)
      }
    }
  }
  .goodsName {
    font-size .37rem
    color #333
    font-weight 400
    line-height .53rem
    padding 0 .4rem
    word-break break-all
    text-align justify
  }
  .priceWrapper {
    margin-top .16rem
    padding 0 .4rem .26rem
    border-bottom 1px solid #d7d7d7
    position relative
    .real {
      display flex
      align-items flex-end
      .realTag {
        width 1.12rem
        height .4rem
        line-height .4rem
        background-color #333
        color #fff
        font-size .293rem
        text-align center
      }
      .realIcon {
        color #ff0057
        font-size .32rem
        line-height 1
        margin-left .16rem
      }
      .realPrice {
        ul {
          display flex
          align-items flex-end
          li {
            color #ff0057
            font-size .693rem
            font-weight 400
            line-height .8
            &:nth-child(2) {
              font-size .426rem
            }
          }
        }
      }
    }
    .other {
      display flex
      margin-top .4rem
      font-weight 400
      .price1, .price2 {
        span:nth-child(1) {
          font-size .293rem
        }
        span:nth-child(2) {
          font-size .32rem
        }
      }
      .price1 {
        color #333
      }
      .price2 {
        margin-left .4rem
        color #ff0057
      }
    }
    .appointmentBtn {
      width 2.13rem
      height .693rem
      display flex
      align-items center
      justify-content center
      border-radius .346rem
      border 1px solid #ff0057
      position absolute
      right .4rem
      bottom .16rem
      img {
        width .346rem
      }
      span {
        margin-left .1rem
        color #ff0057
        font-size .32rem
      }
    }
  }
  .ticketWrapper {
    height .96rem
    display flex
    align-items center
    padding 0 .4rem
    box-sizing content-box
    border-bottom .26rem solid #f2f2f2
    .left {
      font-size .346rem
      font-weight 400
      color #888
    }
    .right {
      display flex
      margin-left .2rem
      .ticket1, .ticket2 {
        span {
          font-size .346rem
          font-weight 400
          &:nth-child(1) {
            color #333
          }
          &:nth-child(2) {
            color #ff0057
          }
        }
      }
      .ticket2 {
        margin-left .53rem
      }
    }
  }
  .sizeWrapper {
    height .93rem
    display flex
    align-items center
    padding-left .4rem
    position relative
    border-bottom 1px solid #d7d7d7
    .left, .noSize {
      color #888
      font-weight 400
      font-size .346rem
    }
    .right {
      margin-left .2rem
    }
    .arrow {
      position absolute
      right .32rem
      top 50%
      transform translateY(-50%)
      img {
        width .586rem
      }
    }
  }
  .distributionWrapper {
    display flex
    align-items center
    padding-left .4rem
    position relative
    margin-top .26rem
    .left {
      color #888
      font-weight 400
      font-size .346rem
    }
    .right {
      display flex
      margin-left .2rem
      .btn {
        width 1.76rem
        height .586rem
        border 1px solid #ff0057
        border-radius .133rem
        line-height .586rem
        text-align center
        font-size .32rem
        color #ff0057
        font-weight 400
        &:nth-child(2) {
          margin-left .26rem
          border-color #666
          color #333
        }
      }
    }
    .arrow {
      position absolute
      right .32rem
      top 0
      img {
        width .586rem
      }
    }
  }
  .addressWrapper {
    margin-top .26rem
    padding 0 .4rem
    .noAddress {
      color #9b9b9b
      font-size .32rem
      font-weight 400
    }
  }
</style>
