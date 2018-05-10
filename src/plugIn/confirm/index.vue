<template lang="pug">
  transition(name="fade" , mode="out-in")
    .confirmBg(v-if="visible", @click="visible = false")
      .windowBox( @click.stop="")
        .title {{title}}
        .tips {{message}}
        .bottom
          .ok(@click="ok") 确定
          .no(@click="no") 取消
</template>

<script>
  export default {
    name: 'index',
    props:{
      title: {
        type: String,
        default: '信息'
      },
      message: {
        type: String,
        default: '确认这样做吗？'
      },
      visible: {
        type: Boolean,
        default: false
      },
      confirm: {
        type: Function
      },
      noConfirm: {
        type: Function
      },
      element: {
        type:Object
      }
    },
    methods:{
      ok () {
        this.visible = false
        this.confirm()
      },
      no () {
        this.visible = false
        this.noConfirm()
      }
    }
  }
</script>

<style scoped>
  .confirmBg{
    background: rgba(0,0,0,.3);
    position: fixed;
    z-index: 9999;
    top:0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .windowBox {
    width: 7rem;
    height: 3.5rem;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .title {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    width: 100%;
    border-bottom: solid 1px #eee;
    font-size: .35rem;
  }
  .tips {
    padding: 0 10px;
    font-size: .35rem;
  }
  .bottom {
    padding: 5px 10px;
    display: flex;
    flex-direction: row-reverse;
  }
  .bottom>div{
    border-radius: .3rem;
  }
  .ok {
    width: 1.5rem;
    text-align: center;
    height: .6rem;
    line-height: .6rem;
    background: rgb(245,0,87);
    color: white;
    font-size: .35rem;
  }
  .no {
    width: 1.5rem;
    text-align: center;
    height: .6rem;
    line-height: .6rem;
    background: #ddd;
    font-size: .35rem;
    margin-right: .2rem;
  }
</style>
