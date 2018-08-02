<template lang="pug">
  .wrapNav
    .navbar(ref="nav")
      .topLeft
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter 收藏夹
      .topRight(@click="zhengli", v-if="buzheng") {{zheng == 0 ?'整理':'完成'}}
    .empty.mescroll#collectMescroll
      .imgs
        img(src="../../../assets/img/coupon-icon@2x.png")
      .words 您还没有收藏商品，快去逛逛吧
      .goToHome(@click="$router.push('/home')") 去商城首页
      .title
        img(src="../../../assets/img/recommend.png")
      recommend#dataId(ref="recommend")
    .contList(ref="conts", v-if="false")
      div
        ul(:class="{zhengS:zhengSFlag}")
          li(v-for="item in contLists", v-if="item.gi_status === '221'")
            .checkbox(v-if="zheng != 0")
              w-checkbox(@change="change", v-model="item.selected")
            .lefter(@click="gotoGoods(item)")
              img(:src="item.gi_image_url | img-filter", @click.prevent="")
            .righter(@click="gotoGoods(item)")
              .text {{item.gi_name}}
              .price <span>实付价:</span><strong>{{item.direct_supply_price | price-filter}}</strong>
        ul.lose(v-if="deleteFlag == 1", :class="{zhengL:zhengSFlag,zhengpp:zhengppFlag}")
          li.title
            .left 失效商品共<span>{{indexN}}</span>件
            .right(@click="clearLost") 清空失效商品
          li(v-for="item in contLists", v-if="item.gi_status === '224'")
            .lefter
              .mask 失效
              img(:src="item.gi_image_url | img-filter", @click.prevent="")
            .righter
              .textLose {{item.gi_name}}
              .lost 该商品已失效，请重新选择
    .clearFixed(v-if="zheng != 0")
      .checkAll
        w-checkbox(@change="changeAll", v-model="selectedAll")
        span 全选
      .clearBtn(@click="deleteGoods()") 删除
</template>

