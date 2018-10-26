<template lang="pug">
  .wrapPage
    <!--nav-bar-->
      <!--.topLeft(slot="left")-->
        <!--img(src="../../../assets/img/location.png")-->
        <!--span.city {{cityName}}-->
      <!--.topCenter(slot="center")-->
    .searchInput(@click="$router.push('/search')")
      img(src="../../../assets/img/searchInput搜索图标@2x.png").leftImg
      input(type="text", :placeholder="placeholder", unselectable='on')
      <!--img(src="../../../assets/img/home扫描@2x.png" v-show="true" @click="scan()").rightImg-->
      <!--.topRight(slot="right")-->
        <!--img(src="../../../assets/img/msg_0.png" v-show="false")-->
    .content(v-loading="loadingFlag < 2")
      .left(ref='lefters')
        ul
          li(v-for="(item,index) in pageName" :class="{active:index == num}" @click="tab(item.gc_name,index,item.gc_id)") {{item.gc_name}}
      .right(ref='righters')
        ul.tabs(ref="tabs")
          li.tabsList(v-for="(item,index) in productList")
            .title
              span.point
              span.letter {{item.gc_name}}
            ul.listOfGoods
              li(v-for="items in item.childList" @click="$router.push({path:'/search',query:{key: items.gc_keywords, from: 1}})").wrapImg
                div(style="width: 1.9rem; height: 1.9rem; overflow: hidden; font-size: 0;", v-lazy-container="{ selector: 'img'}")
                  img(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+items.gc_icon+'?x-oss-process=style/compress'",
                  :data-error="require('../../../assets/img/default.png')",
                  :data-loading="require('../../../assets/img/default.png')",
                  :key="items.gc_icon")
                .words {{items.gc_name}}
</template>

