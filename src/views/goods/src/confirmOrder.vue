<template lang="pug">
  .confirmOrderBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 确认订单
      .topRight(slot="right")
    #confirmOrderBox.mescroll
      .title
        .stud 联系人
      .location(v-if="$route.query.since === 'true'")
        ul.locationInput
          li
            label 提货人
              input(type="text", placeholder="请输入提货人姓名", v-model="name")
          li
            label 联系方式
              input(type="text", placeholder="请输入提货人联系方式", v-model="phone")
      .location(v-if="$route.query.since === 'false'&&JSON.stringify(giveGoodsAddress) !== '{}'", @click="goSelectLocation")
        .content
          .nameAndMobile
            p 收件人：{{giveGoodsAddress.ra_name}}
            p 手机号：{{giveGoodsAddress.ra_phone}}
          .giveGoodsLocation
            .label 收货地址
            .info {{giveGoodsAddress.province_name}} {{giveGoodsAddress.city_name}} {{giveGoodsAddress.county_name}} {{giveGoodsAddress.ra_detailed_addr}}
        .icon
          img(src="../../../assets/img/next@2x.png")
      .location(v-if="$route.query.since === 'false'&&JSON.stringify(giveGoodsAddress) === '{}'")
        .addLocation
          p(@click="$router.push('/my/localAdd')") 添加收货地址
      goods-card.goods-card(v-for="(item,index) in transfer", :key="index", :data="item", :since="$route.query.since")
      .allPrice
        .goodsNum 共计{{content}}件商品
        .price
          span 合计
          p {{price | price-filter}}
      ul.switchList
        li
          .left 现金券
          .right(v-if="dataFlag")
            span 可抵扣{{netAndCommitCard.netCard}}
            toggle-button(v-model="netCardFlag", color="rgb(244,0,87)", @change="netCardChange" , :disabled="netAndCommitCard.netCard === 0")
        li
          .left 通用券 <span>可抵扣{{netAndCommitCard.commTicket}}</span>
          .right(v-if="dataFlag")
            toggle-button(v-model="commonTicketFlag", color="rgb(244,0,87)", :disabled="netAndCommitCard.commTicket === 0")
    .submit
      .left 实付：{{computedPriceText | price-filter}}
      .right(@click="submit") 提交订单
      location-select(:show="flag", :location="locationList", @close="locationSelectClose", @selected="locationChange")
      // 失效商品提示
      disableTips(ref="disableTips")
</template>

