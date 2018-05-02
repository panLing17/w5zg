<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close", @touchmove.prevent="")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show")
        .title
          img(src="../../../assets/img/cancle@3x.png", @click="close")
          span 选择门店
          .submit(@click="submit") 确定
        .content
          .left
            ul
              li(v-for="(i,index) in cityList", :class="{leftChecked:index===leftChecked}", @click="leftClick(index, i.city_no)") {{i.city_name}}
          .right(@touchmove.prevent="")
            ul
              li(v-for="(i,index) in storeList", :class="{rightChecked:index===rightChecked}", @click="rightClick(index, i.bs_id)") {{i.bs_name}}
              li(v-if="!storeList.length") {{leftChecked===-1 ? '请选择城市' : '该城市无可用门店'}}
</template>

<script>
  export default {
    name: "city-select",
    data () {
      return {
        cityList: [],
        storeList: [],
        // 当前选中的左半部分标签
        leftChecked: -1,
        // 左半部分选中的id
        leftId: '',
        // 当前选中的右半部分标签
        rightChecked: -1,
        // 右半部分选中的id
        rightId: '',
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      goodsList: Object
    },
    mounted () {
      this.getCity()
    },
    methods:{
      close () {
        this.leftChecked = -1
        this.storeList = []
        this.$emit('close')
      },
      submit () {
        this.$emit('submit', this.leftId,this.rightId)
      },
      leftClick (index, id) {
        this.leftChecked = index
        this.leftId = id
        this.storeList = []
        this.getStore(id)
      },
      rightClick (index, id) {
        this.rightChecked = index
        this.rightId = id
      },
      getCity () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiApp + 'index/cityProvince',
          params: {
            pro_no: self.$store.state.location.province.id
          },
        }).then(function (response) {
          self.cityList = response.data.data
        })
      },
      getStore (cityId) {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/store',
          params: {
            gskuId: self.goodsList.gsku_id,
            gspuId: self.goodsList.gspu_id,
            provinceNo: self.$store.state.location.province.id ,
            cityNo: cityId
          },
        }).then(function (response) {
          self.storeList = response.data.data.storeList
        })
      },
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
    height: 7rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
  }
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.2rem;
    font-size: .4rem;
    position: relative;
    padding: 0 .2rem;
    border-bottom: solid 1px #aaa;
  }
  .title img{
    width: .4rem;
  }
  .title .submit{
    font-size: .3rem;
    color: rgb(245,0,87);
  }
  /* 弹出部分选择主体 */
  .content {
    display: flex;
    height: 100%;
    background: rgb(242,242,242);
  }
  .content .left {
    width: 3.5rem;
    height: 100%;
    padding-left: .2rem;
    overflow-y: auto;
    background: white;
  }
  .content .right {
    flex-grow: 1;
    width: 0;
  }
  .content li{
    padding-left: .4rem;
    width: 100%;
    height: 1rem;
    line-height: 1rem;
    transition: background-color .3s, color .3s;
  }
  /* 左部选中样式 */
  .leftChecked {
    color: rgb(245,0,87);
    background-color: rgb(242,242,242);
  }
  /* 右部选中样式 */
  .rightChecked {
    color: rgb(245,0,87);
  }
</style>
