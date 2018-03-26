<template lang="pug">
  .orderManage
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 订单管理
      .topRight(slot="right")
        img(src="../../../../../assets/img/searchInput搜索图标@2x.png").search
        img(src="../../../../../assets/img/msg_0.png").msg
    .orderStatus
      ul.wrapStatus
        li(v-for="(item,index) in status").status {{item}}
    .content
      .top
        .left
          span.orderNum 订单编号:
          span.num 2018031400
        .right 待付款  
      .center
      .bottom        
</template>

<script>
    export default {
      name: "orderManage",
      data(){
        return{
          status:["全部","待付款","待发货","待收货","待评价"]
        }
      }
    }
</script>

<style scoped>
  .orderManage{
    background-color: rgb(242,242,242);
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .topCenter{
    font-size: .5rem;
    font-weight: 400;
  }
  .topRight img{
    vertical-align: middle;
  }
  .topRight img.search{
    width: .55rem;
  }
  .topRight img.msg{
    width: .7rem;
    margin-left: .2rem;
    margin-top: -.1rem;
  }
  /*订单的状态--开始*/
  .orderStatus{
    background-color: #fff;
    height: .8rem;
    padding: 0 .3rem;
  }
  .orderStatus ul.wrapStatus{
    display: flex;
    justify-content: space-between;
  }
  .orderStatus ul.wrapStatus li.status{
    line-height: .8rem;
    font-size: .4rem;
    color: rgb(151,151,151);
  }
  /*订单的状态--结束*/

</style>
