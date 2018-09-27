export const shoppingCart = {
  data() {
    return {
      storeList: [], //门店集合
      updateGoods: {}, // 配送方式切换时存放选中的商品下标
    }
  },
  computed: {
    isEmpty() {
      if ((this.data.commList && this.data.commList.length) || (this.data.failure && this.data.failure.length)) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    // 删除商品
    delGoods(obj) {
      let scIdArray = ''
      if ((typeof obj.i) === 'number') {
        scIdArray = this.data['commList'][obj.index].shoppingCartVOList[obj.i].sc_id
      } else {

      }
      let self = this
      self.$ajax({
        method: 'get',
        url: self.$apiGoods + 'shoppingCart/v2/shoppingCart/delete',
        params: {
          scIdArray: scIdArray
        },
      }).then(function (response) {
        if(response) {

        }
      })
    },
    // 商品选中
    goodsChange(obj) {
      let params
      let goods
      let goodsArr
      if ((typeof obj.i) === 'number') {
        goods = this.data['commList'][obj.index].shoppingCartVOList[obj.i]
        params = {
          scIdArray: goods.sc_id,
          checked: goods.checked==='011'?false:true
        }
        goods.checked = goods.checked==='011'?'012':'011'
        let c = 0
        this.data['commList'][obj.index].shoppingCartVOList.forEach(item => {
          if (item.checked==='011') {
            c++
          }
        })
        if (c === this.data['commList'][obj.index].shoppingCartVOList.length) {
          this.data['commList'][obj.index].checked = '011'
        } else {
          this.data['commList'][obj.index].checked = '012'
        }
      } else {
        goodsArr = this.data['commList'][obj.index]
        let temp = ''
        goodsArr.shoppingCartVOList.forEach(item => {
          temp += item.sc_id+','
        })
        params = {
          scIdArray: temp.substring(0, temp.length-1),
          checked: goodsArr.checked==='011'?false:true
        }
        goodsArr.shoppingCartVOList.forEach(item => {
          item.checked = goodsArr.checked==='011'?'012':'011'
        })
        goodsArr.checked = goodsArr.checked==='011'?'012':'011'
      }

      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'shoppingCart/v2/selectShoppingCart',
        params: params
      }).then(function (res) {
      })

    },
    // 配送方式切换
    changeWays(obj) {
      this.updateGoods = obj
      let goods = this.data['commList'][obj.index].shoppingCartVOList[obj.i]
      let self = this
      if (goods.delivery_ways==='168') {
        self.$refs.selectCity.show()
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/addresses',
          params: {},
        }).then(function (response) {
          if(response) {
            self.addressList = response.data.data
          }
        })
      } else {
        self.$refs.selectStore.show()
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/spu/findStoreListBySkuId',
          params: {
            gskuId: goods.gsku_id
          },
        }).then(function (response) {
          if(response) {
            self.storeList = response.data.data
          }
        })
      }
    },
    selectCity() {
    },
    // 切换为门店自提
    selectStore(obj) {
      let goods = this.data['commList'][this.updateGoods.index].shoppingCartVOList[this.updateGoods.i]
      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'shoppingCart/v2/updateShoppingCart',
        params: {
          scId: goods.sc_id,
          gskuId: goods.gsku_id,
          provinceNo: obj.bs_province_no,
          cityNo: obj.bs_city_no,
          deliveryWays: 168,
          bsId: obj.bs_id
        },
      }).then(function (response) {
        if(response) {
          self.data['commList'][self.updateGoods.index].shoppingCartVOList.splice(self.updateGoods.i, 1)
          if (self.data['commList'][self.updateGoods.index].shoppingCartVOList.length===0) {
            self.data['commList'].splice(self.updateGoods.index, 1)
          }
        }
      })
    }
  }
}