<script>
  import disableTips from '../../shoppingCart/src/goodsDisableTips'
  import goodsCard from './goodsCard'
  import locationSelect from './locationSelect'
  import {mapState} from 'vuex'
  import {mapGetters} from 'vuex'

  export default {
    name: 'confirm-order',
    data() {
      return {
        flag: false,
        netCardFlag: false,
        commonTicketFlag: false,
        dataFlag: false,
        price: 0,
        content: 0,
        name: '',
        phone: '',
        locationList: [
          {}
        ],
        // 通用券与抵用金额
        netAndCommitCard: {
          commTicket: 0,
          netCard: 0
        },
        // 是否禁用switch
        switchFlag: false,
        // 提交订单flag，防止用户多次点击
        submitFlag: true,
        // 当前所有总运费
        allFreight: 0
      }
    },
    computed: {
      computedPriceText() {
        if (this.netCardFlag && this.commonTicketFlag) {
          return this.price - (this.netAndCommitCard.commTicket + this.netAndCommitCard.netCard) + this.allFreight
        } else if (this.commonTicketFlag) {
          return this.price - this.netAndCommitCard.commTicket + this.allFreight
        }
        else if (this.netCardFlag) {
          return this.price - this.netAndCommitCard.netCard + this.allFreight
        }
        else if (this.commonTicketFlag) {
          return this.price - this.netAndCommitCard.commTicket + this.allFreight
        } else {
          return this.price + this.allFreight
        }
      },
      ...mapState(['giveGoodsAddress']),
      ...mapGetters(['transfer'])
    },
    components: {goodsCard, locationSelect, disableTips},
    mounted() {
      // mescroll初始化
      this.$mescrollInt("confirmOrderBox", this.upCallback)
      this.getLocation()
      this.computedPrice()
      // this.computedFreight()
      // 如果用户不是b请求计算通用券与抵用金额
      if (this.$store.state.userData.member_type !== '092') {
        this.getVoucher()
      }
    },
    methods: {
      upCallback() {
        this.mescroll.endSuccess(1)
      },
      // 地址变化后
      locationChange() {
        let self = this
        let cartId = []
        console.log(this.transfer)
        this.transfer.forEach((now)=>{
          now.shoppingCartVOList.forEach((sonNow)=>{
            cartId.push(sonNow.sc_id)
          })
        })
        cartId = cartId.join(',')
        console.log(cartId)
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'shoppingCart/submitSendList1',
          params: {
            scIdArray: cartId,
            cityNo: self.$store.state.location.city.id
          }
        }).then(function (response) {
          self.$store.commit('transferGive', response.data.data.commList)
          self.price = response.data.data.totalPrice + response.data.data.totalFreight
        })
      },
      // 获取每个商品运费
      getGoodsFreight() {
        let fun = new Promise((resolve, reject) => {
          let self = this
          let jsonStr = []
          this.transfer.forEach((now) => {
            jsonStr.push({
              gsku_id: now.skuId,
              goods_num: now.number
            })
          })
          jsonStr = JSON.stringify(jsonStr)
          self.$ajax({
            method: 'get',
            url: self.$apiApp + 'shoppingCart/querySkuFreightList',
            params: {
              skuNumArrayStr: jsonStr,
              cityNo: self.giveGoodsAddress.ra_city
            }
          }).then(function (response) {
            let json = Object.assign(self.transfer)
            // 遍历每个商品，并加入运费
            response.data.data.forEach((now) => {
              json.forEach((sonNow) => {
                if (sonNow.skuId.toString() === now.gsku_id.toString()) {
                  sonNow.freight = now.freight
                }
              })
            })
            // 重新赋值到vuex
            self.$store.commit('transferGive', json)
            resolve()
          })
        })
        return fun
      },

      // 计算总邮费
      computedFreight() {
        /*let allFreight = 0
        // 若来自购物车快递订单，运费计算按照供应商计算
        if (this.$route.query.since === 'false' && this.$route.query.type === 'shoppingCart') {
          let newObject = {}
          this.$store.state.transfer.forEach((now, index) => {
            // 判断当前有无此商品所对应的供货商id
            if (newObject.hasOwnProperty(now.si_id)) {
              newObject[now.si_id].push(now)
            } else {
              newObject[now.si_id] = []
              newObject[now.si_id].push(now)
            }
          })
          // 新对象循环，得出每个门店最大运费
          for (let i in newObject) {
            let nowMaxFreight = 0
            newObject[i].forEach((now)=>{
              if (parseInt(now.freight) > nowMaxFreight) {
                nowMaxFreight = parseInt(now.freight)
              }
            })
            allFreight += nowMaxFreight
          }
          // 运费赋值
          this.allFreight = allFreight
        } else {
          this.$store.state.transfer.forEach((now)=>{
            if (now.freight>allFreight) {
              allFreight = now.freight
            }
          })
          if (this.$route.query.since === 'false') {
            this.allFreight = allFreight
          } else {
            this.allFreight = 0
          }
        }*/
        /*if (this.$route.query.since !== 'true'){
          // 通过接口请求运费，临时用，后续修改
          let self = this
          let jsonStr = []
          this.transfer.forEach((now)=>{
            jsonStr.push({
              gsku_id: now.skuId,
              goods_num: now.number
            })
          })
          jsonStr = JSON.stringify(jsonStr)
          self.$ajax({
            method: 'get',
            url: self.$apiApp + 'shoppingCart/queryFreight',
            params: {
              skuNumArrayStr: jsonStr,
              cityNo: self.giveGoodsAddress.ra_city
            }
          }).then(function (response) {
            self.allFreight = response.data.data
          })

        }*/

      },
      submit() {
        if (this.submitFlag) {
          // 先判断是购物车提交还是直接购买，再判断是自提订单还是配送订单
          if (this.$route.query.type === 'direct') {
            if (this.$route.query.since === 'true') {
              this.directSince()
            } else {
              this.directDistribution()
            }
          } else {
            // 将购物车部分进行封装，以便用于回调
            let fun = ()=>{
              if (this.$route.query.since === 'true') {
                this.shoppingCartSince()
              } else {
                this.shoppingCartDistribution()
              }
            }
            // 当前要提交的商品
            let data = []
            this.transfer.forEach((now)=>{
              now.shoppingCartVOList.forEach((sonNow)=>{
                data.push(sonNow.sc_id)
              })
            })
            data = data.join(',')
            this.$refs['disableTips'].checkDisableGoods(data, fun)
          }
        } else {
          this.$message.warning('稍安勿躁,请勿重复点击')
        }
      },
      /* 立即购买快递配送订单生成 */
      directDistribution() {
        if (!this.giveGoodsAddress.id) {
          this.$message.error('请选择收货地址')
          return false
        }
        let netCardFlag = this.netCardFlag ? '011' : '012'
        let commonTicketFlag = this.commonTicketFlag ? '011' : '012'
        let self = this
        // 点击按钮失效
        this.submitFlag = false
        this.$ajax({
          method: 'post',
          url: self.$apiTransaction + 'order/nowSendOrder',
          params: {
            gskuId: self.$store.state.skuId,
            netCardFlag: netCardFlag,
            commonTicketFlag: commonTicketFlag,
            deliveryId: self.giveGoodsAddress.id,
            buyNum: self.content
          }
        }).then(function (response) {
          // self.$message.success('成功生成订单')
          self.$router.push({
            path: '/payment',
            query: {id: response.data.data.totalOrderId, price: response.data.data.payPrice}
          })
        })
      },
      /* 立即购买自提订单生成 */
      directSince() {
        if (!this.name || !this.phone) {
          this.$message.error('请正确填写提货信息')
          return false
        }
        if (!/^1[3|4|5|7|8|9][0-9]{9}$/.test(this.phone)) {
          this.$message.error('请输入正确手机号')
          return
        }
        let netCardFlag = this.netCardFlag ? '011' : '012'
        let commonTicketFlag = this.commonTicketFlag ? '011' : '012'
        let self = this
        // 点击按钮失效
        this.submitFlag = false
        this.$ajax({
          method: 'post',
          url: self.$apiTransaction + 'order/submitNowCarryOrder',
          params: {
            gskuId: self.$store.state.skuId,
            netCardFlag: netCardFlag,
            commonTicketFlag: commonTicketFlag,
            carryPerson: self.name,
            carryPhone: self.phone,
            buyNum: self.content,
            bsId: self.$store.state.location.store.id
          }
        }).then(function (response) {
          if (response.data.optSuc) {
            // self.$message.success('成功生成订单')
            self.$router.push({
              path: '/payment',
              query: {id: response.data.data.totalOrderId, price: response.data.data.payPrice}
            })
          }
        })
      },
      /* 购物车自提订单生成 */
      shoppingCartSince() {
        if (!this.name || !this.phone) {
          this.$message.error('请正确填写提货信息')
          return false
        }
        let netCardFlag = this.netCardFlag ? '011' : '012'
        let commonTicketFlag = this.commonTicketFlag ? '011' : '012'
        let self = this
        let cartId = []
        this.$store.state.transfer.forEach((now) => {
          now.shoppingCartVOList.forEach((sonNow) => {
            cartId.push(sonNow.sc_id)
          })

        })
        cartId = cartId.join(',')
        // 点击按钮失效
        this.submitFlag = false
        this.$ajax({
          method: 'post',
          url: self.$apiTransaction + 'order/submitCarryOrder',
          params: {
            gcIdArray: cartId,
            netCardFlag: netCardFlag,
            commonTicketFlag: commonTicketFlag,
            carryPerson: self.name,
            carryPhone: self.phone
          }
        }).then(function (response) {
          // self.$message.success('成功生成订单')
          self.$router.push({
            path: '/payment',
            query: {id: response.data.data.totalOrderId, price: response.data.data.payPrice}
          })
        })
      },
      /* 购物车配送订单生成 */
      shoppingCartDistribution() {
        if (!this.giveGoodsAddress.id) {
          this.$message.error('请选择收货地址')
          return false
        }
        let netCardFlag = this.netCardFlag ? '011' : '012'
        let commonTicketFlag = this.commonTicketFlag ? '011' : '012'
        let self = this
        let cartId = []
        console.log(this.$store.state.transfer)
        this.$store.state.transfer.forEach((now) => {
          now.shoppingCartVOList.forEach((sonNow) => {
            cartId.push(sonNow.sc_id)
          })
        })
        cartId = cartId.join(',')
        // 点击按钮失效
        this.submitFlag = false
        this.$ajax({
          method: 'post',
          url: self.$apiTransaction + 'order/submitSendOrder',
          params: {
            gcIdArray: cartId,
            netCardFlag: netCardFlag,
            commonTicketFlag: commonTicketFlag,
            deliveryId: self.giveGoodsAddress.id
          }
        }).then(function (response) {
          // self.$message.success('成功生成订单')
          self.$router.push({
            path: '/payment',
            query: {id: response.data.data.totalOrderId, price: response.data.data.payPrice}
          })
        })
      },
      // 现金券变化
      netCardChange() {
      },
      getLocation() {
        let self = this
        this.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/addresses',
          params: {
            cityNo: self.$store.state.location.city.id
          }
        }).then(function (response) {
          if (response.data.data.length > 0) {
            self.locationList = response.data.data
            self.locationList.forEach((now) => {
              if (now.ra_default === '011') {
                // 如果没选择过地址，取默认
                if (!self.giveGoodsAddress.city_name) {
                  self.$store.commit('giveGoodsAddressChange', now)
                }
                // 为商品赋值运费
                // self.getGoodsFreight().then(()=>{
                //   self.computedFreight()
                // })
              }
            })
          }
        })
      },
      computedPrice() {
        // 来自购物车与直接购买计算规则不同
        if (this.$route.query.type === 'shoppingCart') {
          this.transfer.forEach((now) => {
            now.shoppingCartVOList.forEach((sonNow) => {
              this.price += sonNow.counter_price * sonNow.goods_num
              this.content += sonNow.goods_num - 0
            })

          })
        } else {
          this.transfer.forEach((now) => {
            this.price += now.price * now.number
            this.content += now.number - 0
          })
        }
      },
      // 请求可抵用金额与通用券
      getVoucher(flag) {
        let netCardFlag = this.netCardFlag ? '011' : '012'
        let self = this
        if (this.$route.query.type === 'shoppingCart') {
          let cartId = []
          this.$store.state.transfer.forEach((now) => {
            now.shoppingCartVOList.forEach((sonNow) => {
              cartId.push(sonNow.sc_id)
            })

          })
          cartId = cartId.join(',')
          self.$ajax({
            method: 'get',
            url: self.$apiTransaction + 'order/submitOrderCard',
            params: {
              gcIdArray: cartId,
              netCardFlag: netCardFlag
            }
          }).then(function (response) {
            self.netAndCommitCard = response.data.data
            if (self.netAndCommitCard.netCard > 0) {
              self.netCardFlag = true
            } else {
              self.netCardFlag = false
            }
            self.dataFlag = true
          })
        } else {
          self.$ajax({
            method: 'get',
            url: self.$apiTransaction + 'order/nowSubmitOrderCard',
            params: {
              gskuId: self.$store.state.skuId,
              netCardFlag: netCardFlag,
              num: self.content
            }
          }).then(function (response) {
            self.netAndCommitCard = response.data.data
            if (self.netAndCommitCard.netCard > 0) {
              self.netCardFlag = true
            } else {
              self.netCardFlag = false
            }
            self.dataFlag = true
          })
        }
      },
      locationSelectClose() {
        this.flag = false
      },
      goSelectLocation() {
        this.flag = true
      }
    }
  }
