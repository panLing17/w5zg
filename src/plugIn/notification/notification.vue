<template>
  <transition name="fade" @after-leave="afterLeave">
    <div
      v-show="visible"
      :class="['notification']"
      :style="style"
    >
      <span class="content">{{content}}</span>
      <!--<a class="btn" @click="handleClose">{{btn || '关闭'}}</a>-->
    </div>
  </transition>
</template>

<script>
  export default {
    name: "notification",
    props: {
      content: {
        type: String,
        default: ''
      },
      btn: {
        type: String,
        default: ''
      },
      bottom: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        visible: false,
        autoClose: 3000
      }
    },
    computed: {
      style (){
        return {
          bottom: `${this.bottom}rem`
        }
      }
    },
    mounted() {
      this.createTimer()
    },
    methods: {
      createTimer() {
        if(this.autoClose) {
          this.timer = setTimeout(() => {
            this.doClose()
          }, this.autoClose)
        }
      },
      handleClose(e){
        e.preventDefault()
        this.doClose()
      },
      doClose() {
        this.visible = false
        this.$emit('close')
      },
      afterLeave() {
        this.$emit('closed')
      }
    }
  }
</script>

<style scoped lang="stylus">
.notification
  display flex
  background-color rgba(0,0,0,.7)
  color rgba(255,255,255,1)
  align-items center
  padding .16rem .8rem
  position fixed
  left 50%
  transform translateX(-50%)
  /*min-width 4.2rem*/
  box-shadow 0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)
  flex-wrap wrap
  transition all .3s
  z-index 99999
  border-radius .26rem
  font-size .42rem
  white-space nowrap
  font-weight 400
.content
  padding 0
.btn
  color #ff4081
  padding-left 24px
  margin-left auto
  cursor pointer
</style>
