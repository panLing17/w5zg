<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show")
        .title
          span 专柜体验
          .right
            img(src="../../../assets/img/pageList.png", @click="close")
            span 我的预约
        ul.list
          li.city(v-for="item in storeList")
            h1 {{item.cityName}}
            ul
              li(@click="bsId=i.bs_id", v-for="i in item.storeList")
                .text
                  h2 {{i.bs_name}}
                  p {{i.bs_address}}
                    span(v-for="tags in i.bs_type_name.split('&')") 可{{tags}}
                .icon
                  img(src="../../../assets/img/now@2x.png", v-if="bsId === i.bs_id")
                  img(src="../../../assets/img/past@2x.png", v-else)
        button.ok 确 认

</template>

<script>
  export default {
    name: "store-select",
    data () {
      return {
        // 当前选中的地址的id
        bsId: '',
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
      show () {
        if (this.show) {
          this.storeList = []
          this.getStore()
        }
      }
    },
    mounted () {
    },
    methods:{
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
          url: self.$apiGoods + 'goods/queryStore',
          params: {
            gskuId: self.$store.state.skuId,
            marketId:0,
            cityNo: self.$store.state.location.city.id,
            storeType: 1
          },
        }).then(function (response) {
          self.storeList = response.data.data

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
    height: 70%;
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
    border-bottom: solid 1px #eee;
  }
  .title .right{
    position: absolute;
    right: .2rem;
    font-size: .3rem;
    display: flex;
    align-items: center;
  }
  .title .right img{
    width: .6rem;
    margin-right: .1rem;
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
    padding: 0 .4rem;
  }
  .list .city {
    border-bottom: solid 1px #eee;
  }
  .city>h1{
    text-align: left;
    font-size: .4rem;
  }
  .city>ul>li{
    display: flex ;
    justify-content: space-between;
    align-items: center;
    margin-bottom: .2rem;
  }
  .icon{
    width: .45rem;
  }
  .icon img{
    width: 100%;
  }
  .text{
    max-width: 8rem;
  }
  .text h2{
    font-size: .3rem;
    font-weight: 500;
    text-align: left;
    line-height: .5rem;
    color: #222;
  }
  .text p{
    font-size: .3rem;
    line-height: .5rem;
    text-align: left;
    color: #aaa;
  }
  .text p span{
    padding: 1px 3px;
    background-color: rgba(245,0,87,.1);
    border: solid 1px rgba(245,3,87,1);
    color: rgb(245,0,87);
    margin-left: .2rem;
    border-radius: 3px;
  }
  .ok {
    width: 100%;
    height: 1rem;
    background-color: rgb(245,0,87);
    border: none;
    color: white;
    font-size: .4rem;
    position: absolute;
    bottom: 0;
    left: 0;
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
