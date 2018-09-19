<template lang="pug">
  .specChangeBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close", @touchmove.prevent="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-show="show").mescroll#specChange
        .content
          .topData
            .topImg
              img(:src="spcGoodsData.logo | img-filter")
            .topText
              .price {{spcGoodsData.direct_supply_price | price-filter}}
                span(@click="close") X
              .selectedSpec {{selectedSpecShow}}
              .haveGoods {{spcGoodsData.storage_num>0 ? '有货' : '无货'}}
          ul.specList
            li.specItem(v-for="(i,specIndex) in spec")
              .valueName {{i.specName}}
              ul.valueList
                li(@click="i.valueIndex=index;specClick(specIndex,index)", v-for="(item,index) in i.specValue", :key="index", :class="{checked:i.valueIndex === index}") {{item.value}}
                p.clearBoth
          .emitGoods
            .emitGoodsTitle 配送方式
            ul.emitGoodsButtons
              li(:class="{checked:emitType === 'express'}", @click="openSelectLocation('express')") 快递配送
              li(:class="{checked:emitType === 'counter'}", @click="openSelectLocation('counter')") 专柜自提
              p.clearBoth
          .address
            .expressAddress(@click="openSelectLocation", v-if="emitType === 'express'")
              .text
                img(src="../../../assets/img/location.png")
                span {{location.province.name}}
                span {{location.city.name}}
              img.more(src="../../../assets/img/more.png")
            .selfAddress(@click="openStoreSelect", v-if="emitType === 'counter'")
              .text
                img(src="../../../assets/img/location.png")
                span {{counterText}}
              img.more(src="../../../assets/img/more.png")
          .bottomButton
            .confirm(@click="submit", v-if="kucunF") 确定
            .reachGoods(v-else, @click="reachInform") 到货通知
          .notice(v-show="noticeFlag")
            div 如果30天内到货，会通过系统消息提醒您
    location-select(:show="locationFlag", :origin="'goodsDetailed'", :location="locationList", @close="locationSelectClose", @selected="locationChange")
    city-select(:show="selectCity", @close="closeSelectCity", @change="cityChange", :type="disTypeName")
    // location-select(:show="locationFlag", :origin="'confirm'", :location="locationList", @close="locationSelectClose", @selected="locationChange")
    onlyStoreSelect(:show="onlyStoreSelect", @close="onlyStoreSelect = false", @change="storeChange")
</template>

