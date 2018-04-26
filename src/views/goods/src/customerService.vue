<template lang="pug">
  .serviceBox
    nav-bar(background="white", border-bottom="none")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 客服
      .topRight(slot="right")
        // img(src="../../../assets/img/share@3x.png", style="width:.5rem", @click="selectShare = true")
    iframe(:src="url").ifra
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "customer-service",
    data () {
      return {
        url: ''
      }
    },
    computed:{...mapState(['userData'])},
    mounted () {
      this.config()
    },
    methods:{
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
        ysf.on({
          'onload': function(){
            ysf.config(newUserData);
            ysf.product(self.$store.state.nowGoodsData);

          }
        })
        self.url = ysf.url()
      }
    }
  }
</script>

<style scoped>
  .ifra {
    width: 100%;
    height: calc(100vh + 48px);
    position: absolute;
    top: -48px;
  }
  .ifra h2{
    display: none;
  }
</style>
