<template lang="pug">
  transition( leave-active-class="animated flipOutX")
    .goodsCardBox(v-if="list.shoppingCartVOList.length>0")
      .title
        p {{list.si_name ? list.si_name : list.store_name}}
        // img(src="../../../assets/img/searchHistory_clear.png")
      transition-group(tag="div", name="leftOut")
        .goodsBox(v-for="(i,index) in list.shoppingCartVOList", :key="index")
          .main
            .checkbox
              img(src="../../../assets/img/Invalid@3x.png")
            img(:src="i.logo | img-filter")
            .info
              .text
                .name {{i.gi_name}}
                .spec
                  span(v-for="item in i.specVOList") {{item.gspec_value}}
              .price
                span {{i.now_price | price-filter}}
            .mainRight
          .bottom
            .right
              span 商品已过期
              img
            .left
              img(@click="deleteDisableGoods(i.sc_id,index)", src="../../../assets/img/searchHistory_clear.png")
</template>

<script>
  export default {
    name: "disable-goods",
    data () {
      return {
        isdefault: false
      }
    },
    props: {
      list: Object
    },
    methods: {
      changeType () {
        this.$emit('tab')
        this.list.splice(0,1)
      },
      deleteDisableGoods (id, index) {
        this.$confirm({
          title: '删除失效商品',
          message: '确定要删除么',
          confirm: () => {
            /*this.list.shoppingCartVOList.splice(index,1)*/
            let self = this
            self.$ajax({
              method: 'delete',
              url:self.$apiApp +  'shoppingCart/shoppingCart/delete',
              params: {
                scIdArray: id
              },
            }).then(function (response) {
              self.$emit('clear')
              self.disableGoods = []
              self.$message.success('删除成功')
              self.$parent.getData()
            })
          },
          noConfirm: () => {

          }
        })

      }
    }
  }
</script>

<style scoped>
  .goodsCardBox{
    background-color: white;
    padding: 0 .2rem;
  }
  .title{
    height: .8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
  }
  .title p{
    margin-left: 5px;
  }
  .title img {
    width: .6rem;
  }
  .goodsBox {
    background-color: white;
  }
  .main{
    /*height: 2.2rem;*/
    display: flex;
    padding-top: .2rem;
    align-items: center;
  }
  .main .checkbox {
    padding-right: .2rem;
    /*height: 100%;*/
    display: flex;
    align-items: center;
  }
  .main .checkbox img{
    width: .7rem;
  }
  .main>img{
    width: 2rem;
    height: 2rem;
    border-radius: .2rem;
  }
  .info{
    flex-grow: 1;
    padding-left: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .price{
    display: flex;
    justify-content: space-between;
  }
  .mainRight {
    width: 1rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  .mainRight>img{
    width: .5rem;
  }
  .mainRight>p{
    font-size: .35rem;
  }
  .bottom{
    margin-top: .3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: .8rem;
    border-top: solid 1px rgb(250,250,250);
  }
  .bottom .right{
    margin-left: .3rem;
    color: #aaaaaa;
  }
  .bottom .left {
    display: flex;
    align-items: center;
  }
  .bottom .left img{
    height: .4rem;
    margin-right: .1rem;
  }
  /* 动画 */
  .leftOut-enter-active {
    transition: all .3s ease;
  }
  .leftOut-leave-active {
    transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .leftOut-enter, .leftOut-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translate(-100%,-1000%) scale(.1,.1);
    opacity: 0;
  }
</style>
