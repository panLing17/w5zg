<template lang="pug">
  .searchResult
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        .searchInput
          img(src="../../../assets/img/searchInput搜索图标@2x.png")
          input(:type="type",placeholder="请输入商品名称" @focus="handFocus")
      .topRight(slot="right" @click="$router.go(-1)") 取消       
    .content
      .words 没有搜索到
        span.strong “某某”
        span 商品，及相关商品
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
  import my_goods from '../../../assets/img/my_goods.png'
  export default {
    name: 'searchResult',
    data () {
      return {
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
    props: {
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: 'placeholder'
      }
    },
    mounted (){
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
      handFocus () {
        this.$emit('focus', this.msg)
      },

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
.searchResult{
  background-color: rgb(242,242,242);
  padding-bottom: 2rem;
}
.topRight{
  color: rgb(245,0,87);
  font-size: .45rem;
  font-weight: 400;
}
/*搜索框样式--开始*/
.searchInput{
  width: 6.5rem;
  height: .9rem;
  background-color: rgb(238,238,238);
  border-radius: .9rem;
  line-height: .9rem;
}
.searchInput img{
  width: .4rem;
  vertical-align: middle;
  margin-left: .2rem;
}
.searchInput input{
  border: 0;
  outline: none;
  font-size: .3rem;
  margin-left: .1rem;
  background-color: rgb(238,238,238);
}
/*搜索框样式--结束*/
/*搜索结果显示--开始*/
.content{
  padding: .7rem .6rem 1.2rem;
  background-color: #fff;
}
.content .words{
  font-size: .4rem;
}
.content .words span.strong{
  color: rgb(244,0,87);
  margin: 0 .2rem;
}
/*搜索结果显示--结束*/
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
