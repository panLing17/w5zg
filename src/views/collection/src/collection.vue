<template lang="pug">
  .wrapNav
    .navbar(ref="nav")
      .topLeft
        img(src="../../../assets/img/ic_order_return.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter 收藏夹
      .topRight(@click="zhengli", v-if="buzheng") {{zheng == 0 ?'整理':'完成'}}
    .contList(ref="conts", v-show="contsFlag").mescroll#mescrollConts
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
          li(v-for="item in contLists", v-if="item.gi_status !== '221'")
            .lefter(@click="gotoGoods(item)")
              .mask 失效
              img(:src="item.gi_image_url | img-filter", @click.prevent="")
            .righter(@click="gotoGoods(item)")
              .textLose {{item.gi_name}}
              .lost 该商品已失效，请重新选择
    emptys(v-if="!contsFlag")
    .clearFixed(v-if="zheng != 0")
      .checkAll
        w-checkbox(@change="changeAll", v-model="selectedAll")
        span 全选
      .clearBtn(@click="deleteGoods()") 删除
</template>

<script>
  import {mapState} from 'vuex'
  //import BScroll from 'better-scroll'
  import emptys from './emptys'
  export default {
    name: "collection",
    components:{emptys},
    data() {
      return {
        contsFlag: true,
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
    beforeDestroy(){
      this.mescroll.hideTopBtn()
      this.mescroll.destroy()
    },
    activated() {
      this.zheng = 0
      this.getLists()
      this.zhengSFlag = false
      this.quchuStyle()

      this.position.forEach((now) => {
        if (now.path === this.$route.path) {
          this.mescroll.scrollTo(now.y, 0)
        }
      })
    },
    mounted() {
      this.getLists()
      //this.judgeAndOrIos()

      this.$mescrollInt('mescrollConts', this.upCallback, ()=>{

      },(obj)=>{
        this.$store.commit('setPosition', {
          path: this.$route.path,
          y: obj.preScrollY
        })
        this.quchuStyle()
      },this.downCallback,true)


    },
    methods: {
      downCallback(){
        this.getLists()
        this.mescroll.resetUpScroll()
      },
      // 锁定或者解锁上拉加载
      lockUpDown (isLock) {
        this.mescroll.lockUpScroll(isLock)
      },
      quchuStyle(){
        let mescrollUpwarp = document.getElementsByClassName('mescroll-upwarp')[0]
        mescrollUpwarp.style.display = 'none'
        //this.$refs.conts.style.height = window.innerHeight - parseFloat(this.$refs.nav.offsetHeight) + 'px'
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
          url: self.$apiGoods + 'gcFavoritesInfo/v2/cancelFavoriteList',
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
          let indexArr = []
          this.contLists.forEach((item,index) => {
            if (item.selected === true) {
              arr.push(item.fi_id)
              indexArr.push(index)
            }
          })
          for(let i=indexArr.length-1;i>=0;i--){
            this.contLists.splice(indexArr[i], 1)
          }
          console.log(arr)
          b = arr.join(',')
          let self = this
          self.$ajax({
            method: 'delete',
            url: self.$apiGoods + 'gcFavoritesInfo/v2/cancelFavoriteList',
            params: {
              fiIdArray: b
            }
          }).then(function (res) {
            if (res.data.code === '081') {
              self.zheng = 0
              self.zhengSFlag = false
              //self.getLists()
            }
          })
        }
      },
      // 获取收藏商品的
      getLists() {
        let self = this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'gcFavoritesInfo/v2/queryFavoriteList',
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
          if (self.contLists.length === 0) {
            self.contsFlag = false
          } else {
            self.contsFlag = true
          }
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
          //this.mescroll.lockDownScroll(true)
          this.zhengSFlag = true
          this.contLists.forEach((i) => {
            if (i.gi_status === '221') {
              i.selected = false
            }
          })
          this.selectedAll = false
        } else {
          //this.mescroll.lockDownScroll(false)
          this.zhengSFlag = false
        }
        // this.$nextTick(()=>{
        //   this.cScroll.refresh()
        // })
      },

      upCallback: function () {
        this.mescroll.endErr()
      },
    }
  }
</script>

<style scoped lang="stylus">
  #mescrollConts{
    position: fixed;
    top: 1.28rem;
    bottom: 0;
    height: auto;
  }
  @import '~assets/stylus/variable.styl'
  .wrapNav{
    position: fixed;
    top: 0;
    bottom: 0;
    background-color: #f2f2f2;
  }
  .navbar{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.28rem;
    border-bottom: 1px solid #f2f2f2;
    background: rgb(244, 0, 87);
    display: flex;
    align-items: center;
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
    //position: fixed;
    //top: 1.28rem;
    //bottom: 0;
    //margin-top: 1.28rem;
    width: 100%;
    //height: "calc(100vh - %s)" % $height-header;
    background-color: #f2f2f2;
    /*z-index: 1;*/
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
    width: 2.4rem;
    height: 2.4rem;
  }
  ul.lose .lefter img{
    border-radius: .13rem;
    width: 2.4rem;
    height: 2.4rem;
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

