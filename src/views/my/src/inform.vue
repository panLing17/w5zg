<template lang="pug">
  .wrapNav
    nav-bar(background="rgb(244, 0, 87)")
      .topLeft(slot="left")
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 通知
    .contList
      ul
        li(v-for="item in contLists")
          .topper
            .leftT
              .point <span v-if="looked==1"></span>
              .title(:class="{active:looked==1}") 到货通知
            .rightT 18/07/17
          .bottommer
            .leftB
              img(src="")
            .rightB
              .text 您关注的【海蓝之谜精华乳霜补水保湿滋润修护柔润…】已到货，手慢无哦！
              .attr 白色; 60ml
              .price
                .leftP <span>实付价:</span><strong>￥299</strong>
                .rightP 已降价27元

</template>

<script>
  export default {
    name: "inform",
    data(){
      return{
        looked: 1,
        contLists: [{}, {}, {}]
      }
    }
  }
</script>

<style scoped>
.active{
  font-weight: 600 !important;
  padding-left: 0 !important;
}
.topLeft{
  padding-left: .36rem;
  padding-top: .1rem;
}
.topCenter{
  font-size: .48rem;
  color: #fff;
}
/*内容列表*/
.contList{
  padding-top: .26rem;
  background-color: #f2f2f2;
  padding-bottom: 1.89rem;
}
.contList li{
  margin-bottom: .26rem;
  padding-bottom: .4rem;
  background-color: #fff;
}
.contList li .topper{
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .32rem .53rem .32rem .16rem;
}
.contList li .topper .leftT{
  display: flex;
  align-items: center;
}
.contList li .topper .leftT .point{

}
.contList li .topper .leftT .point span{
  display: block;
  width: .21rem;
  height: .21rem;
  background-color: #F70057;
  border-radius: 50%;
  margin-right: .16rem;
}
.contList li .topper .leftT .title{
  color: #333;
  font-size: .42rem;
  font-weight: 500;
  padding-left: .37rem;
}
.contList li .topper .rightT{
  color: #999;
  font-size: .32rem;
  padding-left: .12rem;
}
.contList li .bottommer{
  margin: 0 .53rem;
  background-color: #f2f2f2;
  border-radius: .13rem;
  display: flex;
}
.contList li .bottommer .leftB{
  width: 2.4rem;
  height: 2.4rem;
}
.contList li .bottommer .leftB img{
  width: 2.4rem;
  height: 2.4rem;
}
.contList li .bottommer .rightB{
  width: 0;
  height: 2.4rem;
  flex-grow: 1;
  margin-left: .24rem;
  padding: .08rem 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.contList li .bottommer .rightB .text{
  color: #666;
  font-size: .35rem;
  margin-right: .24rem;
}
.contList li .bottommer .rightB .attr{
  font-size: .29rem;
  color: #999;
}
.contList li .bottommer .price{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.contList li .bottommer .price .leftP span{
  font-size: .29rem;
  color: #333;
}
.contList li .bottommer .price .leftP strong{
  font-size: .37rem;
  color: #F70057;
  font-weight: 400;
}
.contList li .bottommer .price .rightP{
  margin-right: .24rem;
  color: #FF005A;
  font-size: .29rem;
}
</style>
