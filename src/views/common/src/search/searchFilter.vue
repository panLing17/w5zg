<template lang="pug">
  .searchFilter
    .navWrapper
      .left
        .navItem(@click="brandChange", :class="{active: brandChoose}", v-show="brandData.length")
          span 品牌
          img(:src="brandChoose?require('./brandUp.png'):require('./brandDown.png')")
      .right
        .navItem(:class="{active: sortFieldType===0}")
          span 综合
        .navItem(@click="priceSelected")
          span 价格
          img(:src="priceChoose===0?require('./price.png'):priceChoose===1?require('./priceUp.png'):require('./priceDown.png')")
        .navItem(@click="filterChange", :class="{active: filterChoose}")
          span 筛选
          img(:src="filterChoose?require('./filter2.png'):require('./filter.png')")
    .searchFilterWrapper
      .transitionWrapper
        transition(name="fade")
          .mask(v-show="brandChoose", @click="brandChoose=!brandChoose", @touchmove.prevent="")
        transition(name="fold")
          .brandWrapper(v-show="brandChoose", @touchmove.prevent="")
            scroll.brandContent(:data="brandData", ref="brandContent")
              ul
                li(v-for="(item, index) in brandList", :class="{active: item.checked}", @click="brandCheck(index)") {{item.bi_name}}
            .btnWrapper
              .left(@click="brandReset") 重置
              .right(@click="brandSearch") 确定
      .transitionWrapper
        transition(name="fade")
          .mask(v-show="filterChoose", @click="filterChoose=!filterChoose", @touchmove.prevent="")
        transition(name="fold")
          .filterWrapper(v-show="filterChoose", @touchmove.prevent="")
            .filterContent
              .desc 价格区间(元)
              .inputWrapper
                .left
                  input(type="number", placeholder="最小金额", v-model="minNum")
                .center
                .right
                  input(type="number", placeholder="最大金额", v-model="maxNum")
              <!--.btnWrapper-->
                <!--ul-->
                  <!--li(v-for="(item, index) in priceArea", :class="{active: priceActive===index}", @click="priceChange(index, item)") {{item.min}}{{item.max?'-'+item.max:' 以上'}}-->
            .bottomBtn
              .left(@click="priceReset") 重置
              .right(@click="priceFilter") 确定
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "searchFilter",
    props: {
      brandData: {
        type: Array,
        default() {
          return []
        }
      },
      sortFieldType: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        brandChoose: false,
        priceChoose: 0,
        filterChoose: false,
        brandList: [],
        priceActive: -1,
        minNum: '',
        maxNum: ''
      }
    },
    computed: {

    },
    created() {
      this.timer = null
    },
    deactivated() {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    beforeDestroy () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
    },
    watch: {
      brandData (newVal) {
        if (newVal.length) {
          this.brandList = []
          this.brandData.forEach(item => {
            item.checked = false
            this.brandList.push(item)
          })
        }
      },
      brandChoose (newVal) {
        if (newVal) {
          setTimeout(() => {
            this.$refs.brandContent.refresh()
          }, 20)

        }
      }
    },
    methods: {
      priceFilter() {
        this.filterChoose = false
        if (this.minNum.trim().length===0 && this.maxNum.trim().length===0) {
          return
        }
        if (this.minNum.trim().length===0) {
          this.minNum = 0
        }
        if (this.maxNum.trim().length===0) {
          this.maxNum = 99999999
        }
        if (parseFloat(this.minNum)>parseFloat(this.maxNum)) {
          [this.minNum, this.maxNum] = [this.maxNum, this.minNum]
        }
        this.$emit('priceFilter', {
          min: parseFloat(this.minNum),
          max: parseFloat(this.maxNum)
        })
      },
      priceReset() {
        this.priceActive = -1
        this.minNum = ''
        this.maxNum = ''
      },
      priceChange(index, item) {
        this.priceActive = index
        this.minNum = item.min
        this.maxNum = item.max?item.max:''
      },
      priceSelected() {
        this.priceChoose = ++this.priceChoose%3
        this.$emit('priceSearch', this.priceChoose)
      },
      closeFilter() {
        this.brandChoose = false
        this.filterChoose = false
      },
      brandSearch() {
        this.brandChoose = false
        let biArr = ''
        this.brandList.forEach(item => {
          if (item.checked) {
            biArr += item.bi_id+','
          }
        })
        if (!biArr.length) {
          return
        }
        biArr = biArr.substring(0, biArr.length-1)
        this.$emit('brandSearch', biArr)
      },
      brandReset() {
        this.brandList.forEach((item, index) => {
          item.checked = false
          this.brandList.splice(index, 1, item)
        })
      },
      filterChange() {
        if (this.brandChoose) {
          this.brandChoose = false
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() =>{
            this.filterChoose = !this.filterChoose
          }, 500)
        } else {
          this.filterChoose = !this.filterChoose
        }
      },
      brandChange () {
        if (this.filterChoose) {
          this.filterChoose = false
          if (this.timer) {
            clearTimeout(this.timer)
          }
          this.timer = setTimeout(() => {
            this.brandChoose = !this.brandChoose
          }, 500)
        } else {
          this.brandChoose = !this.brandChoose
        }

      },
      brandCheck(index) {
        let temp = this.brandList[index]
        temp.checked = !this.brandList[index].checked
        this.brandList.splice(index, 1 , temp)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  .searchFilter {
    position relative
  }
  .searchFilterWrapper {
    position absolute
    width 100%
  }
  .navWrapper {
    height 1.2rem
    display flex
    align-items center
    padding 0 .4rem
    border-bottom 1px solid rgb(239,239,239)
    .left {
      flex none
    }
    .right {
      flex 1
      display flex
      justify-content flex-end
    }
    .navItem {
      font-size 0
      display inline-flex
      align-items center
      margin-right 0.8rem
      &.active {
        span {
          color rgb(247,0,87)
        }
      }
      span {
        font-size .4rem
        color rgb(51,51,51)
        line-height .56rem
      }
      img {
        width: .42rem;
      }
    }
    .navItem:last-child {
      margin 0
    }
  }

  .mask {
    position fixed
    top 2.5rem
    bottom 0
    width 100%
    background rgba(0,0,0,.5)
    z-index 10
  }

  .brandWrapper {
    position relative
    max-height 11.57rem
    width 100%
    background #fff
    z-index 20
    .brandContent {
      max-height 10.37rem
      overflow hidden
      ul {
        padding .26rem .346rem 0
        li {
          display inline-block
          width: 2.186rem
          height .88rem
          overflow hidden
          text-align center
          line-height .88rem
          text-overflow ellipsis
          white-space nowrap
          margin 0 .186rem .186rem 0
          background rgb(246,246,246)
          font-size .32rem
          color #333
          &.active {
            color rgb(247,0,87)
            background url("./brandActive.png") no-repeat
            background-size 100% 100%
          }
        }
        li:nth-child(4n) {
          margin-right 0
        }
      }
    }
    .btnWrapper {
      height 1.2rem
      display flex
      font-size .4rem
      border-top 1px solid rgb(153,153,153)
      .left, .right {
        flex 1
        text-align center
        line-height 1.2rem
      }
      .left {
        background #fff
        color #333
      }
      .right {
        background rgb(247,0,87)
        color #fff
      }
    }
  }
  .filterWrapper {
    position relative
    z-index 20
    background #fff
    .filterContent {
      padding .32rem 0 .53rem .4rem
      .desc {
        margin-bottom .26rem
        line-height 1
        font-size .34rem
        color rgb(119,119,119)
      }
      .inputWrapper {
        display flex
        align-items center
        .left, .right {
          input {
            width 3.73rem
            height .8rem
            border 1px solid rgb(236,236,236)
            background rgb(246,246,246)
            text-align center
            -webkit-appearance: none;
            border-radius: 0;
          }
        }
        .center {
          margin 0 .26rem
          width .66rem
          height .05rem
          background rgb(206,206,206)
        }
      }
      .btnWrapper {
        margin-top .53rem
        ul {
          li {
            display inline-block
            padding 0 .53rem
            line-height .8rem
            border 1px solid rgb(206,206,206)
            border-radius .4rem
            color #333
            font-size .34rem
            margin 0 .26rem .26rem 0
          }
          li.active {
            border-color rgb(247,0,87)
            color rgb(247,0,87)
          }
        }
      }
    }
    .bottomBtn {
      height 1.2rem
      display flex
      font-size .4rem
      border-top 1px solid rgb(153,153,153)
      .left, .right {
        flex 1
        text-align center
        line-height 1.2rem
      }
      .left {
        background #fff
        color #333
      }
      .right {
        background rgb(247,0,87)
        color #fff
      }
    }
  }

  input::placeholder{
    color: rgb(153,153,153);
  }
  .transitionWrapper {
    overflow hidden
  }
  .fold-enter-active, .fold-leave-active {
    transition: all 0.5s;
  }
  .fold-enter, .fold-leave-to {
    transform: translate3d(0,-100%,0);
  }
  .fade-enter-active, .fade-leave-active {
    transition: all 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }
</style>
