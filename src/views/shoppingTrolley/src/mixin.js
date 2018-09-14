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
