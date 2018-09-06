<template lang="pug">
  .mescroll.goodsMescroll
    // 导航
    .headerWrapper
      .back(@click="goBack")
        img(src="./back@2x.png")
    // 轮播图
    .banner(v-if="banner.length")
      slider
        div(v-for="(item, index) in banner")
          img(:src="item.ac_phone_image | img-filter")
    // 红字说明
    .descWrapper
      ul.type1
        li 专柜提货
        li 专柜比价,未省钱,白送
        li 赔付电话4008-947-999
      ul.type2
        li 暂仅快递配送
        li 客服电话4008-947-999
    // 商品名称
    .goodsName 阿迪达斯男鞋2018新款阿迪bounce小椰子轻便透气休闲运动鞋跑步鞋CG4762
    // 价格

</template>

<script>
  import Slider from 'components/slider'
  export default {
    name: "goodsDetails",
    data () {
      return {
        banner: [], //轮播图
      }
    },
    methods: {
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
   .back {
     font-size 0
     padding .26rem .4rem
     img {
       width .8rem
     }
   }
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
      height 1rem
      display flex
      align-items center
      padding-left .4rem
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
</style>
