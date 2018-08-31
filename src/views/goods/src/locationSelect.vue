<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main.mescroll#locationSelect(v-show="show")
        .title
          img(src="../../../assets/img/Page1@2x.png", @click="close")
        .locationList(ref="locationList")
          ul
            li.location(v-for="item in location", @click="locationSelected(item)")
              .nameAndMobile
                p {{item.ra_name}}
                p {{item.ra_phone}}
              .giveGoodsLocation
                .moren(v-if="item.ra_default==='011'") [默认地址]
                .info {{item.province_name}} {{item.city_name}} {{item.county_name}} {{item.ra_detailed_addr}}
        .button
          .btn(@click="$router.push('/my/localAdd')" v-if="origin==='confirm'")
            img(src="../../../assets/img/Group5@2x.png")
            span 新增收货地址
          .btn(@click="openCitySelect" v-else) 选择其他省市
            <!--w-button(@click="$router.push('/my/localAdd')" v-if="origin==='confirm'") 新增收货地址-->
            <!--w-button(@click="openCitySelect" v-else) 选择其他省市-->

</template>

<script>
  import BScroll from 'better-scroll'
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
        /*setTimeout(() => {
          if (this.locationSelectScroll) {
            this.locationSelectScroll.refresh()
          }else {
            this.locationSelectScroll = new BScroll(this.$refs.locationList, {click: true})
          }
        }, 20)*/
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
    height: 12rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 104;
    padding-bottom: 2rem;
  }
  .title {
    height: 1.3rem;
    display: flex;
    align-items: center;
    padding: 0 .53rem;
    border-bottom: 1px solid rgb(215,215,215);
  }
  .title img{
    width: .58rem;
  }
  /*-------------*/
  .locationList {
    /*overflow-y: auto;*/
    /*height: 7.42rem;*/
    padding: 0 .53rem;
    overflow: hidden;
  }
  .location{
    min-height: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: white;
    border-bottom: solid 1px rgb(215,215,215);
  }
  .location:last-child {
    border: none;
  }
  .location .content {
    flex-grow: 1;
  }
  .nameAndMobile{
    width: 100%;
    display: flex;
  }
  .nameAndMobile p {
    color: #333;
    font-size: .34rem;
    margin-right: .3rem;
  }
  .location .icon{
    width: 1rem;
  }
  .giveGoodsLocation{
    display: flex;
    margin-top: .2rem;
    font-size: .29rem;
    line-height: .42rem;
  }
  .giveGoodsLocation .label{
    width: 1.5rem;

  }
  .giveGoodsLocation .info{
    color: #333;

  }
  .button {
    /*height: 1.5rem;*/
    margin-top: .3rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .moren {
    color: rgb(245,0,87);
    margin-right: .1rem;
  }
  .btn {
    height: 1rem;
    width: 7rem;
    border-radius: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: rgb(245,0,87);
    color: #fff;
    font-size: .4rem;
  }
  .btn img {
    margin-right: .2rem;
    width: .37rem;
  }
</style>
