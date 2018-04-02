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
    width: 200px;
    height: 120px;
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
  }
  .tips {
    padding: 0 10px;
  }
  .bottom {
    padding: 5px 10px;
    display: flex;
    flex-direction: row-reverse;
  }
  .ok {
    width: 50px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    background: deepskyblue;
    color: white;
  }
  .no {
    width: 50px;
    text-align: center;
    height: 20px;
    line-height: 20px;
    background: #ddd;
  }
</style>
