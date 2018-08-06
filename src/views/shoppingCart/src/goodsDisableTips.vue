<template lang="pug">
  .cardTipsBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close", @touchmove.prevent="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-show="show")
        .content.mescroll#goodsDisableTips
          .title 抱歉，本单部分商品库存不足或失效，已为您降到最大库存
          ul.goodsList
            li(v-for="i in goodsList", v-if="i.status_flag !== 0")
              .img
                .shade(v-if="i.status_flag !== 0 && i.status_flag !== 1")
                  span(v-if="i.status_flag === 2") 库存不足
                  span(v-if="i.status_flag === 3") 失效
                img(:src="i.logo | img-filter")
              .info
                .text {{i.gi_name}}
                ul.spec
                  li(v-for="item in i.specVOList") {{item.gspec_value}}
                .storeNum 库存:{{i.storage_num}}
          .bottom(v-if="$route.path !== '/confirmOrder'")
            .goShoppingCart(@click="goShoppingCart") 返回购物车
            .next(@click="next", v-if="storeDownGoods | normalGoods") 继续结算
          .bottom(v-else)
            .goShoppingCart(@click="$router.push('/shoppingCart')") 返回购物车

</template>

<script>
  import {bus} from '../../../bus'

  export default {
    name: "card-tips",
    data() {
      return {
        goodsList: [],
        show: false,
        normalGoods: false,
        storeDownGoods: false
      }
    },
    watch: {
      show(val) {
        if (val) {
          // mescroll初始化
          this.$mescrollInt("goodsDisableTips", this.upCallback)
          if (this.$route.path === '/shoppingCart/express') {
            this.expressUpData()
          } else {
            this.selfCarryUpData()
          }

        } else {
          this.mescroll.hideTopBtn();
          this.mescroll.destroy()
        }
      }
    },
    mounted() {
    },
    methods: {
      upCallback: function (page) {
        let self = this;
        self.mescroll.endSuccess(1)
      },
      close() {
        this.show = false
      },
      expressUpData() {
        bus.$emit('expressGetData')
      },
      selfCarryUpData() {
        bus.$emit('selfCarryUpData')
      },
      goShoppingCart() {
        this.close()
        if (this.$route.path === '/shoppingCart/express') {
          this.expressUpData()
        } else {
          this.selfCarryUpData()
        }
      },
      next() {
        this.close()
        let since = ''
        this.$route.path === '/shoppingCart' ? since = 'true' : since = 'false'
        console.log(this.goodsList)
        if (this.$store.state.transfer.length > 0) {
          this.$router.push({path: '/confirmOrder', query: {since: since, type: 'shoppingCart'}})
        } else {
          this.$message.error('请勾选商品')
        }
      },
      // 传入回调代表来自确认订单，没有代表购物车
      checkDisableGoods(array,fun) {
        let url = 'shoppingCart/checkSubmitCartList'
        let self = this
        let cartId = []
        if (fun) {
          cartId = array
        } else {
          array.forEach((now) => {
            now.shoppingCartVOList.forEach((sonNow) => {
              cartId.push(sonNow.sc_id)
            })

          })
          cartId = cartId.join(',')
        }


        self.$ajax({
          method: 'get',
          url: self.$apiApp + url,
          params: {
            scIdArray: cartId
          }
        }).then(function (response) {
          self.goodsList = []
          let normalFlag = 0
          let downFlag = 0
          // 不正常商品购物车ID合集
          let noNormalGoods = []
          // 先判断是否有正常商品
          response.data.data.forEach((now) => {
            if (now.status_flag.toString() !== '0') {
              normalFlag += 1
            }
            if (now.status_flag.toString() !== '1') {
              downFlag += 1
            }
            if (now.status_flag.toString() !== '0' && now.status_flag.toString() !== '1') {
              noNormalGoods.push(now.sc_id)
            }
            self.goodsList.push(now)
          })

          if (fun) {
            array.split(',').forEach((now)=>{

            })
          } else {
            // 去除不能提交的商品，将数据存入
            array.forEach((now,index) => {
              now.shoppingCartVOList.forEach((sonNow, sonIndex) => {
                if (noNormalGoods.includes(sonNow.sc_id)) {
                  array[index].shoppingCartVOList.splice(sonIndex,1)
                }
              })
            })
            self.$store.commit('transferGive', array)
          }


          if (normalFlag > 0) {
            self.normalGoods = true
          } else {
            self.normalGoods = false
          }
            // 再判断有无降库存商品
          if (downFlag > 0) {
            self.storeDownGoods = true
          } else {
            self.storeDownGoods = false
          }
          if (!self.normalGoods) {
            if (fun) {
              fun()
            } else {
              let since = ''
              self.$route.path === '/shoppingCart' ? since = 'true' : since = 'false'
              if (self.$store.state.transfer.length > 0) {
                self.$router.push({path: '/confirmOrder', query: {since: since, type: 'shoppingCart'}})
              } else {
                self.$message.error('请勾选商品')
              }
            }
          } else {
            self.show = true
          }
        })

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

  .goodsList {
    padding: .2rem;
  }

  .goodsList > li {
    display: flex;
    margin-bottom: .2rem;
    padding-bottom: .2rem;
    border-bottom: solid 1px #eee;
  }

  .goodsList .img {
    position: relative;
  }

  .goodsList .img .shade {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    background-color: rgba(0, 0, 0, .5);
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

  .spec {
    display: flex;
    align-items: center;
  }

  .spec li {
    margin-right: .2rem;
    color: #999;
  }

  .storeNum {
    text-align: right;
    color: #999;
  }

  /* 底部按钮 */
  .bottom {
    background-color: white;
    border-top: 1px solid #ddd;
    width: 100%;
    height: 1.2rem;
    line-height: 1.2rem;
    text-align: center;
    position: absolute;
    z-index: 10;
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
    background-color: rgb(244, 0, 84);
    color: white;
  }
</style>
