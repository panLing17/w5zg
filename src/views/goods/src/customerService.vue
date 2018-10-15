<template lang="pug">
  .serviceBox
    nav-bar(background="white", border-bottom="none")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 客服
      .topRight(slot="right")
         <!--img(src="../../../assets/img/shoppingCart@2x.png", style="width:.5rem", @click="selectShare = true")-->
         <!--span 人工客服-->
    .mask(v-show="maskShow")
    iframe(ref="iframe", :src="url").ifra
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "customer-service",
    data () {
      return {
        url: '',
        maskShow: false
      }
    },
    computed:{...mapState(['userData'])},
    mounted () {
      this.config()
    },
    methods:{
      iframeLoad() {
        this.maskShow = true
      },
      config () {
        let self = this
        let newUserData
        if (this.userData) {
          newUserData = {
            uid: this.userData.member_id,
            name: this.userData.mi_nickname,
            email: '',
            mobile: this.userData.mi_phone
          }
        } else {
          newUserData = {
            uid: Math.random(),
            name:'游客',
            email:'',
            mobile:''
          }
        }
        let _this = this
        ysf.on({
          'onload': function(){
            ysf.config(newUserData);
            ysf.product(self.$store.state.nowGoodsData);
            _this.$refs.iframe.addEventListener('load', _this.iframeLoad, false)
          }
        })
        self.url = ysf.url()
      }
    }
  }
</script>

<style >
  .serviceBox {
    width: 100%;
    position: relative;
  }
  .ifra {
    width: 100%;
    height: calc(100vh - 1.3rem);
    position: absolute;
    top: 1.3rem;
    border: none;
    outline: none;
  }
  .ifra h2{
    display: none;
  }
  .mask {
    width: 7rem;
    height: 46px;
    background-color: #46BE8A;
    position: fixed;
    top: 1.3rem;
    left: 0;
    z-index: 999;
  }
</style>
