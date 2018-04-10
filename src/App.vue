<template>
  <div id="app">
    <transition name="fade" , mode="out-in">
       <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  mounted () {
    this.getDictionaries()
    this.getLocation()
  },
  methods:{
    getDictionaries () {
      let self = this
      self.$ajax({
        method: 'get',
        url: self.$apiMember + 'dic/all',
        params: {}
      }).then(function (response) {
        $codeList = response.data.data
      })
    },
    getLocation () {
      var _this=this
      var map, geolocation ,geocoder;
      AMap.plugin('AMap.Geocoder',function() {
        geocoder = new AMap.Geocoder({
          city: "010"//城市，默认：“全国”
        });
      })
      //加载地图，调用浏览器定位服务
      map = new AMap.Map('container', {
        resizeEnable: true
      });
      map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,//是否使用高精度定位，默认:true
          timeout: 10000,          //超过10秒后停止定位，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
          zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
          buttonPosition:'RB'
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition();
        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
      });
      //解析定位结果
      function onComplete(data) {
        console.log(data)
        var str=[]
        str.push(data.position.getLng());
        str.push( data.position.getLat());
        // 储存经纬度
        // _this.$store.commit('nowLocationChange',str)
        // 编码逆解析
        geocoder.getAddress([data.position.lng,data.position.lat],function(status,result){
          if(status=='complete'){
            console.log(result)
            let province = result.regeocode.addressComponent.province
            let city = result.regeocode.addressComponent.city
            let district = result.regeocode.addressComponent.district
            // 根据省市区名称获取省市区id，后跳转至首页
            // _this.getLocationId(province,city,district)
          }else{
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
    getLocationId(province,city,area) {
      let _this = this
      _this.$ajax({
        method: 'post',
        url: 'location/findByNames',
        params: {
          provinceName: province,
          cityName: city,
          areaName: area,
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
      }).then(function (response) {
        if (response.data.code === '100') {
          // 保存省市区id
          _this.$store.commit('getLocationId', response.data.data[0])
        }
      })
    }
  }
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
li{
  list-style: none;
}
.clearBoth{
  clear: both;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
a{text-decoration:none}
.scrollWarpClass {
  position: fixed;
  bottom: 2rem;
  right: .5rem;
  width: 1rem;
  z-index: 200;
}
</style>
