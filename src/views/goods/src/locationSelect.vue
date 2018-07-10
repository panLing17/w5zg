<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main.mescroll#locationSelect(v-show="show")
        .title
          span 选择收货地址
          img(src="../../../assets/img/cancle@3x.png", @click="close")
        ul.locationList
          li.location(v-for="item in location", @click="locationSelected(item)")
            .content
              .nameAndMobile
                p 收件人：{{item.ra_name}}
                p 手机号：{{item.ra_phone}}
              .giveGoodsLocation
                .label 收货地址
                .info {{item.province_name}} {{item.city_name}} {{item.county_name}} {{item.ra_detailed_addr}}
          .button
            w-button(@click="$router.push('/my/localAdd')" v-if="origin==='confirm'") 新增收货地址
            w-button(@click="openCitySelect" v-else) 选择其他省市
</template>

<script>
  export default {
    name: "location-select",
    data () {
      return {

      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      },
      origin:{
        type: String,
        default: 'confirm'
      },
      location: Array
    },
    mounted () {

    },
    watch:{
      show (val) {
        if (val) {
          // mescroll初始化
          this.$mescrollInt("locationSelect",this.upCallback)
          this.mescroll.lockDownScroll(true)
          setTimeout(()=>{
            this.mescroll.hideUpScroll()
          },500)
        } else {
          this.mescroll.hideTopBtn();
          this.mescroll.destroy()
        }
      }
    },
    methods:{
      upCallback: function(page) {
        let self = this;
        self.mescroll.endSuccess(1)
      },
      close () {
        this.$emit('close')
      },
      openCitySelect () {
        this.$parent.selectCityOpen()
      },
      locationSelected (item) {
        this.close()
        let {
          city_name,
          county_name,
          province_name,
          ra_city,
          ra_county,
          ra_province
        } = item
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
        this.$store.commit('getLocation',location)
        // 延时赋值收货地址，防止选择城市处同时监听到两个变化
        setTimeout(()=>{
          this.$store.commit('giveGoodsAddressChange',item)
        },500)
        this.$emit('selected')
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
    z-index: 103;
  }

  .main {
    background-color: white;
    width: 100%;
    height: 70%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 104;
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
  /*-------------*/
  .locationList {
    overflow-y: auto;
    height: calc(100% - 1rem);
  }
  .location{
    padding: .2rem;
    display: flex;
    background-color: white;
    justify-content: space-between;
    border-bottom: solid 1px #eee;
  }
  .location .content {
    flex-grow: 1;
  }
  .nameAndMobile{
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .location .icon{
    width: 1rem;
  }
  .giveGoodsLocation{
    display: flex;
    margin-top: .2rem;
    color: #aaaaaa;
  }
  .giveGoodsLocation .label{
    width: 1.5rem;
    line-height: .6rem;
  }
  .giveGoodsLocation .info{
    width: 0;
    flex-grow: 1;
    line-height: .6rem;
  }
  .button {
    height: 1.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
