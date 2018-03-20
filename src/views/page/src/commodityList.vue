<template lang="pug">
  .commodityList
    nav-bar
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center")
        searchInput(placeholder="请输入商品名称")
      .topRight(slot="right")
        img(src="../../../assets/img/scanSuccess消息.png")
    .content
      ul.wrap
        li.left
          ul
            li 综合
            li 销量
        li.right
          ul
            li.showStyle 
              img(src="../../../assets/img/page大图列表.png")
            li.price 
              .priceWords 价格
              .topDown
                img(src="../../../assets/img/page升序.png")
                img(src="../../../assets/img/page降序.png")
            li.filters | 筛选
              img(src="../../../assets/img/page筛选.png")
                  
</template>

<script>
  import jacket from '../../../assets/img/page_jacket.png'
  import downCoat from '../../../assets/img/page_downCoat.png'
  import coat from '../../../assets/img/page_coat.png'
  export default {
    name: "commodityList",
    data(){
      return {
 
      }
    },
    mounted(){
      window.onscroll = function() {};
    },
    methods:{
      
    }
  }
</script>

<style scoped>
  .active{
    background-color: #fff;
    color: rgb(244,0,87) !important;
  }
  .commodityList{
    width: 100%;
    height: 100vh;
    background: rgb(242,242,242);
    padding-bottom: 2rem;
  }
  /*顶部搜索--开始*/
  .topCenter{
    margin-left: .1rem;
    position: relative;
  }
  .topRight{
    margin-right: .1rem;
  }
  .topRight img{
    width: .7rem;
    vertical-align: middle;
  }
  /*顶部搜索--结束*/
  /*中间内容部分顶部左边--开始*/
  .content{
    padding-bottom: 2rem;
  }
  .content ul.wrap{
    display: flex;
    justify-content: space-between;
    height: 1.2rem;
    padding: 0 .3rem;
    background-color: #fff;
  }
  ul.wrap li{
    font-size: .4rem;
    text-align: center;
    line-height: 1.2rem;
    color: rgb(51,51,51);
  }
  li.left ul{
    display: flex;
  }
  li.left ul li{
    margin-right: 1rem;
  }
  /*中间内容部分顶部左边--结束*/
  /*中间内容部分顶部右边--开始*/
  li.right ul{
    display: flex;
  }
  li.right ul li.showStyle img{
    vertical-align: middle;
    width: .4rem;
    margin-top: -.1rem;
    margin-right: .1rem;
  }
  li.right ul li.price{
    display: flex;
  }
  li.right ul li.price .topDown{
    position: relative;
  }
  li.right ul li.price .topDown img{
    width: .3rem;
  }
  li.right ul li.price .topDown img:nth-child(1){
    position: absolute;
    top: .35rem;
  }
  li.right ul li.price .topDown img:nth-child(2){
    position: absolute;
    bottom: .35rem;
  }
  li.right ul li.filters{
    margin-left: .4rem;
  }
  li.right ul li.filters img{
    width: .4rem;
    vertical-align: middle;
    margin-top: -.1rem;
  }
  /*中间内容部分顶部右边--结束*/
</style>
