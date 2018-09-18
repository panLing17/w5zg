export const shoppingCart = {
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
    // 商品选中
    goodsChange(obj) {
      let goods = this.data['commList'][obj.index].shoppingCartVOList[obj.i]
      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'shoppingCart/v2/selectShoppingCart',
        params: {
          scIdArray: goods.sc_id,
          checked: goods.checked==='011'?false:true
        }
      }).then(function (res) {
        if(res) {
          goods.checked = goods.checked==='011'?'012':'011'
        }
      })

    },
    dataFormat(data) {
      data.commList.forEach(item => {
        item.shoppingCartVOList.forEach(goods => {
          goods.toolbarShow = false
        })
      })
      if (data.failure.length) {
        data.failure.forEach(item => {
          item.shoppingCartVOList.forEach(goods => {
            goods.toolbarShow = false
          })
        })
      }
    }
  }
}
