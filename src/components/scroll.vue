<template>
  <div ref="wrapper">
    <div v-if="pulldown&&dragTip.showLoding">
      <div v-if="pulldown&&dragTip.showLoding" class="pulldown"
           :style="`margin-top:${dragTip.translate}px`">
        <div class="loadTop"><img src="../assets/img/loadTop@2x.png"></div>
        <div class="clear" v-if="dragTip.showLoding">
          <div class="fir"><img class="downLa" src="../assets/img/downLa.png"></div>
          <div>{{dragTip.text}}</div>
        </div>
      </div>
      <slot></slot>
    </div>
    <slot v-else></slot>
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
            this.dragTip.text = "松开刷新"
          }
        })
        this.scroll.on('touchEnd', (pos) => {
          if (pos.y >= 50) {
            this.dragTip.translate = 0
            this.dragTip.text = "刷新中..."
            let downLa = document.getElementsByClassName('downLa')[0]
            downLa.style.transform = 'rotateZ(180deg)'
            this.$emit('pullDownFun', pos)
          } else {
            //重新初始化
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
      },200)
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
    height:80px;
    position:relative;
  }
  .clear{
    padding:10px 0px;
    font-size:.28rem;
    position:absolute;
    left:50%;
    top:45px;
    transform:translate(-50%,0);
    display: flex;
    align-items: center;
  }
  .clear .fir{
    margin-right: .21rem;
  }
  .clear img{
    width: .48rem;
    height: .48rem;
    vertical-align: middle;
  }
  .loadTop{
    position:absolute;
    left:50%;
    top:5px;
    transform:translate(-50%,0);
  }
  .loadTop img{
    width: 6.93rem;
  }
  /*.downLa{*/
    /*animation: myKey .5s infinite;*/

  /*}*/

  /*@keyframes myKey {*/
    /*0%{*/
      /*transform: rotateZ(0deg);*/
    /*}*/
    /*25%{*/
      /*transform: rotateZ(90deg);*/
    /*}*/
    /*50%{*/
      /*transform: rotateZ(180deg);*/
    /*}*/
    /*75%{*/
      /*transform: rotateZ(270deg);*/
    /*}*/
    /*100%{*/
      /*transform: rotateZ(360deg);*/
    /*}*/
  /*}*/
</style>
