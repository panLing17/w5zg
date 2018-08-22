<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show")
        .title
        .content
          .left(ref="lscroll2")
            ul
              li.contentLeftItem(v-for="(item, index) in storeList", :class="{active: index===currentCity}", @click="currentCity=index") {{item.cityName}}
          .right(ref="rscroll2")
            ul
              li.contentRightItem(v-for="(item, index) in list", @click="addBespeak(item, index)")
                .name
                  img(src="../../../assets/img/Shape@2x.png", v-if="index === checkFlags")
                  img(src="../../../assets/img/Shape2@2x.png", v-else)
                  span(:class="{checkeds: index === checkFlags}") {{item.bs_name}}
                .address {{item.bs_address}}
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "bes",
    data () {
      return {
        checkFlags: '',
        // 当前选中的地址的id
        bsId: '',
        storeList: [],
        currentCity: 0
      }
    },
    props: {
      show: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      list () {
        if (this.storeList.length) {
          setTimeout(() => {
            if (this.rscroll2) {
              this.rscroll2.refresh()
            } else {
              this.rscroll2 = new BScroll(this.$refs.rscroll2, {
                click: true
              })
            }
          }, 20)
          return this.storeList[this.currentCity].storeList
        } else {
          return []
        }
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
          url: self.$apiGoods + 'goods/spu/findStoreListBySkuId',
          params: {
            gskuId: self.$store.state.skuId
          },
        }).then(function (response) {
          self.storeList = response.data.data
          setTimeout(() => {
            if (self.lscroll2) {
              self.lscroll2.refresh()
            } else {
              self.lscroll2 = new BScroll(self.$refs.lscroll2, {
                click: true
              })
            }
          }, 20)
        })
      },
      addBespeak (item, index) {
        this.bsId = item.bs_id
        // if (!this.bsId) {
        //   this.$message.warning('请选择门店')
        //   return
        // }
        let jjj = {
          gspuId: this.$route.query.id,
          storeId: this.bsId
        }
        this.$emit('succ',jjj)
        this.checkFlags = index
        // let self = this
        // self.$ajax({
        //   method: 'post',
        //   url: self.$apiGoods + 'goods/addTryOn',
        //   params: {
        //     gspuId: self.$route.query.id,
        //     storeId: self.bsId
        //   },
        // }).then(function (response) {
        //   self.checkFlags = index
        //   //self.$message.success(response.data.msg)
        //   //self.close()
        //   self.$emit('succ')
        // })
      }
    }
  }
</script>

<style scoped>
  .checkeds{
    color: #F70057;
  }
  .bg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    /*position: fixed;
    top: 0;*/
    /*left: 0;
    z-index: 101;*/
  }

  .main {
    background-color: white;
    width: 100%;
    /*height: 10rem;*/
    /*position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;*/
  }

  .title {
    border-bottom:1px solid rgb(215,215,215);
  }
  .title .left img {
    width: .586rem;
  }
  .title .center {
    font-size:.48rem;
    color:rgb(51,51,51);
  }
  .title .right {
    display: inline-flex;
    align-items: center;
  }
  .title .right img {
    width: .4rem;
    margin-right: .1rem;
  }
  .content {
    /*height: 8.7rem;*/
    display: flex;
    overflow: hidden;
  }
  .content .left {
    width: 26%;
    flex: none;
    height: 100%;
  }
  .content .right {
    height: 100%;
    flex: 1;
    background: rgb(242,242,242);
    padding: 0 .32rem 0 .37rem;
  }
  .contentLeftItem {
    min-height: 1.2rem;
    text-align: center;
    line-height: 1.2rem;
    border-bottom: 1px solid rgb(215,215,215);
    color: rgb(51,51,51);
    font-size: .4rem;
  }
  .contentLeftItem.active {
    background: rgb(242,242,242);
    color:rgb(247,0,87);
  }
  .contentLeftItem:last-child, .contentRightItem:last-child {
    border: none;
  }
  .contentRightItem {
    height: 2.13rem;
    line-height: .53rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    border-bottom: 1px solid rgb(215,215,215);
  }
  .name {
    color: #333;
    font-size: .37rem;
  }
  .name img {
    width: .26rem;
    margin-right: .1rem;
  }
  .address {
    color: #666;
    font-size: .32rem;
  }
</style>

