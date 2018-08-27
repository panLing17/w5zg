<template lang="pug">
  .wrapNav
    .navbar
      .topLeft
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="back")
      .topCenter 常见问题
      .topRight
        img(src="../../../assets/img/msg.png", @click="goTo")
    .cont
      ul
        li(@click="$router.push({path:'/cAnswers',query:{flag:1}})")
          .left
            img(src="../../../assets/img/deliverys.png")
            .words 专柜提货与专柜配送
          .right
            img(src="../../../assets/img/Shape Copy@2x.png")
        li(@click="$router.push({path:'/cAnswers',query:{flag:2}})")
          .left
            img(src="../../../assets/img/prices.png")
            .words 实付价与专柜价
          .right
            img(src="../../../assets/img/Shape Copy@2x.png")
      ul
        li(@click="$router.push({path:'/cAnswers',query:{flag:3}})")
          .left
            img(src="../../../assets/img/moneys.png")
            .words 现金券
          .right
            img(src="../../../assets/img/Shape Copy@2x.png")
        li(@click="$router.push({path:'/cAnswers',query:{flag:4}})")
          .left
            img(src="../../../assets/img/commons.png")
            .words 通用券
          .right
            img(src="../../../assets/img/Shape Copy@2x.png")
      ul
        li(@click="$router.push({path:'/cAnswers',query:{flag:5}})")
          .left
            img(src="../../../assets/img/returns.png")
            .words 退换货政策
          .right
            img(src="../../../assets/img/Shape Copy@2x.png")
</template>

<script>
    export default {
      name: "cProblem",
      methods: {
        back() {
          this.$method.back.apply(this)
        },
        goTo() {
          if (typeof w5zgApp !== 'undefined') {
            w5zgApp.toCustomService()
            return
          }
          if (window.webkit && window.webkit.messageHandlers.iosMessage) {
            let results2 = window.webkit.messageHandlers.iosMessage.postMessage({type: 'kefuButton'})
            if (results2) {
              return
            }
          }
          this.$router.push('/service')
        }
      }
    }
</script>

<style scoped>
.wrapNav{
  width: 100%;
  height: 100vh;
  background-color: #f2f2f2;
  position: fixed;
}
.navbar{
  position: fixed;
  top: 0;
  width: 100%;
  height: 1.28rem;
  border-bottom: 1px solid #f2f2f2;
  background: #fff;
  display: flex;
  align-items: center;
}
.navbar img{
 vertical-align: middle;
}
.topLeft{
  padding-left: .36rem;
  padding-top: .1rem;
}
.topCenter{
  margin-left: 3.2rem;
  font-size: .48rem;
}
.topRight{
  padding-right: .4rem;
  margin-left: 3rem;
}
.topRight img{
  width: .58rem;
  height: .58rem;
}
.cont{
  margin-top: 1.28rem;
  background-color: #f2f2f2;
  padding-top: .16rem;
}
.cont ul:first-child{
  margin-top: 0;
}
.cont ul{
  margin-top: .16rem;
  background-color: #fff;
}
.cont ul li{
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-left: .4rem;
  font-size: .4rem;
  padding: .32rem .4rem .29rem 0;
  border-bottom: 1px solid #f2f2f2;
}
.cont ul li:last-child{
  border-bottom: 0;
}
.cont ul li .left{
  display: flex;
  align-items: center;
}
.cont ul li .left img{
  width: .53rem;
  height: .53rem;
}
.cont ul li .left .words{
  margin-left: .29rem;
}
.cont ul li .right img{
  width: .58rem;
  height: .58rem;
}
</style>
