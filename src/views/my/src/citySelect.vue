<template lang="pug">
  .citySelectBox(@touchmove.prevent="")
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-show="show", @click.stop="close", @touchstart.stop="", @touchend.stop="", @touchmove.stop.prevent ="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-show="show", @touchmove.prevent="")
        .title
          span 配送至
          img(src="../../../assets/img/cancle@3x.png", @click="close")
        .tabBox
          transition-group(enter-active-class="animated bounceInLeft", leave-active-class="animated fadeOut").tab
            li(v-if="selectType > 0 || selectType === 0 ", :class="{selected:selectType === 0}", key="0", @click="tab(0)") {{provinceName}}
            li(v-if="selectType > 1 || selectType === 1 ", :class="{selected:selectType === 1}", key="1", @click="tab(1)") {{cityName}}
            li(v-if="selectType > 2 || selectType === 2 ", :class="{selected:selectType === 2}", key="2", @click="tab(2)") {{areaName}}
          .slider(:style="{marginLeft:3 * selectType + 'rem'}")
        .listWrapper(ref="wrapper1")
          ul.list(@touchmove.prevent="")
            li(v-for="(item, index) in provinceList", @click.stop="getCity(item.pro_no,item.pro_name)", :key="index") {{item.pro_name}}
        .listWrapper(ref="wrapper2", v-if="wrapperShow2")
          ul.list(@touchmove.prevent="")
            li(v-for="(item, index) in cityList", @click.stop="getArea(item.city_no,item.city_name)", :key="index") {{item.city_name}}
        .listWrapper(ref="wrapper3", v-if="wrapperShow3")
          ul.list(@touchmove.prevent="")
            li(v-for="(item, index) in areaList", @click.stop="selectOver(item.district_no,item.district_name)", :key="index") {{item.district_name}}
</template>

<script>
  export default {
    name: "city-select",
    data () {
      return {
        wrapperShow2: false,
        wrapperShow3: false,
        // 当前选择的类型，0为选择省，1为市，2为区
        selectType: 0,
        provinceName: '请选择',
        cityName: '请选择',
        areaName: '请选择',
        // 选中的省编码
        proNumber: '',
        // 选中的市编码
        cityNumber: '',
        // 选中的区编码
        areaNumber: '',
        provinceList: [],
        cityList: [],
        areaList: []
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    mounted () {
      this.getProvince()
    },
    methods:{
      close () {
        this.$emit('close')
      },
      typeClick (type) {
        this.selectType = type
      },
      tab (num) {
        this.selectType = num
        switch (num) {
          case 0:
            this.cityList = []
            this.areaList = []
            break
          case 1:
            this.areaList = []
        }
      },
      getProvince () {
       let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/allProvince',
          params: {
          },
        }).then(function (response) {
          self.provinceList = response.data.data
          self.$nextTick(()=> {
            self.$initScroll(self.$refs.wrapper1)
          })
        })
      },
      getCity (number,proName) {
        this.wrapperShow2 = false
        // 记录选中的省的编码
        this.proNumber = number
        // 清空市与区数据
        this.cityList = []
        this.areaList = []
        // 当前选项卡名称改变
        this.provinceName = proName
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/cityProvince',
          params: {
            pro_no: number
          },
        }).then(function (response) {
          self.cityList = response.data.data
          self.selectType = 1
          self.wrapperShow2 = true
          self.$nextTick(()=>{
            self.$initScroll(self.$refs.wrapper2)
          })

        })
      },
      getArea (number, cityName) {
        this.wrapperShow3 = false
        // 记录选中的市的编码
        this.cityNumber = number
        // 当前选项卡名称改变
        this.cityName = cityName
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/districtCity',
          params: {
            cityNo: number
          },
        }).then(function (response) {
          self.areaList = response.data.data
          self.selectType = 2
          self.wrapperShow3 = true
          self.$nextTick(()=>{
            self.$initScroll(self.$refs.wrapper3)
          })
        })
      },
      selectOver (number, areaName) {
        // 记录选中的区的编码
        this.areaNumber = number
        // 当前选项卡名称改变
        this.areaName = areaName
        // 事件派发，将省市区名字以及编号返回
        let data = {
          pro:{
            number: this.proNumber,
            name: this.provinceName
          },
          city:{
            number: this.cityNumber,
            name: this.cityName
          },
          area:{
            number: this.areaNumber,
            name: this.areaName
          }
        }
        this.$emit('change', data)
      }
    }
  }
</script>

<style scoped>
  .citySelectBox {

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
    background-color: white;
    width: 100%;
    height: 12.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;

  }
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    font-size: .4rem;
    position: relative;
  }
  .title img{
    position: absolute;
    right: .2rem;
    width: .4rem;
  }
  .tab{
    display: flex;
    border-bottom: solid 1px #ccc;
  }
  .tab li{
    width: 3rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: .3rem;
    color: rgb(255,128,171);
  }
  .selected {
    color: rgb(245,0,87) !important ;
  }
  .listWrapper {
    width: 3rem;
    float: left;
    height: 10rem;
    overflow: hidden;
  }
  .list {
    line-height: .8rem;
    text-align: center;
  }

  .item {
    text-align: center;
  }
  .slider {
    height: 1px;
    width: 3rem;
    margin-top: -1px;
    margin-left: 0;
    background: rgb(245,0,87);
    transition: margin-left .6s;
  }
</style>
