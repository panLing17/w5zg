<template lang="pug">
    .wraps
      transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
        .backgrounds(v-if="shows", @click="close")
      transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
        .cont(v-if="shows")
          .top
            span 请选择取消原因
            img(src="../../../../../assets/img/Icon_top_close_gray@2x.png", @click="close")
          .lists
            ul
              li(v-for="(item, index) in lists")
                .checks(@click="selects(item, index)")
                  img(src="../../../../../assets/img/checks copy@2x.png", v-if="item.checkFlag")
                  img(src="../../../../../assets/img/Oval 2@2x.png", v-else)
                .reasons {{item.words}}
          .confirm(@click="confirmB") 确定
          .selectReason(v-if="reasonF")
            div 请选择取消原因
</template>

<script>
    export default {
        name: "cancelReason",
        props:{
          shows:{
            type: Boolean,
            default: false
          }
        },
        data() {
          return{
            reasonF: '',
            lists: [{words:'其他渠道价格更低', checkFlag: false}, {words:'该商品降价了', checkFlag: false}, {words:'操作有误（商品、地址等选错）', checkFlag: false}, {words:'重复下单/误下单', checkFlag: false}, {words:'不想买了', checkFlag: false}, {words:'商品无货', checkFlag: false}, {words:'其他原因', checkFlag: false}]
          }
        },
        methods:{
          selects(item, index){
            for (let i = 0; i < this.lists.length; i++) {
              if (i === index) {
                this.lists[i].checkFlag = true
              } else {
                this.lists[i].checkFlag = false
              }
            }
          },
          close(){
            this.$emit('close')
            this.lists.forEach((item) =>{
              item.checkFlag = false
            })
          },
          confirmB(){
            for (let i = 0; i < this.lists.length; i++) {
              if (this.lists[i].checkFlag == true) {
                this.reasonF = false
                this.close()
                return
              }
              let t = 2
              let self = this
              self.reasonF = true
              let timer = setInterval(function () {
                t--
                if (t === 0) {
                  self.reasonF = false
                  clearInterval(timer)
                }
              },1000)
            }
          }
        }
    }
</script>

<style scoped>
.backgrounds{
  background-color: rgba(0, 0, 0, .7);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
}
.cont{
  background-color: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 11.3rem;
  z-index: 200;
}
.top{
  width: 100%;
  height: 1.28rem;
  border-bottom: .05rem solid #ccc;
  text-align: center;
  line-height: 1.28rem;
  position: relative;
}
.top span{
  color: #333;
  font-size: .37rem;
  font-weight: bold;
}
.top img{
  position: absolute;
  top: .32rem;
  right: .32rem;
  width: .58rem;
  height: .58rem;
}
.lists ul{
  padding: 0 .4rem;
}
.lists ul li{
  width: 100%;
  height: 1.12rem;
  border-bottom: .03rem solid #ececec;
  line-height: 1.12rem;
  display: flex;
  align-items: center;
}
.lists ul li:last-child{
  border-bottom: 0;
}
.checks{
  margin-right: .42rem;
}
.checks img{
  width: .48rem;
  height: .48rem;
  vertical-align: middle;
  margin-top: -.1rem;
}
.reasons{
  font-size: .35rem;
  color: #333;
}
.confirm{
  width: 100%;
  height: 1.28rem;
  background-color: #F70057;
  position: fixed;
  bottom: 0;
  z-index: 200;
  font-size: .37rem;
  color: #fff;
  text-align: center;
  line-height: 1.28rem;
}
.selectReason{
  width: 100%;
  position: fixed;
  bottom: 1.86rem;
  z-index: 200;
}
.selectReason div{
  width: 4.26rem;
  height: .93rem;
  background-color: rgba(0, 0, 0, .7);
  border-radius: .9rem;
  font-size: .42rem;
  color: #fff;
  line-height: .93rem;
  text-align: center;
  margin: 0 auto;
}
</style>
