<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-show="show", @click="close", @touchmove.prevent="")
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
        <!--ul.list-->
          <!--li(v-for="item in provinceList", @click="getCity(item.pro_no,item.pro_name)") {{item.pro_name}}-->
        <!--ul.list-->
          <!--li(v-for="item in cityList", @click="selectOver(item.city_no,item.city_name)") {{item.city_name}}-->
        ul.list(@touchmove.prevent="", ref="list")
          li(@touchstart="touchStart($event, 1)", @touchmove="touchMove($event, 1)", :style="{top: move.first.top + 'px'}")
            .item(v-for="(item, index) in provinceList", @click.stop="getCity(item.pro_no,item.pro_name)", :key="index", ref="item") {{item.pro_name}}
        ul.list(@touchmove.prevent="")
          li(@touchstart="touchStart($event, 2)", @touchmove="touchMove($event, 2)", :style="{top: move.second.top + 'px'}")
            .item(v-for="(item, index) in cityList", @click.stop="selectOver(item.city_no,item.city_name)", :key="index") {{item.city_name}}

</template>

<script>
  export default {
    name: "city-select",
    data () {
      return {
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
        // 时间戳
        time: 0,
        provinceList: [],
        cityList: [],
        areaList: [],
        move: {
          first: {
            top: 0,
            startY: 0,
            moveY: 0,
            topMin: 0
          },
          second: {
            top: 0,
            startY: 0,
            moveY: 0,
            topMin: 0
          }
        }
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      type: {
        type: String,
        default: ''
      }
    },
    watch: {
      show (val) {
        if (val) {
          this.selectType = 0
          this.provinceList = []
          this.cityList = []
          this.provinceName = '请选择'
        } else {
          this.move.first.topMin = 0
        }
        if (val && this.move.first.topMin===0) {
          this.getProvince().then(()=>{
            this.getMinTop(1)
          })
        }
      }
    },
    mounted () {

    },
    methods:{
      getMinTop (flag) {
        let length = 0
        let index = ''
        switch (flag) {
          case 1: length = this.provinceList.length; index = 'first'; break;
          case 2: length = this.cityList.length; index = 'second';  break;
        }
        let _this = this
        this.$nextTick(() => {
          let itemHeight = _this.$refs.item[0].offsetHeight
          let listHeight = _this.$refs.list.offsetHeight
          let firstHeight = itemHeight * length
          if (firstHeight <= listHeight) {
            _this.move[index].topMin = 0
          } else {
            let temp = firstHeight / listHeight
            let temp1 = (parseInt(temp) - 1) * listHeight
            let temp2 = firstHeight % listHeight
            _this.move[index].topMin = -(temp1 + temp2)
          }
        })

      },
      touchMove (e, flag) {
        let time = new Date().getTime() - this.time
        this.time = new Date().getTime()
        if(e.touches.length == 1) {
          let startY = this.move.first.startY
          let index = ''
          let moveY = e.touches[0].clientY
          let speed = 30
          let range = ((startY - moveY) / time) * speed
          switch (flag) {
            case 1: this.move.first.startY = e.touches[0].clientY; index = 'first'; break;
            case 2: this.move.second.startY = e.touches[0].clientY; index = 'second';  break;
            case 3: this.move.third.startY = e.touches[0].clientY; index = 'third';  break;
          }
          e.preventDefault()
          range = -range
          this.move[index].top += range
          if (this.move[index].top > 0) {
            this.move[index].top = 0
          }

          if (this.move[index].top < this.move[index].topMin) {
            this.move[index].top = this.move[index].topMin
          }
        }

      },
      touchStart (e, flag) {
        if(e.touches.length == 1) {
          switch (flag) {
            case 1: this.move.first.startY = e.touches[0].clientY; break;
            case 2: this.move.second.startY = e.touches[0].clientY; break;
            case 3: this.move.third.startY = e.touches[0].clientY; break;
          }
        }

      },
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
        let fun = new Promise((resolve)=>{
          let self = this
          let data
          let url
          if (this.type === '专柜自提') {
            url = self.$apiGoods + 'store/existProvince'
            data = {
              spuId: self.$route.query.id
            }
          } else {
            url = self.$apiApp + 'index/allProvince'
            data = {

            }
          }
          self.$ajax({
            method: 'get',
            url: url,
            params: data,
          }).then(function (response) {
            self.provinceList = response.data.data
            resolve()
          })
        })
        return fun
      },
      getCity (number,proName) {
        // 记录选中的省的编码
        this.proNumber = number
        // 清空市与区数据
        this.cityList = []
        this.areaList = []
        // 当前选项卡名称改变
        this.provinceName = proName
        let self = this
        let data
        let url
        if (this.type === '专柜自提') {
          url = self.$apiGoods + 'store/existCity'
          data = {
            spuId: self.$route.query.id,
            provinceNo: number
          }
        } else {
          url = self.$apiApp + 'index/cityProvince'
          data = {
            pro_no: number
          }
        }
        self.$ajax({
          method: 'get',
          url: url,
          params: data,
        }).then(function (response) {
          self.cityList = response.data.data
          self.selectType = 1
          self.getMinTop(2)
        })
      },
      getArea (number, cityName) {
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
        })
      },
      selectOver (number, cityName) {
        // 记录选中的市的编码
        this.cityNumber = number
        // 当前选项卡名称改变
        this.cityName = cityName
        // 事件派发，将省市区名字以及编号返回
        let data = {
          province:{
            id: this.proNumber,
            name: this.provinceName
          },
          city:{
            id: this.cityNumber,
            name: this.cityName
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
  .list {
    line-height: .8rem;
    text-align: center;
    float: left;
    width: 3rem;
    height: 10rem;
    overflow-y: scroll;
    /* 兼容safari滑动 */
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  .list li{
    /* 兼容safari滑动 */
    min-height: 1px;
    position: absolute;
    left: 0;
    width: 100%;
    transition: top 0.5s;
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
