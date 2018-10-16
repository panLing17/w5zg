export const shoppingCart = {
  props: {
    totalCount: {
      type: String
    }
  },
  data() {
    return {
      storeList: [], //门店集合
      goodsDetail: {}
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
    // 长按操作
    touchstart(e) {
      this.longClick=0;
      this.timeOutEvent = setTimeout(()=>{
        //此处为长按事件-----在此显示遮罩层及删除按钮
        this.longClick=1;//假如长按，则设置为1
      },500);
      let touch = e.touches[0];
      this.touchY = touch.clientY;
    },
    touchmove(e) {
      clearTimeout(this.timeOutEvent);
      this.timeOutEvent = 0;
      let touch = e.touches[0]
      if(Math.abs(touch.clientY - this.touchY) < 10){
        e.preventDefault();
      }
    },
    // 选中接口
    selectAjax(params, callback) {
      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'shoppingCart/v2/selectShoppingCart',
        params: params
      }).then(function (res) {
        if (res) {
          callback && callback()
        }
      })
    },
    // 删除接口
    deleteAjax(params, callback) {
      let self = this
      self.$ajax({
        method: 'delete',
        url: self.$apiGoods + 'shoppingCart/v2/shoppingCart/delete',
        params: params,
      }).then(function (response) {
        if (response) {
          callback && callback()
        }
      })
    },
    // 收藏接口
    collectionAjax(params) {
      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'gcdetails/saveGcFavorite',
        params: params,
      }).then(function (response) {
        if (response) {
          self.$notify({
            content: '移入收藏成功',
            bottom: 3.2
          })
        }
      })
    },
    // 商品明细数据接口
    goodsDetailAjax(gspuId, callback) {
      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'gcdetails/spu/detail',
        params: {
          gspuId: gspuId
        },
      }).then(function (response) {
        if (response) {
          self.goodsDetail = response.data.data
          callback && callback()
        }
      })
    },
    // 更新购物车接口
    updateAjax(params, callback) {
      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'shoppingCart/v2/updateShoppingCart',
        params: params,
      }).then(function (response) {
        if (response) {
          callback && callback()
        }
      })
    },
    // 更新数量接口
    updateCountAjax(params, callback) {
      let self = this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'shoppingCart/v2/shoppingCart',
        params: params,
      }).then(function (response) {
        if (response) {
          callback && callback()
        }
      })
    },
    // 获取门店接口
    storeListAjax(params, callback) {
      let self =this
      self.$ajax({
        method: 'post',
        url: self.$apiGoods + 'shoppingCart/v2/getStoreListBySkuId',
        params: params
      }).then(function(res){
        if(res) {
          callback && callback(res.data.data)
        }
      })
    },
    // 选中购物车卡券的计算接口
    queryCartMoneyAjax(deliveryWays) {
      let self =this
      self.$ajax({
        method: 'get',
        url: self.$apiGoods + 'shoppingCart/v2/queryCartMoney',
        params: {
          deliveryWays: deliveryWays
        }
      }).then(function(res){
        if(res) {
          self.$emit('total-change', res.data.data)
        }
      })
    },
    // 购物车校验接口
    checkCartAjax(params, callback) {
      let self =this
      self.$ajax({
        method: 'get',
        url: self.$apiGoods + 'shoppingCart/v2/checkSubmitCartList',
        params: params
      }).then(function(res){
        if(res) {
          callback && callback(res.data.data)
        }
      })
    },
    // 公共规格切换方法
    specChangeCommon(goods) {
      let selectionSize = []
      goods.specVOList.forEach(item=>{
        selectionSize.push({
          value: item.gspec_value
        })
      })
      this.resetSpec = {
        imgUrl: goods.logo,
        price: goods.direct_supply_price,
        selectionSize: selectionSize,
        spuId: goods.gspu_id,
        scId: goods.sc_id
      }
      this.goodsDetailAjax(goods.gspu_id, ()=>{
        this.goodsDetail.spec_group.forEach((item, index) => {
          item.spec_value = item.spec_value.split(',')
          item.spec_value.forEach((value, j) => {
            if (value===goods.specVOList[index].gspec_value) {
              item.checked = j
            }
          })
        })

        this.specList = this.goodsDetail.spec_group
        this.$refs.selectSize.show()
      })
    },
    // 公共数量加
    add(goods) {
      if (goods.goods_num>=goods.storage_num) {
        this.$notify({
          content: '库存不足',
          bottom: 3.2
        })
        return
      }
      goods.goods_num++
      let params = {
        scId: goods.sc_id,
        gskuId: goods.gsku_id,
        num: goods.goods_num
      }
      this.updateCountAjax(params, this.countCallback)
    },
    // 公共数量减
    minus(goods) {
      if (goods.goods_num<=1) {
        return
      }
      goods.goods_num--
      let params = {
        scId: goods.sc_id,
        gskuId: goods.gsku_id,
        num: goods.goods_num
      }
      this.updateCountAjax(params, this.countCallback)
    }
  }
}
