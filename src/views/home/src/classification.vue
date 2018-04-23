<template lang="pug">
  .classification
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 运动
      .topRight(slot="right")
        img(src="../../../assets/img/searchInput搜索图标@2x.png").search
        img(src="../../../assets/img/msg_0.png").msg
    .content
      slideShow
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
    name: 'classification',
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
      }
    }
  }
</script>

<style scoped>
.classification{
	background-color: rgb(242,242,242);
	padding-bottom: 2rem;
}
.topRight img{
	vertical-align: middle;
}
.topRight img.search{
	width: .5rem;
}
.topRight img.msg{
	width: .6rem;
	margin-left: .2rem;
}
/*内容部分轮播图--开始*/
.content{
	margin-top: .2rem;
}
/*内容部分轮播图--结束*/
/*商品列表--开始*/
.goodsList{
	margin-top: .2rem;
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

