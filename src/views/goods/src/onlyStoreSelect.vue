<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-show="show")
        .mescroll(id="storeSelect")
          .title
            span 配送至
            img(src="../../../assets/img/cancle@3x.png", @click="close")
          ul.list
            li(v-for="item in storeList", @click="selectOver(item.bs_id,item.bs_name)") {{item.bs_address}}
            li(v-if="storeList.length === 0") 该城市无可选门店
</template>

<script>
  export default {
    name: "store-select",
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
        provinceList: [],
        cityList: [],
        storeList: []
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      show (val) {
        if (val) {
          this.storeList = []
          this.getStore()
          // mescroll初始化
          this.$mescrollInt("storeSelect",this.upCallback)
        } else {
          this.mescroll.hideTopBtn();
          this.mescroll.destroy()
        }
      }
    },
    mounted () {
    },
    methods:{
      upCallback: function(page) {
        let self = this;
        // self.mescroll.endSuccess(1)
        this.mescroll.endErr()
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
      getStore () {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/store',
          params: {
            gskuId: self.$store.state.skuId,
            gspuId: self.$route.query.id,
            provinceNo: self.$store.state.location.province.id ,
            cityNo: self.$store.state.location.city.id
          },
        }).then(function (response) {
          self.storeList = response.data.data.storeList
          self.selectType = 2
        })
      },
      selectOver (number, storeName) {
        // 事件派发，将省市区名字以及编号返回
        let data = {
          id: number,
          name: storeName
        }
        let l = this.$store.state.location
        l.store = data
        this.$store.commit('transferGive',l)
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
    height: 30%;
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
    width: 10rem;
    height: 4rem;
    overflow-y: auto;
  }
  .list li{
    border-top: solid 1px #eee;
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
