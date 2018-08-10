<template lang="pug">
  .selectSizeBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      //.main(v-show="show", @touchstart="touchStart", @touchmove="touchMove").mescroll#selectSize
      .main(v-show="show")#selectSize
        .selectSizeHeader
          .photosBox()
            ul.photos(:style="{width:5 * list.length + 'rem'}", :class="{smallPhoto:smallPhotoFlag}")
              li(v-for="(item,index) in list")
                img(:src="item.gi_img_url | img-filter", v-if="index===0")
          .goodsData(:class="{smallGoodsData:smallPhotoFlag}" v-if="userData.member_type !== '092'")
            .price(v-if="$parent.initPriceFlag") {{$parent.goodsData.direct_supply_price | price-filter}}
            .price(v-else) {{realGoodsData.direct_supply_price| price-filter}}
            .store(v-if="$parent.initPriceFlag") 有货
            .store(v-else) {{realGoodsData.storage_num>0?'有货':'无货'}}
            .size
              span(v-if="selectedSpec.length === 0") 选择规格
              span(v-if="selectedSpec.length > 0")(v-for="spec in selectedSpec", style="margin-right:.2rem") {{spec.gspec_value}}
          .goodsData(:class="{smallGoodsData:smallPhotoFlag}" v-else)
            .price(v-if="realGoodsData.storage_num>0") {{realGoodsData.direct_supply_price | price-filter}}
            .price(v-else) {{0 | price-filter}}
            .store 库存{{realGoodsData.storage_num}}
            .size 选择 颜色 尺寸
          .headerClose(@click="close")
            img(src="../../../assets/img/Group10@2x.png")
        .selectSizeContent(ref="selstSizeScroll")
          div(style="padding-bottom: .8rem;")
            ul.spec
              li(v-for="(item,fatherIndex) in spec")
                .title {{item.specName}}
                ul.content
                  li(v-for="(i,index) in item.specValue", :class="{specChecked:item.valueIndex === index,disableSelect:i.gray}", @click="!i.gray?item.valueIndex=index:'';getStoreNum($event,i.value, fatherIndex,i.gray,item.valueIndex,index)") {{i.value}}
                  p(style="clear:both")
            .count
              span 购买数量
              w-counter(v-model="content", :min="1", :max="realGoodsData.storage_num", :width="'100px'")
            .express
              h1 配送方式
              .buttonTab
                button(@click="changeExpress('快递配送')", :class="{checked:expressType === '快递配送'}") 快递配送
                button(@click="changeExpress('专柜自提')", v-if="carryType===1", :class="{checked:expressType === '专柜自提',lockNoChecked:lock}") 专柜提货
            .address
              h1
                span {{expressType === '专柜自提' ? '专柜' : '配送'}}地址
                span ({{expressType === '专柜自提' ? '提货' : '配送'}}地址影响库存，请正确选择)
              p(@click="changeLocation")
                span(v-if="expressType === '专柜自提'")
                  img(src="../../../assets/img/location.png")
                  i(v-if="transfer.store") {{transfer.store.name}}
                  i(v-else) 请选择商品规格与配送方式
                span(v-if="locationOrAddress !== 'location' && expressType !== '专柜自提'")
                  img(src="../../../assets/img/location.png")
                  i(v-if="giveGoodsAddress.city_name") {{giveGoodsAddress.city_name}}{{giveGoodsAddress.county_name}} {{giveGoodsAddress.ra_detailed_addr}}
                  i(v-else) 请选择地址
                span(v-if="locationOrAddress === 'location' && expressType !== '专柜自提'")
                  img(src="../../../assets/img/location.png")
                  i(v-if="location.city.name") {{location.province.name}} {{location.city.name}}
                  i(v-else) 请选择地址
                img(src="../../../assets/img/more@2x.png")
            .freight(v-show="expressType=='快递配送'")
              .freightDesc 运费
              .freightPrice {{freightPrice}}元
        .bottomButton(v-if="onlySelectSpec")
          .left(v-if="noGoodsL", @click="goBuy") 立即购买
          .right(v-if="noGoodsL", @click="addCart") 加入购物车
          .right2(v-if="noGoodsE", @click="reachInform()") 到货通知
        .bottomButton(v-else)
          .right(v-if="noGoodsL",@click="confirm") 确定
          .right2(v-if="noGoodsE", @click="reachInform()") 到货通知
        .notice(v-if="noticeFlag") 如果30天内到货，会通过系统消息提醒您
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  import BScroll from 'better-scroll'
  export default {
    name: "city-select",
    data () {
      return {
        noGoodsE: false,
        noGoodsL: true,
        skuIds: '',
        noticeFlag: '',
        // skuId: '',
        startY: '',
        moveY: '',
        smallPhotoFlag: true,
        content: 1,
        realGoodsData: {},
        selectedSpec: [],
        // 当前该显示的地址信息
        locationOrAddress: 'location',
        freightPrice: 0 //运费
      }
    },
    props: {
      photos: Array,
      spec: Array,
      graySpecData: Array,
      // 配送类型
      expressType:{
        type: String,
        default: '专柜自提'
      },
      onlySelectSpec: {
        type: Boolean,
        default: false
      },
      show: {
        type: Boolean,
        default: false
      },
      lock: {
        type: Boolean,
        default: true
      },
      carryType: {
        type: Number,
        default: 0
      }
    },
    computed:{
      list(){
        //   // 深度拷贝
        // let obj={};
        // obj=JSON.parse(JSON.stringify(this.photos))
        return this.photos.slice()

      },
      // 定位地址城市名称
      locationCityName() {
        return this.location.city.name
      },
      // 收货地址城市名称
      addressCityName() {
        return this.giveGoodsAddress.city_name
      },
      ...mapState(['userData','giveGoodsAddress','location', 'skuId']),
      ...mapGetters(['transfer'])
    },
    watch:{
      spec (newSpec) {
        if (newSpec) {
          setTimeout(() => {
            if (this.selstSizeScroll) {
              this.selstSizeScroll.refresh()
            } else {
              this.selstSizeScroll = new BScroll(this.$refs.selstSizeScroll, {
                click: true
              })
            }
          },20)
        }
      },
      skuId () {
        this.getFreight()
      },
      content () {
        this.getFreight()
      },
      // 若定位城市变化，则显示定位相关地址信息
      locationCityName() {
        this.locationOrAddress = 'location'
      },
      // 若定用户地址市变化，则显示用户地址相关地址信息
      addressCityName() {
        this.locationOrAddress = 'address'
      },
      show(e){
        if (e) {
          this.getFreight()
          setTimeout(() => {
            if (this.selstSizeScroll) {
              this.selstSizeScroll.refresh()
            } else {
              this.selstSizeScroll = new BScroll(this.$refs.selstSizeScroll, {
                click: true
              })
            }
          },20)
          // mescroll初始化
        //   this.getLocation()
        //   this.$mescrollInt("selectSize",this.upCallback)
        //   this.mescroll.setBounce(false)
        //   setTimeout(()=>{
        //     this.mescroll.hideUpScroll()
        //   },500)
        //   this.mescroll.lockDownScroll(true)
        // } else {
        //   this.mescroll.hideTopBtn();
        //   this.mescroll.destroy()
        }
      }
    },
    mounted () {
      this.getStoreNum()
      setTimeout(() => {
        if (this.selstSizeScroll) {
          this.selstSizeScroll.refresh()
        } else {
          this.selstSizeScroll = new BScroll(this.$refs.selstSizeScroll, {
            click: true
          })
        }
      },20)
      this.getFreight()
    },
    methods:{
      reachInform(){
        console.log(this.skuIds)
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'ucMessage/saveReachGoodsMessageInfo',
          params: {
            gsku_id: self.skuIds
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
                self.$emit('reachgoods')
              }
            },1000)
          }
        })
      },
      // 获取运费
      getFreight () {
        let self = this
        if (this.skuId) {
          this.$ajax({
            method: 'get',
            url: self.$apiGoods + 'freight/api/getFreightByType',
            params: {
              skuId: this.skuId,
              count: this.content,
              cityNo: this.$store.state.location.city.id
            }
          }).then(function (response) {
              if (response) {
                self.freightPrice = response.data.data.freight
              }
          })
        }
      },
      // 立即购买
      goBuy () {
        this.$parent.ofBuy = true
        this.$parent.shoppingCartFlag = false
        this.confirm()
      },
      // 加入购物车
      addCart () {
        this.$parent.ofBuy = false
        this.$parent.shoppingCartFlag = true
        this.close()
        this.confirm()
      },
      isGray (e, index) {

      },
      upCallback: function(page) {
        let self = this;
        self.mescroll.endSuccess(1)
      },
      getLocation () {
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
      // 更改配送方式
      changeExpress (data) {
        //若所有层级都选择了规格则继续
        let flag = 0
        this.spec.forEach((now)=>{
          if (now.valueIndex === -1) {
            flag+=1
          }
        })
        if (flag>0) {
          this.$parent.initPriceFlag = true
          this.$message.warning('请选择规格')
          return
        }
        this.$parent.disTypeName = data
        // 触发选择配送方式组件
        if(data==='专柜自提'&& !this.lock){
          this.$parent.selectDis(0)
        } else {
          this.$parent.selectDis(1)
        }
      },
      // 更改地址
      changeLocation () {
        //若所有层级都选择了规格则继续
        let flag = 0
        this.spec.forEach((now)=>{
          if (now.valueIndex === -1) {
            flag+=1
          }
        })
        if (flag>0) {
          this.$parent.initPriceFlag = true
          this.$message.warning('请选择规格')
          return
        }
        this.$parent.selectCityShow()
      },
      notScroll (e) {
        e.preventDefault()
      },
      close () {
        this.$emit('close')
      },
      confirm () {
        //若所有层级都选择了规格则继续
        let flag = 0
        this.spec.forEach((now)=>{
          if (now.valueIndex === -1) {
            flag+=1
          }
        })
        if (flag>0) {
          this.$parent.initPriceFlag = true
          this.$message.warning('请选择规格')
          return
        }
        let data = {
          price: this.realGoodsData.counter_price,
          content: this.content,
          spec: []
        }
        this.spec.forEach((now)=>{
          data.spec.push({
            gspec_name: now.specName,
            gspec_value: now.specValue[now.valueIndex].value
          })
        })

        if (this.realGoodsData.storage_num>0 && this.realGoodsData.storage_num >= this.content) {
          this.$emit('confirm', data)
        } else {
          this.$message.error('商品库存不足')
        }
      },
      /*removeTouchDisable () {
        this.$emit('buy')
      },*/
      // 校验库存与获得skuId（此请求每次挂载后都会执行）
      getStoreNum (e,key,index, disable) {
        let date = new Date()
        // 为置灰直接弹出，没有操作
        if (disable) {
          return
        }
        // 是否在回调后进行sku价格显示
        let initPriceFlag = false
        // 若无传参则为初始化
        if (!key && !index) {
          let allRelSpec = []
          this.graySpecData.forEach((now)=>{
            allRelSpec = allRelSpec.concat(now)
          })
          this.spec.forEach((now, specIndex) => {
            now.specValue.forEach((sonNow, sonIndex) => {
              if (!allRelSpec.includes(sonNow.value)) {
                this.spec[specIndex].specValue[sonIndex].gray = true
                /*Object.defineProperty(this.spec[specIndex].specValue[sonIndex],'gray',{
                  value: true
                })*/
              }
            })
          })

          if (this.$store.state.informGoods) {
            this.$store.commit('setInformGoods', null)
            // 获取选中的规格
            let specData = {
              'cityId': this.$store.state.location.city.id,
              'gspu_id': this.$route.query.id,
              'specList': [
              ]
            }
            this.spec.forEach((now)=>{
              let val = now.specValue[now.valueIndex].value
              specData.specList.push({
                'gspec_name': now.specName,
                'gspec_value': val
              })
            })
            let self = this
            this.$ajax({
              method: 'post',
              url: self.$apiGoods + 'goods/sku/detail',
              params: {
                gc:JSON.stringify(specData)
              }
            }).then(function (response) {
              // 显示真实sku价格，隐藏spu返回的最低价
              self.$parent.initPriceFlag = false
              // 将sku图片存入store
              self.$store.commit('skuImgSave', response.data.data.logo)
              // 根据sku切换展示图片
              let skuGoodsData = self.list[0]
              skuGoodsData.gi_img_url = response.data.data.logo
              self.list.splice(0,1,skuGoodsData)
              self.realGoodsData = response.data.data
              if (self.realGoodsData.storage_num<=0) {
                self.noGoodsL = false
                self.noGoodsE = true
              } else{
                self.noGoodsL = true
                self.noGoodsE = false
              }
              self.skuIds = response.data.data.gsku_id
              // vuex中保存skuId
              self.$store.commit('getSkuId',response.data.data.gsku_id)
              // 派发此组件load事件 (用于返回库存与规格)
              let data = {
                maxStoreNum: self.realGoodsData.storage_num,
                spec: specData.specList,
                counter_price: self.realGoodsData.counter_price ? self.realGoodsData.counter_price : 0,
                retail_price: self.realGoodsData.retail_price ? self.realGoodsData.retail_price : 0,
                direct_supply_price: self.realGoodsData.direct_supply_price ? self.realGoodsData.direct_supply_price : 0,
                goi_freight: self.realGoodsData.goi_freight
              }
              self.$emit('load',data)

            })

          }
        } else {
        // 若无则正常
          // 若已经选择，则进行反选
          if (e.target.className === 'specChecked') {
            this.spec[index].valueIndex = -1
            // 能与反选列能组成可选规格的规格全部可选
            let reverseSpec = []  // 反选规格的整行集合
            let reverseSpecRel = [] // 由反选集合所筛选出的可选集合
            this.spec[index].specValue.forEach((now)=>{
              reverseSpec.push(now.value)
            })
            reverseSpec.forEach((now)=>{
              this.graySpecData.forEach((sonNow)=>{
                if(sonNow.includes(now) && !reverseSpecRel.includes(sonNow)){
                  reverseSpecRel = reverseSpecRel.concat(sonNow)
                }
              })
            })
            // 去重
            let newReverseSpecRel = []
            reverseSpecRel.forEach((now)=>{
              if(newReverseSpecRel.indexOf(now) === -1) {
                newReverseSpecRel.push(now)
              }
            })
            reverseSpecRel = newReverseSpecRel
            // 将该恢复的规格恢复
            this.spec.forEach((now, index)=>{
              now.specValue.forEach((sonNow, sonIndex)=>{
                if (reverseSpecRel.includes(sonNow.value)) {
                  //Object.defineProperty(this.spec[index].specValue[sonIndex],'gray',{
                    //value: false,
                    //writable: true
                  //})
                  //delete this.spec[index].specValue[sonIndex].gray

                  this.spec[index].specValue[sonIndex].gray = false


                }
              })
            })
            return
            // console.log(reverseSpecRel)
          }


          // 获取同级规格
          let selectedLevel = []
          this.spec[index].specValue.forEach((now)=>{
            if (now.value !== key) {
              selectedLevel.push(now.value)
            }
          })
          // 如果同级规格跟任何规格都无法组成存在规格，那么置灰
          let noGray = []  // 不该置灰的集合
          selectedLevel.forEach((now)=>{
            this.graySpecData.forEach((sonNow)=>{
              if (sonNow.includes(now) && !noGray.includes(now)) {
                noGray.push(now)
              }
            })
          })
          // 全部同级规格与不该置灰集合差集为该置灰的同级规格
          let grayLevelSpec = selectedLevel.filter(key => !noGray.includes(key))
          // 将全部需要置灰的同级置灰(封装成一个方法，方便之后调用)
          let specGrayFun = (grayArray,notGrayFlag) => {
            this.spec.forEach((now,index)=>{
              now.specValue.forEach((sonNow,sonIndex)=>{
                if (grayArray.includes(sonNow.value)) {
                  /*Object.defineProperty(this.spec[index].specValue[sonIndex],'gray',{
                    value: true
                  })*/
                  this.spec[index].specValue[sonIndex].gray = true
                } else {
                  // 如果来自不同级规格操作，并且规格不属于当前点击的同级规格，才可取消置灰
                  if (notGrayFlag) {
                    if (!selectedLevel.includes(this.spec[index].specValue[sonIndex].value)) {
                      /*Object.defineProperty(this.spec[index].specValue[sonIndex],'gray',{
                        value: false
                      })*/
                      this.spec[index].specValue[sonIndex].gray = false
                    }
                  }
                }
              })
            })
          }
          specGrayFun(grayLevelSpec) //置灰


          // 获取不同级规格
          let selectedNotLevel = []
          this.spec.forEach((now,specIndex)=>{
            if (specIndex !== index) {
              now.specValue.forEach((sonNow)=>{
                selectedNotLevel.push(sonNow.value)
              })
            }
          })

          // 获取包含已选同级规格的存在组合
          let relSpecHasSelected = []
          this.graySpecData.forEach((now)=>{
            if (now.includes(key)) {
              relSpecHasSelected = relSpecHasSelected.concat(now)
            }
          })
          // 不同级,该置灰的规格集合
          let selectedNotLevelGary = []
          selectedNotLevel.forEach((now)=>{
            if (!relSpecHasSelected.includes(now) && !selectedNotLevelGary.includes(now)) {
              selectedNotLevelGary.push(now)
            }
          })
          // 不同级进行置灰
          specGrayFun(selectedNotLevelGary,true)

          //若所有层级都选择了规格则继续
          let flag = 0
          this.spec.forEach((now)=>{
            if (now.valueIndex === -1) {
              flag+=1
            }
          })
          if (flag>0) {
            this.$parent.initPriceFlag = true
            return
          }
          initPriceFlag = true
          // 隐藏掉商品详情拿到的最低价格，显示规格的
        }








        if (key) {
          // 选中的key组成数组
          let selectedKey = []
          this.spec.forEach((now)=>{
            if (now.valueIndex !== -1) {
              selectedKey.push(now.specValue[now.valueIndex].value)
            }
          })
          // 改变父组件对应绑定的规格数据
          // this.$parent.spec = this.$parent.specGray(this.spec,this.graySpecData,selectedKey)
        }
        // 获取选中的规格
        let specData = {
          //'W5MALLTOKEN': localStorage.getItem('token'),
          'cityId': this.$store.state.location.city.id,
          'gspu_id': this.$route.query.id,
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
          // 显示真实sku价格，隐藏spu返回的最低价
          if (initPriceFlag) {
            self.$parent.initPriceFlag = false
          }
          // 将sku图片存入store
          self.$store.commit('skuImgSave', response.data.data.logo)
          if (response.data.data.logo) {
            // 根据sku切换展示图片
            let skuGoodsData = self.list[0]
            skuGoodsData.gi_img_url = response.data.data.logo
            self.list.splice(0,1,skuGoodsData)
          }
          self.realGoodsData = response.data.data
          if (self.realGoodsData.storage_num<=0) {
            self.noGoods = false
          } else{
            self.noGoods = true
          }
          self.skuIds = response.data.data.gsku_id
          // vuex中保存skuId
          self.$store.commit('getSkuId',response.data.data.gsku_id)
          // 派发此组件load事件 (用于返回库存与规格)
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
          console.log(self.selectedSpec)

        })
      },
      buy () {
        // 判断用户类型，小B显示直供价，小C显示专柜价
        let price = 0
        if (this.userData.member_type !== '092') {
          price = this.realGoodsData.counter_price
        } else {
          price = this.realGoodsData.direct_supply_price
        }
        // 将数量与价格传过去
        let data = {
          price: price,
          content: this.content,
          spec: []
        }
        this.spec.forEach((now)=>{
          data.spec.push({
            gspec_name: now.specName,
            gspec_value: now.specValue[now.valueIndex]
          })
        })
        if (this.realGoodsData.storage_num>0 && this.realGoodsData.storage_num >= this.content) {
          // 此条为了恢复屏幕触摸事件
          this.$emit('buy', data)
        } else {
          this.$message.error('商品库存不足')
        }

      },
      // 触摸开始
      touchStart (e) {
        this.startY = e.targetTouches[0].clientY
      },
      // 滑动中
      touchMove (e) {
        this.moveY = e.targetTouches[0].clientY
        // 滑动距离超过100 执行样式变换
        if ( this.startY -this.moveY > 70) {
          this.smallPhotoFlag = true
          this.list.splice(1,this.list.length-1)
        }
        if (this.moveY - this.startY > 70) {
          this.smallPhotoFlag = false
          let obj={};
          obj=JSON.parse(JSON.stringify(this.photos))
          obj.forEach((now,index)=>{
            if (index!==0) {
              this.list.push(now)
            }
          })
        }
      }
    }
  }
