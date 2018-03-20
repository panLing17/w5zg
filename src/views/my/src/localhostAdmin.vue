<template lang="pug">
  .localhostSelectBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 管理收货地址
      .topRight(slot="right")
    ul.localhostList
      li(v-for="item in list" , @click="changeLocation(item)")
        div.listTop
          p <span>收货人:{{item.name}}</span> <span>联系方式:{{item.mobile}}</span>
          p {{item.address}}
          p 邮政编码：
        ul.listButton
          li.checkbox
            a(@click.stop="locationDefault(item.addressId , item.isdefault)")
              w-checkbox(v-model="item.isdefault")
            span 设为默认
          li.changeDelete
            span(@click.stop="changeLocation(item)") 编辑
            span(@click.stop="makeSure(item.addressId)") 删除
    .bottom
      w-button(@click="$router.push('/my/localAdd')") <img src="../../../assets/img/add@3x.png"/>新增收货地址
</template>

<script>
  export default {
    name: "localhost-admin",
    data(){
      return{
        nowId: '',
        flag: false,
        list:[{
          name: 'Mark',
          mobile: '13656633092',
          isdefault: false,
          address: '浙江温州江南皮革厂老板王鹤的小姨子家'
        }],
      }
    },
    mounted () {
      // this.getData()
    },
    methods:{
      goBack(){
        this.$router.go(-1)
      },
      goLocalhostAdd(){
        this.$router.push("/my/localhostAdd")
      },
      getData () {
        let _this = this
        _this.$ajax({
          method: 'post',
          url: 'memberAddress/addressList',
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response.data.code === '100') {
            for (let i in response.data.data) {
              response.data.data[i].isdefault === 0 ? response.data.data[i].isdefault = false:response.data.data[i].isdefault = true
            }
            _this.list = response.data.data
          }
        })
      },
      locationDefault (id) {

      },
      makeSure (id) {
        this.nowId = id
        this.flag = true
      },
      deleteLocation () {
        let _this = this
        _this.$ajax({
          method: 'post',
          url: 'memberAddress/delAddress',
          params: {
            addressId: _this.nowId
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          if (response.data.code === '100') {
            _this.flag = false
            _this.getData()
          }
        })
      },
      changeLocation (data) {
        this.$store.commit('transferGive', data)
        this.$router.push({path: '/my/localhostAdd', query:{id:data.addressId}})
      }
    }
  }
</script>

<style scoped>
  .localhostSelectBox{
    min-height: 100vh;
    background: #fafafa;
    position: relative;
    z-index: 100;
  }
  .localhostList{

  }
  .localhostList>li{
    padding: 0 .2rem;
    margin-top: .3rem;
    background: white;
  }
  .localhostList>li:nth-child(1){
    margin-top: 0;
  }
  .listTop{
    padding: .2rem 0;
    height: 2.4rem;
    border-bottom: solid 1px #eee;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .listTop p{
    display: flex;
    justify-content: space-between;

  }
  .listButton{
    height: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .checkbox{
    display: flex;
    align-items: center;
  }
  .checkbox span{
    margin-left: .3rem;
    color: #999;
  }
  .changeDelete span{
    margin-left: .8rem;
  }
  .bottom {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bottom img {
    height: .3rem;
    margin-right: .2rem;
  }
</style>
