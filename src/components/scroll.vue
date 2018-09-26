<template>
  <div ref="wrapper">
    <div>
      <div v-if="pulldown" class="pulldown"
           :style="`margin-top:${dragTip.translate}px`">
        <div class="clear" v-if="dragTip.showLoding">
          <div>{{dragTip.text}}</div>
        </div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'scroll',
  data(){
    return{
      dragTip:{
        text:"下拉刷新",
        translate:-50,
        showLoding:false
      }
    }
  },
  props: {
    probeType: {
      type: Number,
      default: 1
    },
    click: {
      type: Boolean,
      default: true
    },
    data: {
      type: Array,
      default: null
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup: {
      type: Boolean,
      default: false
    },
    pulldown: {
      type: Boolean,
      default: false
    },
    beforeScroll: {
      type: Boolean,
      default: false
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    stopPropagation: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    setTimeout(() => {
      this._initScroll()
    }, 20)
  },
  methods: {
    _initScroll () {
      if (!this.$refs.wrapper) {
        return
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click,
        scrollY: this.scrollY,
        scrollX: this.scrollX,
        stopPropagation: this.stopPropagation,
        bounce: this.pullup?false:this.pulldown?false:true
      })
      if (this.listenScroll) {
        let me = this
        this.scroll.on('scroll', (pos) => {
          me.$emit('scroll', pos)
        })
      }
      if (this.pullup) {
        this.scroll.on('scrollEnd', (pos) => {
          if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
            this.$emit('scrollToEnd',pos)
          }
        })
      }
      // 是否派发顶部下拉事件，用于下拉刷新
      if(this.pulldown) {
        this.scroll.on('scroll', (pos) => {
          //显示下拉刷新loding
          this.dragTip.showLoding = true
          if (pos.y >= 50) {
            this.dragTip.text = "释放刷新"
          }
        })
        this.scroll.on('touchEnd', (pos) => {
          console.log(pos)
          console.log(123)
          if (pos.y >= 50) {
            this.dragTip.translate = 0
            this.dragTip.text = "刷新中..."
            //重新初始化
            // this.$on('scroll.finishLoad', this.resetParams);
            this.$emit('pullDownFun', pos)
          } else {
            this.resetParams()
          }
        })
      }
      if (this.beforeScroll) {
        this.scroll.on('beforeScrollStart', () => {
          this.$emit('beforeScroll')
        })
      }
    },
    resetParams(){
      setTimeout(() => {
        this.dragTip = {
          text:"下拉刷新",
          translate: -50,
          showLoding:false
        }
      },600)
      // this.dragTip = {
      //   text:"下拉刷新",
      //   translate: -50,
      //   showLoding:false
      // }
    },
    enable () {
      this.scroll && this.scroll.enable()
    },
    disable () {
      this.scroll && this.scroll.disable()
    },
    refresh () {
      this.scroll && this.scroll.refresh()
    },
    scrollTo () {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
    },
    scrollToElement () {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
    }
  },
  watch: {
    data () {
      setTimeout(() => {
        this.refresh()
      }, 200)
    }
  }
}
</script>

<style scoped>
  .scroll-wrap{
    height:100%;
    overflow:hidden;
  }
    /* 下拉刷新 */
  .pulldown{
    width:100%;
    height:50px;
    position:relative;
  }
  .clear{
    padding:10px 0px;
    font-size:.28rem;
    position:absolute;
    left:50%;
    top:5px;
    transform:translate(-50%,0);
  }

</style>
