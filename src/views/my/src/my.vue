<template lang="pug">
  div.myBox
    div.head
      p.top
          img(src="../../../assets/img/my_set@2x.png" @click="routergoSet()")
          img(src="../../../assets/img/my_account@2x.png" @click="routergoUser()")
      p.center
          ul.headPic
            li(@click="routergoUser()") 头像
          ul.userName
            li {{name}}
          ul.balance
            li 余额:
            li 8888.88
            li 元
    div.fav_att_foot
      ul.left
        li 0
        li 收藏夹
      ul.center
        li 0
        li 关注店铺
      ul.right
        li 22
        li 足迹
    div.myOrderForm
      ul.top
        li 我的订单
        li
          img(src="../../../assets/img/my_more@2x.png")
      ul.bottom
        li
          img(src="../../../assets/img/my_obligation@2x.png")
        li
          img(src="../../../assets/img/my_readyfordelivery@2x.png")
        li
          img(src="../../../assets/img/my_waitforreceiving@2x.png")
        li
          img(src="../../../assets/img/my_remaintobeevaluated@2x.png")
        li
          img(src="../../../assets/img/my_aftersale@2x.png")
    div.myTreasure
      ul.top
        li 我的财富
        li
          img(src="../../../assets/img/my_more@2x.png")
      ul.bottom
        li
          img(src="../../../assets/img/my_bankcard@2x.png")
        li
          img(src="../../../assets/img/my_card@2x.png")
        li
          img(src="../../../assets/img/my_cashcoupon@2x.png")
    div.recommend
      img(src="../../../assets/img/my_recommend@2x.png")
    div.goodsList
      ul.goods
        li(v-for="item in goodsDetails").details
          ul
            li.img
              img(v-bind:src="item.imgSrc")
            li.goodsMsg
              span {{item.goodsMsg}}
            li.price
              span {{item.price | price-filter}}
            li.region
              span {{item.region}}
              span {{item.buyerNum}} 人已购买
    div(@click="topFunction()")#returnTop
      img(src="../../../assets/img/my_top@2x.png")
    .downOver 已到最底部

</template>

<script>
import my_goods from '../../../assets/img/my_goods.png'
  export default {
    name: "my",
    data() {
      return{
        name:this.$route.query.routeParams,
        goodsDetails:[
          {
            'imgSrc':my_goods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':568,
            'region':'江苏南京',
            'buyerNum':'167'
          },
          {
            'imgSrc':my_goods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':379,
            'region':'浙江杭州',
            'buyerNum':'200'
          },
          {
            'imgSrc':my_goods,
            'goodsMsg':'法国PELLIOT秋冬新品户外冲锋衣',
            'price':299,
            'region':'安徽合肥',
            'buyerNum':'101'
          },
        ]


      }

    },
    mounted(){
      // 当网页向下滑动 40px 出现"返回顶部" 按钮
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
          if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
              document.getElementById("returnTop").style.display = "block";
          } else {
              document.getElementById("returnTop").style.display = "none";
          }
      }


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

      routergoUser:function(){
        this.$router.push({
           name: '我的用户资料',
           query: {
              routeParams: this.name
           }
        });
      },

      routergoSet:function(){
        this.$router.push({
           name: '我的设置',
           query: {
              routeParams: this.name
           }
        });
      }

    }
  }
</script>

<style scoped>
  .myBox {
    /*height: 100vh;*/
    width: 100%;
    background-color: rgb(242,242,242);
    padding-bottom: 2rem;
  }
  /*头部--开始*/
  .head{
    width: 100%;
    height: 5rem;
    background: url("../../../assets/img/my_bg.png") no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
  }
  .head .top{
    width: 100%;
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }
  .head .top img{
    width: .7rem;
    height: .7rem;
    margin-left: .5rem;
  }
  .head .top img:nth-child(2){
    margin-right: .5rem;
  }
  .head .center{
    display: flex;
    position: relative;
  }
  .head .center .headPic{
    width: 1.6rem;
    height: 1.6rem;
    background: #aaa;
    margin-left: .5rem;
    margin-top: .4rem;
    border-radius: 50%;
    text-align: center;
    line-height: 1.6rem;
  }
  .head .center .userName{
    display: flex;
    margin-top: .4rem;
    margin-left: .3rem;
  }
  .head .center .userName li{
    align-self: center;
    color: #fff;
    font-size: .4rem;
  }
  .head .center .balance{
    display: flex;
    width: 4rem;
    height: .8rem;
    background-color: rgba(255,255,255,0.4);
    text-align: center;
    border-top-left-radius: .4rem;
    border-bottom-left-radius: .4rem;
    position: absolute;
    right: 0;
    top: .4rem;
  }
  .head .center .balance li{
    line-height: .8rem;
    margin-left: .3rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .head .center .balance li:nth-child(1){
    margin-left: .4rem;
  }
  /*头部--结束*/
  /*收藏夹，关注店铺，足迹--开始*/
  .fav_att_foot{
    display: flex;
    justify-content: space-around;
    padding-top: .3rem;
    padding-bottom: .2rem;
    background-color: #fff;
  }
  .fav_att_foot ul{
    text-align: center;
  }
  .fav_att_foot ul li{
    font-size: .4rem;
    color: rgb(51,51,51);
    line-height: .8rem;
  }
  /*收藏夹，关注店铺，足迹--结束*/
  /*我的订单和我的财富--开始*/
	.myOrderForm,
	.myTreasure{
		background-color: #fff;
		padding: .4rem 0 .5rem;
		margin-top: .2rem;
	}
	.myOrderForm ul.top,
	.myTreasure ul.top{
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgb(153,153,153);
		padding-bottom: .4rem;
		margin: 0 .4rem;
	}
	.myOrderForm ul.top li,
	.myTreasure ul.top li{
		font-size: .4rem;
		font-weight: bold;
	}
	.myOrderForm ul.top li:nth-child(2) img,
	.myTreasure ul.top li:nth-child(2) img{
		width: 1.3rem;
		vertical-align: top;
		margin-top: .05rem;
	}
	.myOrderForm ul.bottom{
		display: flex;
		justify-content: space-between;
		padding: .4rem .4rem 0 .1rem;
	}
	.myOrderForm ul.bottom li img{
		width: 1.7rem;
	}
	/*我的订单和我的财富--结束*/
	/*我的财富独有的样式--开始*/
	.myTreasure ul.bottom{
		display: flex;
		justify-content: space-between;
		padding: .4rem 1.2rem 0;
	}
	.myTreasure ul.bottom li img{
		width: 1.3rem;
	}
	/*我的财富独有的样式--结束*/
	/*我的推荐--开始*/
	.recommend{
		height: 1rem;
		line-height: 1.2rem;
		text-align: center;
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
