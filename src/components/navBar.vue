<template lang="pug">
  .box
    ul.top(:style="{background:background,borderBottom:borderBottom,position:position}")
      li.left
        slot(name="left")
      li.center
        slot(name="center")
      li.right
        slot(name="right")
      .placeholder
</template>

<script>
  export default {
    name: 'HelloWorld',
    props: {
      background: {
        type: String,
        default: 'white'
      },
      position: {
        type: String,
        default: 'fixed'
      },
      borderBottom: {
        type: String,
        default: 'solid 1px rgb(204,204,204)'
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .box{
    height: 1.3rem;
  }
  .top {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    height: 1.3rem;
    width: 100%;
    background: plum;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px #eee;
    font-size: .4rem;
    font-weight: 600;
    color: #333333;
  }
  .placeholder{
    height: 1.3rem;
  }
  .top>li{
    flex-grow: 1;
    flex-basis: 0;
    display: flex;
    align-items: center;
  }
  .left{
    justify-content: left;
    padding-left: .2rem;
  }
  .center{
    justify-content: center;
  }
  .right{
    padding-right: .2rem;
    justify-content: flex-end;
  }
</style>
