<template>
  <div id="app">
    <!--<a href="w5zg://pszh.com/test/scheme?name=google&page=1" style="position: fixed; top: 0; left: 0;z-index: 99999;display: block; width: 100%;height: 500px;background-color: red;">打开app</a>-->
    <transition name="fade" , mode="out-in">
      <keep-alive>
        <router-view v-if="!$route.meta.keepAlive"/>
      </keep-alive>
    </transition>
    <transition name="fade" , mode="out-in">
      <router-view v-if="$route.meta.keepAlive"/>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    name: 'app',
    mounted() {
      // this.getAddressData()
      this.getDictionaries()
      // this.getLocation()
      if (localStorage.hasOwnProperty('token')) {
        this.getUserData()
        this.addLoginLog()
      } else {
        this.$store.commit('setShowRegisterTicket', true)
      }
    },
    computed: {
      ...mapState(['keepAliveFlag'])
    },
    methods: {
      // toApp() {
      //   let startTime = Date.now();
      //   let ifr = document.createElement('iframe')
      //   ifr.src = 'w5zg://pszh.com/test/scheme?name=google&page=1'
      //   ifr.style.display = 'none'
      //   document.body.appendChild(ifr)
      //   var t = setTimeout(function() {
      //     var endTime = Date.now();
      //     if (!startTime || (endTime - startTime < 1500)) {
      //       window.location.href = '#/download'
      //     } else {
      //
      //     }
      //     }, 1000);
      // },
      addLoginLog() {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/addLoginLog',
          params: {}
        }).then(function (response) {

        })
      },
      getDictionaries() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'dic/all',
          params: {}
        }).then(function (response) {
          $codeList = response.data.data
        })
      },
      getLocation() {
        var _this = this
        var map, geolocation, geocoder;
        AMap.plugin('AMap.Geocoder', function () {
          geocoder = new AMap.Geocoder({
            city: "010"//城市，默认：“全国”
          });
        })
        //加载地图，调用浏览器定位服务
        map = new AMap.Map('container', {
          resizeEnable: true
        });
        map.plugin('AMap.Geolocation', function () {
          geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          });
          map.addControl(geolocation);
          geolocation.getCurrentPosition();
          AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
          AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
        });

        //解析定位结果
        function onComplete(data) {
          var str = []
          str.push(data.position.getLng());
          str.push(data.position.getLat());
          // 储存经纬度
          // _this.$store.commit('nowLocationChange',str)
          // 编码逆解析
          geocoder.getAddress([data.position.lng, data.position.lat], function (status, result) {
            if (status == 'complete') {
              _this.getLocationId(result.regeocode.addressComponent.adcode)
              let province = result.regeocode.addressComponent.province
              let city = result.regeocode.addressComponent.city
              let district = result.regeocode.addressComponent.district
              // 根据省市区名称获取省市区id，后跳转至首页
              // _this.getLocationId(province,city,district)
            } else {
              _this.$message.error('无法获取地址')
            }
          })
        }

        //解析定位错误信息
        function onError(data) {
          console.log(data)
          _this.$message.error('定位失败,请开启定位')
        }
      },
      getLocationId(adCode) {
        let _this = this
        _this.$ajax({
          method: 'get',
          url: _this.$apiApp + 'area/areaInfo',
          params: {
            adCode: adCode
          },
        }).then(function (response) {
          let data = {
            province: {
              name: response.data.data.provinceName,
              id: response.data.data.provinceNo
            },
            city: {
              name: response.data.data.cityName,
              id: response.data.data.cityNo
            },
            area: {
              name: '玄武区',
              id: 320102
            }
          }
          _this.$store.commit('getLocation', data)
        })
      },
      getUserData() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'member/currentMember',
          params: {}
        }).then(function (response) {
          if (response) {
            self.$store.commit('userDataChange', response.data.data)
            localStorage.setItem('member_type', response.data.data.member_type)
            if (response.data.data.member_type === '091') {
              if (response.data.data.reg_present === '11') {
                self.$store.commit('setShowRegisterTicket', false)
              } else {
                self.$store.commit('setShowRegisterTicket', true)
              }
            } else {
              self.$store.commit('setShowRegisterTicket', false)
            }
          }
        })
      },

      getAddressData () {
        if (!localStorage.hasOwnProperty('token')) {
          return
        }
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/addresses',
          params: {},
        }).then(function (response) {
          for (let i in response.data.data) {
            //response.data.data[i].ra_default === '011' ? response.data.data[i].ra_default = true : response.data.data[i].ra_default = false
            if (response.data.data[i].ra_default === '011') {
              return self.$store.commit('setAddressM', true)
            }
            self.$store.commit('setAddressM', false)
          }
        })
      }
    }
  }
</script>

<style>
  @font-face {
    font-family: Webdings;
    src: url('./assets/font/Webdings.ttf')
  }
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  li {
    list-style: none;
  }

  .clearBoth {
    clear: both;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  a {
    text-decoration: none
  }

  .scrollWarpClass {
    position: fixed;
    bottom: 3rem;
    right: .5rem;
    width: 1rem;
    z-index: 200;
  }

  .scrollWarpClass {
    pointer-events: auto !important;
  }
</style>