</script>

<style scoped>
  .confirmOrderBox {
    background: rgb(242, 242, 242);

    min-height: 100vh;

  }

  #confirmOrderBox {
    position: fixed;
    padding-bottom: 1.3rem;
  }

  .title {
    background: white;
  }

  .stud {
    width: 1.9rem;
    height: .8rem;
    padding-left: .2rem;
    background-color: rgb(244, 0, 87);
    color: white;
    display: flex;
    align-items: center;
    border-bottom-right-radius: .3rem;
  }

  .location {
    padding: .2rem;
    display: flex;
    background-color: white;
    justify-content: space-between;
  }

  .location .content {
    flex-grow: 1;
  }

  .nameAndMobile {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  .location .icon {
    width: 1rem;
  }

  .giveGoodsLocation {
    display: flex;
    margin-top: .2rem;
  }

  .giveGoodsLocation .label {
    width: 1.5rem;
    line-height: .6rem;
  }

  .giveGoodsLocation .info {
    width: 0;
    flex-grow: 1;
    line-height: .6rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .icon img {
    height: .4rem;
  }

  /* 商品卡片部分 */
  .goods-card {
    margin-top: .2rem;
  }

  /* 合计部分 */
  .allPrice {
    height: 1.2rem;
    padding-right: .2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .goodsNum {
    margin-right: .3rem;
    color: #aaa;
  }

  .price {
    display: flex;
    align-items: center;
  }

  .price span {
    margin-right: .1rem;
  }

  .price p {
    font-weight: 600;
    font-size: .45rem;
    color: rgb(244, 0, 87);
  }

  /* 开关列表 */
  .switchList {
    background: white;
  }

  .switchList li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 .2rem;
    height: 1.2rem;
    border-bottom: solid 1px #ddd;
  }

  .switchList .left {
    font-size: .35rem;
    font-weight: 600;
  }

  .switchList .left span {
    color: #aaa;
    font-weight: 500;
    font-size: .3rem;
    margin-left: .2rem;
  }

  .switchList .right {
    color: rgb(244, 0, 87);
    display: flex;
    align-items: center;
  }

  .switchList .right span {
    margin-right: .2rem;
  }

  /* 提交 */
  .submit {
    width: 100%;
    height: 1.2rem;
    font-size: .35rem;
    border-top: 1px solid #ddd;
    background-color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .submit .left {
    flex-grow: 1;
    display: flex;
    justify-content: flex-end;
    margin-right: .4rem;
  }

  .submit .right {
    width: 3.5rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(244, 0, 87);
    color: white;
  }

  .addLocation {
    width: 100%;
    height: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .addLocation p {
    border: solid 1px #ddd;
    color: rgb(247, 0, 84);
    width: 3rem;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    border-radius: 1.5rem;
  }

  /* 自提部分地址样式 */
  .locationInput {
    width: 100%;
  }

  .locationInput li {
    height: 1rem;
    width: 100%;
  }

  .locationInput li:first-child {
    border-bottom: solid 1px #eee;
  }

  .locationInput li label {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .locationInput li label input {
    width: 7.5rem;
    outline: none;
    border: none;

  }
</style>