<script>
  import {bus} from '../../../bus'
  import {mapState} from 'vuex'
  import locationSelect from '../../goods/src/locationSelect'
  import onlyStoreSelect from '../../goods/src/onlyStoreSelect'
  import citySelect from '../../goods/src/citySelect'
  export default {
    name: "specChange",
    data() {
      return {
        goodsSkuId: '',
        noticeFlag: '',
        kucunF: '',
        spcGoodsData: {},
        logo: '',
        spuId: '',
        skuId: '',
        storeId: '',
        spec: [],
        show: false,
        emitType: 'express',
        counterText: '请选择门店',
        normalGoods: false,
        storeDownGoods: false,
        locationFlag: false,
        locationList: [],
        onlyStoreSelect: false,
        selectCity: false
      }
    },
    watch: {
      show(val) {
        if (val) {
          // mescroll初始化
          this.$mescrollInt("specChange", this.upCallback)
          // this.mescroll.lockDownScroll( true )
          setTimeout(()=>{
            this.mescroll.lockDownScroll( true )
            this.mescroll.endUpScroll(false)
          },200)

          // this.$parent.$parent.mescroll.lockDownScroll( true )
          /*if (this.$route.path === '/shoppingCart/express') {
            this.expressUpData()
          } else {
            this.selfCarryUpData()
          }*/
          this.$parent.$parent.settlementShow = false
          this.$parent.$parent.mescroll.destroy();
        } else {
          this.mescroll.hideTopBtn();
          this.mescroll.destroy();
          this.$parent.$parent.settlementShow = true
          this.$parent.$parent.mescrollInt()
        }
      }
    },
    computed:{
      selectedSpecShow () {
        let spec = ''
        this.spec.forEach((now)=>{
          if (now.valueIndex > -1) {
            let val = now.specValue[now.valueIndex].value
            spec += val + ' '
          }
        })
        return spec
      },
      ...mapState(['location','giveGoodsAddress'])
    },
    components:{locationSelect, onlyStoreSelect, citySelect},
    mounted() {
    },
    methods: {
      // 到货通知
      reachInform(){
        console.log(this.goodsSkuId)
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'ucMessage/saveReachGoodsMessageInfo',
          params: {
            gsku_id: self.goodsSkuId
          }
        }).then(function (res) {
          console.log(res)
          if (res.data.code === '081') {
            self.noticeFlag = true
            let t = 2
            let timer = setInterval(function () {
              t--
              if (t==0) {
                self.noticeFlag = false
                self.submit('reach')
              }
            },1000)
          }
        })
      },
      init (id, spec) {
        this.spuId = id
        this.getSpec(id, spec)
        if (spec.storage_num > 0) {
          return this.kucunF = true
        }
        this.kucunF = false
        this.goodsSkuId = spec.gsku_id
      },
      upCallback: function (page) {
        let self = this;
        self.mescroll.endSuccess(1)
      },
      close() {
        this.show = false
      },
      // 其他城市选择后
      cityChange (data) {
        this.$store.commit('getLocation',data)
        this.selectCity = false
        this.locationFlag = false
      },
      // 关闭选择其他城市
      selectCityOpen(){
        this.selectCity = true
      },
      // 点击spec
      specClick () {
        // 获取选中的规格
        let specData = {
          //'W5MALLTOKEN': localStorage.getItem('token'),
          'cityId': this.$store.state.location.city.id,
          'gspu_id': this.spuId,
          'specList': [
          ]
        }
        this.spec.forEach((now)=>{
          if (now.valueIndex > -1) {
            let val = now.specValue[now.valueIndex].value
            specData.specList.push({
              'gspec_name': now.specName,
              'gspec_value': val
            })
          }
        })
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/sku/detail',
          params: {
            gc:JSON.stringify(specData)
          }
        }).then(function (response) {
          // 将sku图片存入store
          self.$store.commit('skuImgSave', response.data.data.logo)
          if (response.data.data.logo) {
            // 根据sku切换展示图片
            self.logo = response.data.data.logo
          }
          self.skuId = response.data.data.gsku_id
          self.spcGoodsData.direct_supply_price = response.data.data.direct_supply_price
          self.spcGoodsData.storage_num = response.data.data.storage_num
          /*// 派发此组件load事件 (用于返回库存与规格)
          let data = {
            maxStoreNum: self.realGoodsData.storage_num,
            spec: specData.specList,
            counter_price: self.realGoodsData.counter_price ? self.realGoodsData.counter_price : 0,
            retail_price: self.realGoodsData.retail_price ? self.realGoodsData.retail_price : 0,
            direct_supply_price: self.realGoodsData.direct_supply_price ? self.realGoodsData.direct_supply_price : 0,
            goi_freight: self.realGoodsData.goi_freight
          }
          self.$emit('load',data)
          self.selectedSpec = data.spec
          console.log(self.selectedSpec)*/
          if (self.spcGoodsData.storage_num > 0) {
            return self.kucunF = true
          }
          self.kucunF = false
          self.goodsSkuId = response.data.data.gsku_id
        })
      },
      // 改造格式
      specGray (spec, graySpec, checkedSpec) {
        // 改造原有数据格式
        spec.forEach((now)=>{
          now.specValue.forEach((sonNow,index)=>{
            now.specValue[index] = {
              value: sonNow,
              gray: false
            }
          })
        })
        // 返回新的数据
        return spec
      },
      // 将传入数组按当前已选规格进行选入，并返回改动后数据
      returnSelectedJson (oldData, allData) {
        // 储存skuid
        this.skuId = allData.gsku_id

        this.spcGoodsData = allData
        console.log(allData)
        // 默认选
        let specValueList = []
        allData.specVOList.forEach((now)=>{
          specValueList.push(now.gspec_value)
        })

        oldData.forEach((now)=>{
          now.specValue.forEach((sonNow, sonIndex)=>{
            if (specValueList.includes(sonNow.value)) {
              now.valueIndex = sonIndex
            }
          })
        })
        return oldData
      },
      // 获取规格
      getSpec (id, spec) {
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/spu/spec',
          params: {
            gspuId: id
          }
        }).then(function (response) {
          // 改造格式
          let newData = self.specGray(response.data.data)
          // 选中默认
          newData = self.returnSelectedJson(newData, spec)

          self.spec = newData
        })
      },
      submit (reach) {
        let type
        if (this.emitType === 'express') {
          type = 167
        } else {
          if (!this.storeId) {
            this.$message.warning('请选择门店')
            return
          }
          type = 168
        }
        let self = this
        this.$ajax({
          method: 'post',
          url: self.$apiApp + 'shoppingCart/updateShoppingCart',
          params: {
            scId: self.spcGoodsData.sc_id,
            gskuId: self.skuId,
            provinceNo: self.$store.state.location.province.id,
            cityNo: self.$store.state.location.city.id,
            deliveryWays: type,
            bsId: self.storeId
          }
        }).then(function (response) {
          self.close()
          self.$parent.getData()
          self.$parent.$parent.getGoodsNum()
          if (reach === 'reach') {
            return
          }
          self.$message.success('修改成功')
        })
      },

      // 打开地址选择
      openSelectLocation (type) {
        this.emitType = type
        if (this.emitType === 'counter') {
          this.onlyStoreSelect = true
        } else {
          this.locationFlag = true
          let self = this
          this.$ajax({
            method: 'get',
            url: self.$apiMember + 'receivingAddress/addresses',
            params: {
              cityNo: self.$store.state.location.city.id
            }
          }).then(function (response) {
            if (response.data.data.length>0) {
              self.locationList = response.data.data
            }
          })
        }
      },
      // 关闭选择
      locationSelectClose () {
        this.locationFlag = false
      },
      // 打开门店选择
      openStoreSelect () {
        this.$store.commit('getSkuId',this.skuId)
        this.onlyStoreSelect = true
      },
      getStoreLocation () {
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
                let {
                  city_name,
                  county_name,
                  province_name,
                  ra_city,
                  ra_county,
                  ra_province
                } = now
                let location = {
                  province: {
                    name: province_name,
                    id: ra_province
                  },
                  city: {
                    name: city_name,
                    id: ra_city
                  },
                  area: {
                    name: county_name,
                    id: ra_county
                  }
                }
                self.$store.commit('getLocation', location)
                // 延时赋值收货地址，防止选择城市处同时监听到两个变化
                setTimeout(() => {
                  self.$store.commit('giveGoodsAddressChange', now)
                }, 500)
                self.$emit('selected')
              }
            })
          }
        })
      },
      // 选择地址变化后
      locationChange (data) {
        console.log(data)
      },
      // 选择门店变化后
      storeChange (data) {
        this.storeId = data.id
        this.counterText = data.name
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .notice{
    position: fixed;
    width: 100%;
    bottom: 3.02rem;
  }
  .notice div{
    width: 8.8rem;
    height: .93rem;
    border-radius: .9rem;
    margin: 0 auto;
    text-align: center;
    line-height: .93rem;
    background-color: rgba(0,0,0,.6);
    color: #fff;
    font-size: .4rem;
  }
  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }

  .main {
    background-color: white;
    width: 100%;
    height: 70%;
    position: fixed;
    bottom: 0;
    padding-bottom: $height-footer;
    left: 0;
    z-index: 101;
    overflow: auto;
  }
  .content{
    position: relative;
  }
  .clearBoth{
    clear: both;
  }
  /* 商品概要 */
  .topData {
    border-bottom: solid 1px #eee
    padding: .2rem
    display: flex
  }
  .topImg{
    width:2rem;
    height:2rem
    border:solid 1px #eee
  }
  .topImg img {
    width 100%
    height 100%
  }
  .topText{
    width 0
    flex-grow 1
    display flex
    flex-direction column
    justify-content space-between
    padding-left .2rem
  }
  .price {
    color #F70057
    font-size .6rem
    display flex
    justify-content space-between
  }
  .price span{
    color #666
    font-size .4rem
  }
  .selectedSpec{
    color #666
    font-size .3rem
  }
  .haveGoods {
    font-size .35rem
    font-weight 600
  }
  /* 规格 */
  .specList {
    padding: 0 .2rem;
  }
  .specItem {
    padding: .2rem 0;
    border-bottom: solid 1px #eee
  }
  .valueName {
    font-size: .4rem;
    font-weight: 600;
    margin-bottom: .2rem;
  }
  .valueList {

  }
  .valueList>li{
    float: left;
    margin-right: .2rem;
    margin-bottom: .2rem;
    padding: .1rem .3rem;
    border: solid 1px #333;
    color: #333;
    border-radius: .1rem;
  }
  /* 切换配送 */
  .emitGoods {
    margin-top: .4rem;
    padding: 0 .2rem;
  }
  .emitGoodsTitle {
    font-weight: 600;
    font-size: .4rem;
    margin-bottom: .2rem;
  }
  .emitGoodsButtons{

  }
  .emitGoodsButtons li{
    float: left;
    margin-right: .2rem;
    padding: .1rem .3rem;
    border: solid 1px #333;
    color: #333;
    border-radius: .1rem;
  }
  /* 地址 */
  .address {
    padding: .2rem;
    margin-top: .2rem
  }
  .address>div{
    display: flex;
    justify-content: space-between;
    background-color:#eee;
    padding: .1rem .2rem;
  }
  .address img{
    height: .4rem
  }
  .address .text{
    display flex
    align-items center
  }
  .address .text>span{
    margin-left .2rem
  }
  /* 选中状态 */
  .checked{
    border: solid 1px #F70057 !important;
    color: #F70057 !important;
  }
  /* 底部按钮 */
  .bottomButton {
    position fixed
    bottom $height-footer
    left 0
    width 100%
    height 1.2rem
    background-color white
  }
  .confirm,
  .reachGoods{
    background-color #F70057
    color white
    width 100%
    height 100%
    display flex
    align-items center
    justify-content center
    font-size .4rem
  }
</style>