</script>

<style scoped>
  .notice{
    position: fixed;
    width: 100%;
    bottom: 1.29rem;
    background-color: rgba(0,0,0,.3);
    color: #fff;
    text-align: center;
  }
  .selectSizeBox {
  }

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
    /*padding-top: .2rem;*/
    /*padding-bottom: 1.5rem;*/
    background-color: white;
    width: 100%;
    height: 10rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
    /*overflow-y: auto;*/
  }
  .bottomButton {
    position: fixed;
    z-index: 102;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1.2rem;
    display: flex;
    border: solid 1px rgb(244,0,87);
  }
  .bottomButton div{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bottomButton .left{
    flex-grow: 1;
    height: 100%;
    font-size: .4rem;
    color: white;
    background-color: #FF8500;
  }
  .bottomButton .right{
    flex-grow: 1;
    height: 100%;
    background: rgb(244,0,87);
    font-size: .4rem;
    color: white;
  }
  .bottomButton .right2{
    flex-grow: 1;
    height: 100%;
    background: rgb(244,0,87);
    font-size: .4rem;
    color: white;
  }
  /* 商品图片部分 */
  .photosBox {
    width: 3.28rem;
    height: 3.28rem;
    overflow: hidden;
    position: absolute;
    left: .26rem;
    bottom: .26rem;
  }
  .photosBox .photos{
    display: flex;
    justify-content: space-around;
    min-width: 100% !important;
  }
  /* 缩小后样式 */
  .smallPhoto {
    justify-content: flex-start !important;
    /*padding-left: .2rem;*/
  }
  .smallPhoto li{
    height: 3.28rem !important;
    width: 3.28rem !important;
  }
  .photos li{
    /*transition: width .3s, height .3s;*/
    /*height: 5rem;*/
    /*width: 5rem;*/
    /*border-radius: .3rem;*/
    /*overflow: hidden;*/
  }
  .photos li img {
    width: 100%;
    height: 100%;
    border-radius: .13rem;
  }
  /* 商品数据部分 */
  .goodsData{
    margin-top: .2rem;
    height: 1.6rem;
    left: 50%;
    top:4rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    /*transition: width .2s, left .2s, top .2s;*/
  }
  .goodsData .price{
    font-size: .5rem;
    transition: font-size .5s;
    font-weight: 600;
    color: rgb(246,0,87);
  }
  .goodsData .store{
    color: #aaaaaa;
  }
  .goodsData .size{
     color: #999;
   }
  /* 小商品数据 */
  .smallGoodsData {
    width: 3rem !important;
    height: 2rem !important;
    position: absolute;
    align-items: flex-start;
    left: 4rem;
    top: 0;
  }
  .smallGoodsData .price{
    font-size: .4rem !important;
  }
  /* 规格部分 */
  .spec{
    padding-top: .5rem;
  }
  .spec>li{
    margin-bottom: .4rem;
  }
  .spec>li .title{
    font-size: .4rem;
    padding-left: .4rem;
  }
  .spec .content{
    margin-top: .3rem;
  }
  .spec .content li{
    float: left;
    padding: .2rem .3rem;
    border:  solid 1px #999;
    margin-left: .4rem;
    margin-bottom: .4rem;
    border-radius: .2rem;
    transition: background-color .3s, color .3s;
  }
  /* 规格选中 */
  .specChecked {
    border:  solid 1px #F70057 !important;
    color: #F70057 !important;
  }
  /* 禁止选择 */
  .disableSelect{
    background: #E8E8E8;
    color: white !important;
    border: solid 1px #E8E8E8 !important;
  }
  /* 选择数量部分 */
  .count {
    border-bottom: solid 1px #eee;
    margin-top: .5rem;
    font-size: .4rem;
    padding: .4rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  /* 配送方式 */
  .express {
    margin-top: .4rem;
    padding: 0 .4rem;
  }
  .express>h1{
    font-size: .42rem;
    margin-bottom: .2rem;
  }
  .express .buttonTab{

  }
  .express .buttonTab>button{
    border: solid 1px #ccc;
    background: none;
    color: #888;
    padding: .15rem .4rem;
    border-radius: 5px;
    margin-right: .3rem;
    outline: none;
  }
  .checked {
    color: rgb(246,0,88) !important;
    border: 1px solid rgb(246,0,88)!important;
  }
  .lockNoChecked {
    color: white !important;
    border: none !important;
    background: #E8E8E8 !important;
  }
  /* 配送地址 */
  .address {
    margin-top: .4rem;
    padding: 0 .4rem;
  }
  .address>h1{
    display: flex;
    align-items: flex-end;
    width: 100%;
    font-size: .42rem;
    margin-bottom: .2rem;
  }
  .address>h1 span:last-child{
    font-size: .2rem;
    color: #ccc;
    margin-left: .3rem;
  }
  .address>p{
    border-bottom: solid 1px #eee;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .address span{
    height: 100%;
    display: flex;
    align-items: center;
  }
  .address img:first-child{
    margin-right: .2rem;
  }
  .address img {
    height: .5rem;
  }

  .selectSizeHeader {
    height: 2.88rem;
    position: relative;
    border-bottom:1px solid #eee;
  }
  .selectSizeContent {
    height: 5.92rem;
    overflow: hidden;
  }
  .headerClose {
    position: absolute;
    top: .4rem;
    right: .4rem;
  }
  .headerClose img {
    width: .586rem;
  }
  .freight {
    height: 1rem;
    padding: .26rem 0 0 .4rem;
    display: flex;
  }
  .freightDesc {
    font-size: .42rem;
    color:rgb(51,51,51);
    font-weight: bold;
  }
  .freightPrice {
    margin-left: .3rem;
    font-size:.4rem;
    color:rgb(102,102,102);
  }
</style>
