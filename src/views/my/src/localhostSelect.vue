<template lang="pug">
  .localhostSelectBox
    w-top(background="white")
      .topLeft(slot="left", @click="goBack")
        img.topLeft(src="../../../assets/img/back.png" )
      .topCenter(slot="center") 选择收货地址
      .topRight(slot="right" , @click="goLocalhostAdmin")
        p.topRight 管理
    ul.localhostList
      li(v-for="item in list" , @click = "locationChecked(item)")
        div.listTop
          p {{item.name}} <span>{{item.mobile}}</span>
          p {{item.address}}

</template>

<script>
    export default {
        name: "localhost-select",
        data(){
          return{
            list: []
          }
        },
        mounted () {
          this.getData()
        },
        methods:{
          goBack(){
            this.$router.go(-1)
          },
          goLocalhostAdmin(){
            this.$router.push("/my/localhostAdmin")
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
          locationChecked (data) {
            this.$store.commit('giveGoodsAddressChange' , data)
            this.$router.go(-1)
          }
        }
    }
</script>

<style scoped>
  .localhostSelectBox{
    padding-top: 1.3rem;
    min-height: 100vh;
    background: #fafafa;
    position: relative;
    z-index: 100;
  }
  .topLeft{
    width: .2rem;
    margin-left: .2rem;
  }
  .topRight{
    margin-right: .2rem;
  }
  .localhostList{
    background: white;
  }
  .localhostList>li{
    padding: 0 .2rem;

  }
  .listTop{
    height: 2rem;
    border-bottom: solid 1px #eee;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

</style>
