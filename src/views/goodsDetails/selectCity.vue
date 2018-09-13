<template lang="pug">
  .selectCity
    transition(name="fade")
      .mask(v-show="selectCityShow", @click="hide()", @touchmove.prevent="")
    transition(name="fold")
      .contentWrapper(v-show="selectCityShow", @touchmove.prevent="")
        .title
          .text
            .noSelect(v-show="!selected.province.pro_name") 请选择
            .value(v-show="selected.province.pro_name") {{selected.province.pro_name}}
          .text
            .noSelect(v-show="!selected.city.city_name && selected.province.pro_name") 请选择
            .value(v-show="selected.city.city_name") {{selected.city.city_name}}
        .content
          scroll.left(:data="province")
            ul
              li(v-for="item in province", @click="getCity(item)") {{item.pro_name}}
          scroll.right(:data="city")
            ul
              li(v-for="item in city", @click="cityChange(item)") {{item.city_name}}
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "selectCity",
    data() {
      return {
        selectCityShow: false,
        province: [], // 省集合
        city: [], //城市集合
        selected: {
          province: {},
          city: {}
        }, //头部省市显示
      }
    },
    watch:{
      selectCityShow(val) {
        if (val && !this.province.length) {
          this.getProvince()
        }
      }
    },
    methods: {
      // 获取搜索省
      getProvince() {
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/allProvince',
          params: {}
        }).then(function(res){
          if (res) {
            self.province = res.data.data
          }
        })
      },
      // 获取城市集合
      getCity(item) {
        this.selected.province = item
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/cityProvince',
          params: {
            pro_no: item.pro_no
          }
        }).then(function(res){
          if (res) {
            self.city = res.data.data
          }
        })
      },
      // 城市选择
      cityChange(item) {
        this.selected.city = item
        this.$emit('city-change', this.selected)
        this.hide()
      },
      show() {
        this.selectCityShow = true
      },
      hide() {
        this.selectCityShow = false
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
  .mask {
    position fixed
    top 0
    left 0
    width 100%
    height 100vh
    z-index 40
  }
  img {
    pointer-events none
  }
  .selectCity {
    .contentWrapper {
      height $height-pop-details
      position fixed
      bottom 0
      left 0
      width 100%
      z-index 40
      background #fff
      .title {
        height 1.33rem
        display flex
        border-bottom 1px solid #d7d7d7
        .text {
          height 100%
          flex 1
          display flex
          justify-content center
          .noSelect {
            height 100%
            line-height 1.33rem
            color #333
            font-size .4rem
            font-weight 500
            position relative
            &:after {
              content ''
              display block
              position absolute
              bottom 0
              left 50%
              transform translateX(-50%)
              width 1.6rem
              height .08rem
              background-color #f70057
            }
          }
          .value {
            color #333
            font-size .4rem
            font-weight 400
            line-height 1.33rem
          }
        }
      }
      .content {
        display flex
        height calc(100% - 1.33rem)
        overflow hidden
        .left, .right {
          flex 1
          height 100%
          text-align center
        }
        ul {
          li {
            padding .26rem 0
            line-height .56rem
            color #333
            font-size .4rem
            font-weight 400
          }
        }
      }
    }
  }
</style>