<script>
  import {mapState} from 'vuex'
  import BScroll from 'better-scroll'
  import recommend from './recommend'
  export default {
    name: "collection",
    components:{recommend},
    data() {
      return {
        buzheng: '',
        zhengppFlag: false,
        zhengPFlag: false,
        zhengSFlag: false,
        indexN: 0,
        clearFlag: 1,
        deleteFlag: '',
        zheng: 0,
        selectedAll: '',
        contLists: [],
        lostList: [{}, {}]
      }
    },
    computed: {
      isEmpty() {
        if (this.contLists.length === 0) {
          return true
        }
        return false
      },
      ...mapState(['collectionCheckedAll','position']),
    },
    activated() {
      this.zheng = 0
      this.getLists()
      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0)
        }
      })
    },
    mounted() {
      this.getLists()
      this.judgeAndOrIos()
      this.$nextTick(() => {
        console.log(window.innerHeight - parseFloat(this.$refs.nav.offsetHeight) + 'px')
        this.$refs.conts.style.height = window.innerHeight - parseFloat(this.$refs.nav.offsetHeight) + 'px'
      })
      this.$mescrollInt('collectMescroll', this.upCallback, () => {

      }, (obj) => {
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
      })
    },
    methods: {
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll(isLock)
      },
      // 调整只有失效商品的样式
      tiaozheng(){
        let x = 0
        let rel
        this.contLists.forEach((item)=>{
          if (item.gi_status === '221') {
            x += 1
          }
        })
        rel = x
        if (rel <= 0) {
          this.buzheng = false
          this.zhengppFlag = true
        } else {
          this.buzheng = true
          this.zhengppFlag = false
        }
      },
      // 判断是安卓还是苹果
      judgeAndOrIos(){
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // alert('是否是Android：'+isAndroid);
        // alert('是否是iOS：'+isiOS);
        if (isiOS) {
          this.zhengPFlag = true
        } else {
          this.zhengPFlag = false
        }
      },
      // 去商品详情
      gotoGoods(item){
        if (this.zheng == 0) {
          this.$router.push({path:'/goodsDetailed',query:{id:item.gspu_id}})
        }
      },
      // 清空失效商品
      clearLost(){
        let arr = []
        let b
        this.contLists.forEach((item) => {
          if (item.gi_status !== '221') {
            arr.push(item.fi_id)
          }
        })
        console.log(arr)
        b = arr.join(',')
        let self = this
        self.$ajax({
          method: 'delete',
          url: self.$apiGoods + 'gcFavoritesInfo/cancelFavoriteList',
          params: {
            fiIdArray: b
          }
        }).then(function (res) {
          if (res.data.code === '081') {
            self.getLists()
            self.deleteFlag = 0
            self.zheng = 0
          }
        })
      },
      // 判断是否选择要删除的商品
      judgeSelect() {
        for (let i = 0; i < this.contLists.length; i++) {
          if (this.contLists[i].selected === true) {
            return true
          }
        }
        this.$message('请选择商品！')
        return false
      },
      // 删除收藏商品
      deleteGoods() {
        if (this.judgeSelect()) {
          let arr = []
          let b
          this.contLists.forEach((item) => {
            if (item.selected === true) {
              arr.push(item.fi_id)
            }
          })
          console.log(arr)
          b = arr.join(',')
          let self = this
          self.$ajax({
            method: 'delete',
            url: self.$apiGoods + 'gcFavoritesInfo/cancelFavoriteList',
            params: {
              fiIdArray: b
            }
          }).then(function (res) {
            if (res.data.code === '081') {
              self.zheng = 0
              self.zhengSFlag = false
              self.getLists()
            }
          })
        }
      },
      // 获取收藏商品的
      getLists() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'gcFavoritesInfo/queryFavoriteList',
          params: {}
        }).then(function (res) {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].gi_status === '221') {
              res.data.data[i].selected = false
            }
          }
          self.contLists = res.data.data
          let a = 0
          self.contLists.forEach((item) => {
            if (item.gi_status !== '221') {
              a += 1
            }
          })
          self.indexN = a
          if (self.indexN >0) {
            self.deleteFlag = 1
          } else {
            self.deleteFlag = 0
          }
          self.tiaozheng()
          self.$nextTick(() => {
            if (!self.cScroll) {
              self.cScroll = new BScroll(self.$refs.conts, {
                click: true,
                probeType: 3
              })
            } else {
              self.cScroll.refresh()
            }
          })
        })
      },
      // 复选框选择
      change(e) {
        console.log(e)
        for (let i = 0; i < this.contLists.length; i++) {
          if (this.contLists[i].selected === false) {
            return this.selectedAll = false
          }
        }
        return this.selectedAll = true
      },
      changeAll(e) {
        this.contLists.forEach((i) => {
          if (i.gi_status === '221') {
            i.selected = e
          }
        })
      },
      // 整理&&完成
      zhengli() {
        this.zheng = !this.zheng
        if (this.zheng != 0) {
          this.zhengSFlag = true
          this.contLists.forEach((i) => {
            if (i.gi_status === '221') {
              i.selected = false
            }
          })
          this.selectedAll = false
        } else {
          this.zhengSFlag = false
        }
        this.$nextTick(()=>{
          this.cScroll.refresh()
        })
      },
      // 推荐
      upCallback: function(page) {
        let self = this;
        this.getListDataFromNet(page.num, page.size, function(curPageData) {
          self.$refs.recommend.more(curPageData,page.num,page.size)
          self.mescroll.endSuccess(curPageData.length)
        }, function() {
          //联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr();
        })
      },
      getListDataFromNet(pageNum,pageSize,successCallback,errorCallback) {
        let self = this;
        self.$ajax({
          method: 'post',
          url:self.$apiGoods + 'goodsSearch/goodsRecommendationList',
          params: {
            page: pageNum,
            rows: pageSize
          },
          headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).then(function (response) {
          successCallback&&successCallback(response.data.data);//成功回调
        })
      }
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .empty{
    position: fixed;
    top: 1.28rem;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #666;
    background-color: #f2f2f2;
    height: "calc(100vh - %s)" % $height-header;
    z-index: 1;
  }
  .imgs{
    margin-top: 1.06rem;
  }
  .imgs img{
    width: 2.66rem;
    height: 2.66rem;
  }
  .empty .words{
    margin-top: .26rem;
    color: #777;
    font-size: .37rem;
  }
  .goToHome{
    width: 4.26rem;
    height: 1.17rem;
    line-height: 1.17rem;
    margin: .66rem auto 0;
    background-color: #F70057;
    border-radius: .26rem;
    color: #fff;
    font-size: .4rem;
  }
  /*我的推荐--开始*/
  .title{
    height: 1rem;
    width: 100%;
    position: relative;
    display: flex;
    background: #f2f2f2;
    justify-content: center;
    align-items: center;
    padding: .2rem 0;
  }
  .title img{
    width: 55%;
  }
  .navbar{
    position: fixed;
    top: 0;
    width: 100%;
    height: 1.28rem;
    border-bottom: 1px solid #f2f2f2;
    background: rgb(244, 0, 87);
    display: flex;
    align-items: center;
    z-index: 1;
  }
  .topLeft{
    padding-left: .36rem;
    padding-top: .1rem;
  }
  .topCenter{
    margin-left: 3.7rem;
    font-size: .48rem;
    color: #fff;
  }
  .topRight{
    margin-left: 2.9rem;
    font-size: .37rem;
    color: #fff;
    padding-top: .07rem;
    padding-right: .1rem;
  }
  /*内容列表*/
  .contList{
    position: fixed;
    top: 1.28rem;
    bottom: 0;
    width: 100%;
    height: "calc(100vh - %s)" % $height-header;
    background-color: #f2f2f2;
  }
  .zhengpp{
    margin-top: 0 !important;
  }
  .zhengpP{
    padding-bottom: 1.5rem !important;
  }
  .zhengS{
    padding-bottom: 1.5rem !important;
  }
  .zhengL{
    margin-top: 0 !important;
    padding-bottom: 1.5rem !important;
  }
  .contList ul{
    /*padding-top: .26rem;*/
    /*padding-bottom: 1.5rem;*/
    background-color: #f2f2f2;
  }
  .contList li{
    padding: .26rem;
    background-color: #fff;
    margin-bottom: .05rem;
    display: flex;
    align-items: center;
  }
  .checkbox{
    margin-right: .26rem;
  }
  .contList li .lefter{
    width: 2.4rem;
    height: 2.4rem;
  }
  .contList li .lefter img{
    width: 2.4rem;
    height: 2.4rem;
  }
  .contList li .righter{
    width: 0;
    height: 2.4rem;
    flex-grow: 1;
    margin-left: .24rem;
    padding: .08rem 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .contList li .righter .text{
    font-size: .35rem;
    color: #666;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }
  .contList li .righter .price span{
    color: #666;
    font-size: .35rem;
  }
  .contList li .righter .price strong{
    color: #F70057;
    font-size: .37rem;
  }
  .contList ul.lose{
    margin-top: 1.33rem;
  }
  ul.lose .textLose{
    color: #23262F;
    font-size: .32rem;
  }
  ul.lose .lost{
    font-size: .29rem;
    color: #666;
  }
  ul.lose li.title{
    margin-bottom: .03rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ul.lose li.title .left{
    margin-left: .37rem;
    color: #666;
    font-size: .35rem;
  }
  ul.lose li.title .right{
    margin-right: .5rem;
    color: #F8085C;
    font-size: .32rem;
  }
  ul.lose .lefter{
    position: relative;
    border-radius: .13rem;
  }
  ul.lose .lefter img{
    border-radius: .13rem;
  }
  ul.lose .lefter .mask{
    border-radius: .13rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, .3);
    text-align: center;
    line-height: 2.4rem;
    font-size: .32rem;
    color: #fff;
  }
  /*底部删除按钮*/
  .clearFixed{
    height: 1.38rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    border-top: 1px solid #f2f2f2;
    background-color: #fff;
    padding: 0 .26rem;
    z-index: 100;
  }
  .clearFixed .checkAll{
    display: flex;
  }
  .clearFixed .checkAll span{
    margin-left: .21rem;
    color: #999;
    font-size: .37rem;
  }
  .clearFixed .clearBtn{
    width: 2.66rem;
    height: .96rem;
    color: #fff;
    background-color: #F70057;
    border-radius: .13rem;
    text-align: center;
    line-height: .96rem;
    font-size: .42rem;
  }
  .top {
    z-index: 0 !important;
  }
</style>

