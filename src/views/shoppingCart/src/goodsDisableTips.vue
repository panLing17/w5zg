<template lang="pug">
  .cardTipsBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close", @touchmove.prevent="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-show="show")
        .content.mescroll#goodsDisableTips
          .title 抱歉，本单部分商品库存不足或失效，已为您降到最大库存
          ul.goodsList
            li(v-for="i in goodsList")
              img(:src="i.logo | img-filter")
              .info
                .text {{i.gi_name}}
                ul.spec
                  li(v-for="item in i.specVOList") {{item.gspec_value}}
                .storeNum 库存:{{i.goods_num}}
          .bottom
            .goShoppingCart 返回购物车
            .next 继续结算

</template>

<script>
  export default {
    name: "card-tips",
    data() {
      return {
        goodsList: [],
        show: false
      }
    },
    watch: {
      show(val) {
        if (val) {
          // mescroll初始化
          this.$mescrollInt("goodsDisableTips", this.upCallback)
        } else {
          this.mescroll.hideTopBtn();
          this.mescroll.destroy()
        }
      }
    },
    mounted () {

    },
    methods: {
      upCallback: function (page) {
        let self = this;
        self.mescroll.endSuccess(1)
      },
      close() {
        this.show = false
      },
      checkDisableGoods (array) {
        console.log(array)
        let url = this.$route.path === '/shoppingCart/express'?'shoppingCart/submitSendList1':''
        let self = this
        let cartId = []
        array.forEach((now)=>{
          now.shoppingCartVOList.forEach((sonNow)=>{
            cartId.push(sonNow.sc_id)
          })

        })
        cartId = cartId.join(',')
        if (url) {
          self.$ajax({
            method: 'get',
            url: self.$apiApp + url,
            params: {
              scIdArray: cartId
            }
          }).then(function (response) {
            self.goodsList = []
            let nextFlag = 0
            response.data.data.forEach((now)=>{
              now.shoppingCartVOList.forEach((sonNow)=>{
                if (sonNow.status_flag.toString() === '0') {
                  nextFlag+=1
                  self.goodsList.push(sonNow)
                }
              })
            })
            if (nextFlag>0) {
              self.show = true
            } else {
              self.show = false
              let since = ''
              self.$route.path === '/shoppingCart' ? since = 'true' : since = 'false'
              if (self.$store.state.transfer.length > 0) {
                self.$router.push({path: '/confirmOrder', query: {since: since, type: 'shoppingCart'}})
              } else {
                self.$message.error('请勾选商品')
              }
            }
          })
        } else {
          alert('专柜自提')
        }

      }
    }
  }
</script>

<style scoped>
  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }

  .main {
    background-color: white;
    width: 100%;
    height: 60%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
    overflow: auto;
  }

  .title {
    font-size: .3rem;
    color: rgb(247, 0, 87);
    line-height: 1rem;
    text-align: center;
    border-bottom: solid 1px #eee;
  }
  .goodsList{
    padding: .2rem;
  }
  .goodsList>li{
    display: flex;
    margin-bottom: .2rem;
    padding-bottom: .2rem;
    border-bottom: solid 1px  #eee;
  }
  .goodsList img {
    width: 2rem;
    height: 2rem;
  }
  .info {
    flex-grow: 1;
    width: 0;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    padding-left: .2rem;
  }
  .spec{
    display: flex;
    align-items: center;
  }
  .spec li{
    margin-right: .2rem;
    color: #999;
  }
  .storeNum {
    text-align: right;
    color: #999;
  }
  /* 底部按钮 */
  .bottom {
    border-top: 1px solid #ddd;
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    display: flex;
  }
  .goShoppingCart {
    flex-grow: 1;
    color: #666;
  }
  .next {
    flex-grow: 1;
    background-color: rgb(244,0,84);
    color: white;
  }
</style>
