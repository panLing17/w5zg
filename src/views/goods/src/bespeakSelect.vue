<template lang="pug">
  .citySelectBox
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .bg(v-if="show", @click="close")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .main(v-if="show")
        .title
          .left(v-if="backFlag")
            img(src="../../../assets/img/Page1@2x.png", @click="close")
          .left(v-else)
            img(src="../../../assets/img/Page1@2x.png", @click="backPrev")
          .center 专柜体验
          .right(@click="$router.push('/reservations')")
            img(src="../../../assets/img/ic_yuyue_into.png")
            span 我的预约
        .content
          .left(ref="lscroll2")
            ul
              li.contentLeftItem(v-for="(item, index) in storeList", :class="{active: index===currentCity}", @click="currentCity=index") {{item.cityName}}
          .right(ref="rscroll2")
            ul
              li.contentRightItem(v-for="item in list", @click="addBespeak(item)")
                .name
                  img(src="../../../assets/img/position2.png")
                  span {{item.bs_name}}
                .address {{item.bs_address}}
</template>

<script>
  import BScroll from 'better-scroll'
  export default {
    name: "store-select",
    data () {
      return {
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
      },
      backFlag: {
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
      backPrev() {
        this.$emit('backPrev')
      },
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
        if(this.$store.state.skuId) {
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
        }

      },
      addBespeak (item) {
        this.bsId = item.bs_id
        if (!this.bsId) {
          this.$notify({
            content: '请选择门店',
            bottom: 1.8
          })
          return
        }
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'goods/addTryOn',
          params: {
            gspuId: self.$route.query.id,
            storeId: self.bsId
          },
        }).then(function (response) {
          if (response.data.code === '081') {
            self.close()
            self.$notify({
              content: '预约专柜成功',
              bottom: 1.86
            })
          }

        })
      }
    }
  }
</script>

<style scoped>
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
    height: 12rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
  }

  .title {
    height: 1.3rem;
    display: flex;
    justify-content: space-between;
    padding: 0 .4rem;
    align-items: center;
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
    height: 10.7rem;
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
