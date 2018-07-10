<template lang="pug">
  .footMarkBox
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 足迹
      .topRight(slot="right")
    .content(ref="conts").mescroll#footMescroll
      .date(v-for="item in footMarkData")
        .title  {{item.create_time}}
        ul
          li(v-for="i in item.goods_info", @click="goGoods(i.gspu_id)")
            img(:src="i.gi_image_url | img-filter")
            .text
              .price
                span {{i.price | price-filter}}
                span(@click.stop="show = true", v-show="false")
                  i
                  i
                  i
          p(style="clear:both")
    transition(enter-active-class="animated fadeIn", leave-active-class="animated fadeOut")
      .seleteBg(v-if="show", @click="show = false")
    transition(enter-active-class="animated fadeInUpBig", leave-active-class="animated fadeOutDownBig")
      .seleteMain(v-if="show")
        w-button(@click="selectSex('m')") 删除
        w-button(@click="show = false") 取消
</template>

<script>
  export default {
    name: 'foot-mark',
    data () {
      return {
        footMarkData: [],
        show: false
      }
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
    },
    mounted () {
      this.getData()
      this.$mescrollInt('footMescroll', this.upCallback)
      this.hideStyles()
    },
    methods: {
      hideStyles () {
        this.$refs.conts.children[1].style.display = 'none'
      },
      getData () {
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiGoods + 'logGoodsBrowse/show',
          params: {
          }
        }).then(function (response) {
          self.footMarkData = response.data.data
        })
      },
      goGoods (id) {
        this.$router.push({path: '/goodsDetailed', query: {id: id}})
      },

      upCallback: function (page) {
        let self = this
        this.getListDataFromNet(page.num, page.size, function (curPageData) {
          // if (page.num === 1) self.pageName = []
          // self.pageName = self.pageName.concat(curPageData)
          self.mescroll.endSuccess(curPageData.length)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      },
      getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
        successCallback && successCallback({}) // 成功回调
      }
    }
  }
</script>

<style scoped>
  #footMescroll{
    position: fixed;
    top: 1.28rem;
    bottom: 0;
    width: 100%;
    height: 100vh;
    background-color: rgb(242,242,242);
    padding-bottom: 1.5rem;
  }
  .footMarkBox {
    position: relative;
    z-index: 100;
  }
  .date {
    padding: 0 .2rem;
  }
  .date .title{
    color: #aaaaaa;
    line-height: .7rem;
  }
  .date ul {

  }
  .date ul li {
    width: 30%;
    height: 3.5rem;
    background-color: white;
    border: solid 1px #eee;
    border-radius: .1rem;
    float: left;
    margin-right: 3%;
    margin-bottom: .2rem;
  }
  .date ul li img {
    width: 100%;
    height: 2.5rem;
  }
  .date ul li .text {
    padding: .2rem .1rem;
    height: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    font-size: .35rem;
    color: rgb(245,0,87);
    font-weight: 600;
  }
  .date ul li .text .price{
    display: flex;
    justify-content: space-between;
  }
  .date ul li .text .price span:last-child {
    height: .6rem;
    width: .3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  .date ul li .text .price span:last-child i {
    display: block;
    width: 5px;
    height: 5px;
    border: solid 1px #aaaaaa;
    border-radius: 3px;
  }
  /* 确认删除 */
  .seleteBg {
    background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
  }

  .seleteMain {
    background-color: white;
    width: 100%;
    height: 4rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
    padding: .5rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
</style>
