<template lang="pug">
  .nicknameBox
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 昵称修改
    .enterCont
      input(:type="type", v-model="val")
    .save(@click="save") 保存
</template>
<script>
 import {mapState} from 'vuex'
  export default {
    name: 'nickname',
    data () {
      return {
        type:"text",
        val: ''
      }
    },
    computed:{
      value(){
        return this.val
      },...mapState(['userData'])
    },
    mounted () {
      this.val = this.userData.mi_nickname
    },
    methods: {
      save () {
        let self = this
        self.$ajax({
          method: 'patch',
          url: self.$apiMember + 'member/memberProperty',
          params: {
            propertyName: 'nickname',
            value: self.val
          },
        }).then(function (response) {
          self.$router.push('/my')
        })
      }
    }
  }
</script>

<style scoped>
  .nicknameBox{
    width: 100%;
    min-height: 100vh;
    background-color: rgb(242,242,242);
    position: absolute;
    z-index: 100;
  }
  .nicknameBox .topCenter{
    font-size: .5rem;
    font-weight: 400;
    color: rgb(51,51,51);
  }
  .enterCont{
    width: 9.5rem;
    height: 1.5rem;
    line-height: 1.5rem;
    margin: .3rem auto 0;
    background-color: #fff;
  }
  .enterCont input{
    width: 9rem;
    height: .8rem;
    margin-left: .3rem;
    border: 0;
    outline: none;
    font-size: .5rem;
    vertical-align: middle;
  }
  .save{
    width: 6rem;
    height: 1.2rem;
    background-color: rgb(245,0,87);
    border-radius: 1.2rem;
    margin: 2rem auto 0;
    text-align: center;
    line-height: 1.2rem;
    color: #fff;
    font-size: .5rem;
  }
</style>
