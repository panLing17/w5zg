<template lang="pug">
  .localhostSelectBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 管理收货地址
      .topRight(slot="right")
    transition-group(enter-active-class="animated bounceInLeft", leave-active-class="animated fadeOutRight", tag="ul").localhostList
      li(v-for="(item,index) in list", :key="index")
        div.listTop
          p <span>收货人:{{item.ra_name}}</span> <span>联系方式:{{item.ra_phone}}</span>
          p {{item.province_name}} {{item.city_name}} {{item.county_name}} {{item.ra_detailed_addr}}
          p(v-if="false") 邮政编码：{{item.ra_province}}
        ul.listButton
          li.checkbox
            a(@click.stop="")
              w-checkbox(v-model="item.ra_default", @change="defaultChange(item.ra_default,index,item.id)")
            span 设为默认
          li.changeDelete(@click.stop="")
            span(@click="changeLocation(item)") 编辑
            span(@click="makeSure(item.id,index)") 删除
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
        list:[],
      }
    },
    mounted () {
      this.getData()
    },
    methods:{
      defaultChange (selected,index,id) {
        // 假改
        this.list.forEach((now)=>{
          now.ra_default = false
        })
        this.list[index].ra_default = true
        // 真改
        let self = this
        if (selected) { // 用户尝试取消选择时不发生请求
          self.$ajax({
            method: 'PATCH',
            url: self.$apiMember + 'receivingAddress/address',
            params: {
              addressId: id
            },
          }).then(function (response) {
            self.activityGoods = response.data.data
          })
        }
      },
      goBack (){
        this.$router.go(-1)
      },
      getData () {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiMember + 'receivingAddress/addresses',
          params: {},
        }).then(function (response) {
          for (let i in response.data.data) {
            response.data.data[i].ra_default === '011' ? response.data.data[i].ra_default = true : response.data.data[i].ra_default = false
          }
          self.list = response.data.data
        })
      },
      locationDefault (id) {

      },
      // 询问是否删除
      makeSure (id,index) {
        this.$confirm({
          title: '删除地址',
          message: '确定要删除么',
          confirm: () => {
            let self = this
            self.$ajax({
              method: 'delete',
              url: self.$apiMember + 'receivingAddress/address',
              params: {
                addressId: id
              },
              headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).then(function (response) {
              self.list.splice(index,1)
            })
          },
          noConfirm: () => {
            alert(id)
          }
        })
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
      changeLocation (item) {
        this.$router.push({path: '/my/localAdd', query:{id:item.id}})
        this.$store.commit('transferGive',item)
        console.log(item)
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
    padding-bottom: 1rem;
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
