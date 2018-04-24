<template lang="pug">
  .scanSuccess
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 扫描成功
      .topRight(slot="right")
        img(src="../../../assets/img/msg_0.png")
    .cont
      .top 扫描成功
      .center 您获得200元,已经加入您的账户
      .bottom
        ul
          li.backHome(@click="$router.push('/home')") 返回首页
          li.orderCenter 订单中心
    .recommend
      img(src="../../../assets/img/my_recommend@2x.png")
    .goodsList
      ul.goods
        li(v-for="item in goodsDetails").details
          ul
            li.img
              img(v-bind:src="item.imgSrc")
            li.goodsMsg
              span {{item.goodsMsg}}
            li.price
              span ￥{{item.price}}
            li.region
              span {{item.region}}
              span {{item.buyerNum}} 人已购买
    #returnTop(@click="topFunction()")
      img(src="../../../assets/img/my_top@2x.png")
    .downOver 已到最底部
</template>
<script>
  export default {
    name: 'scanSuccess',
    data () {
      return {
         goodsDetails:[
        ]
      }
    },
    mounted () {
      // 当网页向下滑动 40px 出现"返回顶部" 按钮
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
          if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
              document.getElementById("returnTop").style.display = "block";
          } else {
              document.getElementById("returnTop").style.display = "none";
          }
      };
    },
    methods: {
      // 点击按钮，返回顶部
      topFunction:function () {
        var timer = setInterval(function(){
            var top = document.body.scrollTop || document.documentElement.scrollTop;
            var speed = top / 4;
            if (document.body.scrollTop!=0) {
                document.body.scrollTop -= speed;
            }else {
                document.documentElement.scrollTop -= speed;
            }
            if (top == 0) {
                clearInterval(timer);
            }
        },30);
      },
    }
  }
</script>

<style scoped>
.scanSuccess{
  padding-bottom: 2rem;
  background-color: rgb(242,242,242);
}
.topCenter{
  font-size: .45rem;
  font-weight: 400;
}
.topRight img{
  width: .7rem;
  vertical-align: middle;
}
/*中间内容部分--开始*/
.cont{
  padding: .8rem 0 .4rem;
  background-color: #fff;
}
.cont .top{
  text-align: center;
  font-size: .45rem;
}
.cont .center{
  text-align: center;
  margin-top: .4rem;
  font-size: .35rem;
  color: rgb(176,176,176);
}
.cont .bottom{
  margin-top: .8rem;
}
.cont .bottom ul{
  display: flex;
  padding: 0 1.3rem;
  justify-content: space-between;
}
.cont .bottom ul li{
  width: 3rem;
  height: 1rem;
  border: 1px solid rgb(152,152,152);
  border-radius: 1rem;
  text-align: center;
  line-height: 1rem;
}
.cont .bottom ul li.orderCenter{
  border-color: rgb(244,0,87);
  color: rgb(244,0,87);
}
/*中间内容部分--结束*/
 /*我的推荐--开始*/
  .recommend{
    height: 1rem;
    line-height: 1.2rem;
    text-align: center;
    background-color: rgb(242,242,242);
  }
  .recommend img{
    width: 5rem;
  }
  /*我的推荐--结束*/
  /*商品列表--开始*/
  .goodsList{
    padding: 0 .3rem .4rem 0;
    background-color: #fff;
  }
  .goodsList ul.goods{
    display: flex;
    flex-wrap: wrap;
  }
  .goodsList ul.goods li.details{
    width: 4.5rem;
    border: 1px solid rgb(153,153,153);
    border-radius: .3rem;
    margin: .4rem 0 0 .35rem;
    padding-bottom: .2rem;
  }
  .goodsList ul.goods li.details img{
    border-top-left-radius: .3rem;
    border-top-right-radius: .3rem;
    width: 4.46rem;
  }

  .goodsList li.details li.goodsMsg{
    font-size: .4rem;
    padding: 0 .2rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .goodsList li.details li.price{
    font-weight: bold;
    color: rgb(245,0,87);
    font-size: .4rem;
    margin-top: .2rem;
    padding: 0 .15rem;
  }
  .goodsList li.details li.region{
    margin-top: .2rem;
    padding: 0 .2rem;
    display: flex;
    justify-content: space-between;
    color: rgb(153,153,153);
    font-size: .3rem;
  }
  /*商品列表--结束*/
  /*返回顶部的样式--开始*/
  #returnTop{
    width: 1.5rem;
    position: fixed;
    right: .3rem;
    bottom: 2rem;
    display: none;
  }
  #returnTop img{
    width: 1.5rem;
    vertical-align: top;
  }
  /*返回顶部的样式--开始*/
  /*已到最底部--开始*/
  .downOver{
    text-align: center;
  }
  /*已到最底部--结束*/
</style>