<script>
  import BScroll from 'better-scroll'
  import {mapState} from 'vuex'
  export default {
    name: 'page',
    data () {
      return {
        goodsId: '',
        images: 123,
        flag: false,
        wordsShow: true,
        num: 0,
        cityName: this.$route.query.routeParams,
        pageName: [],
        productList: [],
        loadingFlag: 0,
        rightShowFlag: '', // 控制右侧内容的显隐
        tabNums: '',
        placeholder:''
      }
    },
    computed: mapState(['position']),
    created () {
      this.request()
      this._getDefaultWord()
    },
    beforeDestroy () {
      this.mescroll.hideTopBtn();
      this.mescroll.destroy()
    },
    mounted () {
      // 判断显示城市的字数
      //this.judgeCityNum()
      // 一级分类
      //this.request()
      // 判断显示当前城市
      //this.judgeCity()
    },
    methods: {
      //获取默认搜索词
      _getDefaultWord() {
        let self =this
        self.$ajax({
          method: 'get',
          url: self.$apiGoods + 'goodsSearch/v2/getDefaultSeWord',
          params: {
          }
        }).then(function(res){
          self.placeholder = res.data.data
        })
      },
      keepState () {
        if (this.$route.query.tabNum == undefined) {
          this.secondLevel(this.pageName[0].gc_id)
        } else {
          this.num = this.$route.query.tabNum
          this.secondLevel(this.pageName[this.num].gc_id)
        }
      },
      // 判断显示城市的字数
      judgeCityNum () {
        let citys = document.getElementsByClassName('city')[0]
        if (citys.innerText.length === 2) {
          citys.style.fontSize = 0.4 + 'rem'
        }
        if (citys.innerText.length === 3) {
          citys.style.fontSize = 0.2 + 'rem'
        }
        if (citys.innerText.length === 4) {
          citys.style.fontSize = 0.35 + 'rem'
        }
      },
      // 判断显示当前的城市
      judgeCity () {
        if (this.$route.query.routeParams) {
          this.cityName = this.$route.query.routeParams
        } else {
          this.cityName = '南京'
        }
      },

      goToCitySearch: function () {
        this.$router.push({
          name: '城市搜索',
          query: {
            routeParams: 2
          }
        })
      },
      // 扫描
      scan () {
        // let self = this
        // let _this = this
        // wx.scanQRCode({
        //   desc: 'scanQRCode desc',
        //   needResult: 0, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        //   scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码，默认二者都有
        //   success: function (res) {
        //     // alert(res.resultStr)
        //     // let id = _this.GetQueryString(res.resultStr, 'containerId')
        //     // _this.$ajax({
        //     //   method: 'post',
        //     //   url: 'sweep/sweepResult',
        //     //   params: {
        //     //     containerId: id
        //     //   },
        //     //   headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        //     // }).then(function (response) {
        //     //   response.data.code = response.data.code.toString()
        //     //   if (response.data.code === '100') {
        //     //     _this.$message.success('扫码成功')
        //     //   }
        //     // })
        //   },
        //   error: function (res) {
        //     if (res.errMsg.indexOf('function_not_exist') > 0) {
        //
        //     }
        //   }
        // })
      },

      // 请求右边二三级分类
      secondLevel (id) {
        let self = this
        self.$ajax({
          method: 'post',
          url: this.$apiGoods + 'goodsClass/class/firstId',
          params: {firstId: id}
        }).then(function (res) {
          self.productList = res.data.data
          self.$nextTick(()=>{
            if (!self.rScroll) {
              self.rScroll = new BScroll(self.$refs.righters, {
                click: true,
                probeType: 3
              })
              self.$store.state.position.forEach((now) => {
                if (now.path === self.$route.path + '2') {
                  self.rScroll.scrollTo(0, now.y, 0);
                }
              })
              self.rScroll.on('touchEnd', (pos) => {
                self.$store.commit('setPosition', {
                  path: self.$route.path + '2',
                  y: pos.y
                })
              })
            }
            else {
              self.rScroll.refresh()
            }
            self.loadingFlag += 1
          })
        })
      },
      // 点击左侧一级分类切换右边二三级
      tab (item, index, id) {
        //this.flag = false
        //this.wordsShow = true
        this.num = index
        this.rScroll.scrollTo(0, 0);
        this.$router.replace({path:'/page',query:{tabNum:index}})
        this.secondLevel(id)
      },

      // 展示左侧商品导航
      request () {
        let self = this
        self.$ajax({
          method: 'post',
          url: this.$apiGoods + 'goodsClass/class/hierarchy',
          params: {hierarchy: 1}
        }).then(function (res) {
          self.pageName = res.data.data
          self.$nextTick(() => {
            if (!self.lScroll)  {
              self.lScroll = new BScroll(self.$refs.lefters, {
                click: true,
                probeType: 3
              })
              self.$store.state.position.forEach((now) => {
                if (now.path === self.$route.path + '1') {
                  self.lScroll.scrollTo(0, now.y, 0);
                }
              })
              self.lScroll.on('scroll', function (pos) {
                self.$store.commit('setPosition', {
                  path: self.$route.path + '1',
                  y: pos.y
                })
              })
            }
            self.loadingFlag += 1
          })
          // 第一个二级分类
          self.keepState()
        })
      }

    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  /*品牌名的页面--开始*/
  .styles .title{
    background-color: rgb(242,242,242);
    margin: 0 .3rem;
    padding-left: .2rem;
    font-weight: bold;
  }
  .styles ul.tabs ul.listOfGoods{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start !important;
    margin: 0 .3rem !important;
    background-color: rgb(242,242,242);
    padding: .3rem .2rem !important;
  }
  .styles ul.tabs ul.listOfGoods li.wrapImg{
    width: 33%;
    background-color: #fff;
    margin-left: 0 !important;
    margin-right: 0 !important;
    margin-bottom: 1px !important;
    text-align: center;
  }
  /*品牌名的页面--结束*/
  .active{
    background-color: #fff !important;
    color: rgb(244,0,87) !important;
  }
  .wrapPage{
    background-color: #fff;
    /*width: 100%;
    height: 100vh;*/
    /*overflow: hidden;*/
    /*-webkit-overflow-scrolling: touch;*/
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*bottom: 0;*/
  }
  .page{
    /*width: 100%;*/
    /*height: 100vh;*/
    /*background: rgb(242,242,242);*/
    /*overflow: hidden;*/
    /*position: fixed;*/
  }
  /*顶部搜索--开始*/
  .topLeft{
    width: 1.8rem;
  }
  .topLeft img{
    width: .3rem;
    vertical-align: middle;
    margin-left: .1rem;
  }
  .topLeft .city{
    width: 1rem;
    display: inline-block;
    vertical-align: middle;
    font-weight: 400;
    color: rgb(52,52,52);
    margin-left: .2rem;
    word-break: break-all;
  }
  .topCenter{
    position: relative;
  }
  /*搜索框样式--开始*/
  .searchInput{
    width: 8rem;
    height: 1.3rem;
    margin 0 auto;
    background: #fff;
    line-height: .7rem;
    display: flex;
    align-items: center;
    position relative
  }
  .searchInput img.leftImg{
    position absolute
    left .3rem;
    top: 50%;
    transform translateY(-50%)
    width: .45rem;
    vertical-align: middle;
  }
  .searchInput img.rightImg{
    width: .45rem;
    vertical-align: middle;
    margin-left: .2rem;
  }
  .searchInput input{
    border-radius: .9rem;
    padding-left: .8rem;
    background-color: rgb(238,238,238);
    width: 100%;
    height: .7rem;
    border: 0;
    outline: none;
    font-size: .3rem;
    margin-left: .2rem;

  }
  /*搜索框样式--结束*/
  .topRight{
    margin-right: .1rem;
  }
  .topRight img{
    width: .7rem;
    vertical-align: middle;
  }
  /*顶部搜索--结束*/
  /*中间内容部分左边--开始*/
  .content:after{
    content: '';
    display: block;
    clear: both;
  }
  .content{
    width: 100%;
    height: "calc(100vh - %s)" % ($height-footer+$height-header)
    overflow: hidden;
    background-color: #fff;
  }
  .content .left{
    width: 21%;
    height: 100%;
    float: left;
    background-color: rgb(242,242,242);
  }
  .content .left ul{
    /*height: calc(100% + 1px);*/
    /*height: 100%;*/
    /*padding-bottom: 3rem;*/
  }
  .content .left ul li{
    background-color: rgb(242,242,242);
    width: 100%;
    height: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    color: rgb(51,51,51);
    font-size: .4rem;
    font-weight: 600;
    border-bottom: 1px solid #fff;
  }
  /*中间内容左边--结束*/
  /*中间内容右边--开始*/
  .content .right{
    width: 79%;
    height: 100%;
    background-color: #fff;
    float: left;
  }
  .right ul.tabs{
    /*min-height: calc(100% + 1px);*/
    /*height: 100%;*/
    /*padding-top: .45rem;*/
    /*padding-bottom: 4rem;*/
  }
  .right ul.tabs .title{
    font-size: .4rem;
  }
  .right ul.tabs .title span.point{
    display: inline-block;
    width: .25rem;
    height: .25rem;
    background-color: rgb(244,0,87);
    border-radius: 50%;
    vertical-align: middle;
    margin: -.1rem .3rem 0 .3rem;
  }
  .right ul.tabs ul.listOfGoods{
    display: flex;
    flex-wrap: wrap;
    margin-top: .5rem;
    padding: 0 .3rem;
  }
  .right ul.tabs ul.listOfGoods li{
    width: 1.9rem;
    margin: 0 .2rem .4rem .3rem;
  }
  .right ul.tabs ul.listOfGoods li img{
    width: 1.9rem;
  }
  .right ul.tabs ul.listOfGoods li .words{
    text-align: center;
    color: rgb(153,153,153);
  }
  .right .tabsList:first-child {
    padding-top: .45rem;
  }
  /*中间内容右边--结束*/

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    transition: all .7s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateY(-30px);
    opacity: 0;
  }
</style>
