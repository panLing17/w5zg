<template lang="pug">
  .wrap(ref="scroll")
    .content
      img(src="../../../../../assets/img/01_index_1.png", @load="imgLoad++")
      .btn(@click="toNext1")
        img(:src="!isPartake?require('../../../../../assets/img/01_index_2_1.jpg'):require('../../../../../assets/img/01_index_2_2.jpg')", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_3.png", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_4.jpg", @load="imgLoad++")
      img(src="../../../../../assets/img/01_index_5.png", @load="imgLoad++")
      .tabWrapper(@click="popShow=true")
        .tabBtn 查看具体活动安排 >
      .btn(@click="toNext2")
        img(:src="!isPartake?require('../../../../../assets/img/01_index_8_1.png'):require('../../../../../assets/img/01_index_8_2.png')", @load="imgLoad++")
    transition(name="fade")
      .mask(@click="popShow=false", v-if="popShow", @touchmove.stop="")
    transition(name="fade")
      .popWrapper(v-if="popShow", @touchmove.stop="")
        .temp2(@touchmove.stop="")
          .titleBtn 活动安排
          .info
            .left 1)
            .right 本活动送1万双耐克鞋，限3万人报名，按领券数量排名，前1万人每人立得1双价值1200元耐克。
          .info
            .left 2)
            .right 即日起开始报名；活动起始时间：7月3日-10日
          .info
            .left 3)
            .right 领取时间：7月20日-7月27日，早9:00-18:00
          .info
            .left 4)
            .right 领鞋地址：现代快报大厦18楼、金陵晚报虎凤蝶发行部
          .info.last
            .left 5)
            .right 具体参与规则请关注“<span>万物直供商城</span>”公众号查看
        .closeBtn(@click.prevent="popShow=false", @touchmove.stop="")
          img.closeBtnImg(src="../../../../../assets/img/01_index_10_rules_close.png")
</template>

<script>
  import BScroll from 'better-scroll'
  import shareImg from '../../../../../assets/img/applogo@2x.png'
  export default {
    name: "index",
    data () {
      return {
        isPartake: false,
        popShow: false,
        imgLoad: 0
      }
    },
    watch: {
      imgLoad (val) {
        if (val == 6) {
          this.scroll = new BScroll(this.$refs.scroll, {
            click: true
          })
        }
      }
    },
    created () {
      this.authority()
      this.saveUrl()
      this.judeg()

    },
    mounted () {
      document.title = '送耐克活动';
      this.tongji()
      this.loadShare()

    },
    methods: {
      //百度统计
      tongji () {
        var _hmt = _hmt || [];
        (function() {
          var hm = document.createElement("script");
          hm.src = "https://hm.baidu.com/hm.js?4b645c94af05d48604fd84cccb5cc2aa";
          var s = document.getElementsByTagName("script")[0];
          s.parentNode.insertBefore(hm, s);
        })();
      },
      /*
      * 判断来者身份,originatorId 发起人ID   selfId 被分享者ID
      *   1. 如果originatorId==selfId => 个人中心 /marketing/assisting
      *   2. 如果originatorId!=selfId => 助力 /marketing/personal
      *   3. originatorId 有    selfId 没有 => 助力
      *   4. originatorId 没有  selfId 有 => 个人中心
      *   5. originatorId 没有  selfId 没有 => 报名(不处理)
      * */
      authority () {
        let originatorId = this.$route.query.sharerId
        let selfId = localStorage.getItem('sharerId')
        let phone = localStorage.getItem('phone')
        let _this = this


        if (originatorId && originatorId.length>0) {
          if (selfId && selfId.length>0) {
            if (originatorId == selfId) {
              this.$router.replace('/marketing/assisting')
            } else {
              this.$router.replace('/marketing/personal')
            }
          } else {
            if (phone && phone.length === 11) {
              this.getSharerId (function (data) {
                if (data != '用户不存在') {
                  if (data == originatorId) {
                    _this.$router.replace('/marketing/assisting')
                  } else {
                    _this.$router.replace('/marketing/personal')
                  }
                } else {
                  _this.$router.replace('/marketing/personal')
                }
              })
            } else {
              _this.$router.replace('/marketing/personal')
            }
          }
        } else {
          if (selfId && selfId.length>0) {
            this.$router.replace('/marketing/assisting')
          } else if (phone && phone.length === 11) {
              this.getSharerId (function (data) {
              if (data != '用户不存在') {
                _this.$router.replace('/marketing/assisting')
              }
            })
          }
        }
      },
      // 分享
      loadShare () {
        let _this = this
        if (localStorage.getItem('sharerId') == 'undefined' || !localStorage.getItem('sharerId')) {
          if (localStorage.getItem('phone') && localStorage.getItem('phone').length === 11) {
            this.getSharerId(function (data) {
              if (data != '用户不存在') {
                _this.$initShare({
                  sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + data).replace(/\?*#/, "?#")
                })
              } else {
                _this.$initShare({
                  sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
                  shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
                  shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
                  link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
                })
              }
            })
          } else {
            this.$initShare({
              sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
              shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
              shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
              link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url')).replace(/\?*#/, "?#")
            })
          }
        } else {
          this.$initShare({
            sharePhoto: 'http://www.w5zg.cn/' + shareImg.substr(1),
            shareTitle: '震惊！5000元工会福利券和1万双耐克鞋等您领取',
            shareDesc: '金陵晚报/现代快报/万物直供联合举办！300大品牌商共同补贴工会福利事业',
            link: ('http://www.w5zg.cn/#/marketing/index?redirect_url='+localStorage.getItem('redirect_url') + '&sharerId=' + localStorage.getItem('sharerId')).replace(/\?*#/, "?#")
          })
        }
      },
      //验证是否是已报名用户
      judeg () {
        if (localStorage.getItem('phone') && localStorage.getItem('phone').length === 11) {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiTransaction + 'netcard/presentShoes/join/isJoinActivity',
            params: {
              mobile: localStorage.getItem('phone')
            }
          }).then(function (response) {
            if (response) {
              if (response.data.data == 1) {
                self.isPartake = true
              }
            }
          })

          if (localStorage.getItem('sharerId') == 'undefined' || !localStorage.getItem('sharerId')) {
            this.getSharerId()
          }
        }
      },
      //获取sharerId
      getSharerId (callback){
        let self = this
        self.$ajax({
          method: 'post',
          url: self.$apiMember + 'member/queryMemberIdByMobile',
          params: {
            mobile: localStorage.getItem('phone')
          }
        }).then(function (response) {
          if (response) {
            if (response.data.data != '用户不存在') {
              localStorage.setItem('sharerId', response.data.data)
            }
            callback && callback(response.data.data)
          }
        })
      },
      //保存URL
      saveUrl () {
        if (this.$route.query.redirect_url) {
          localStorage.setItem('redirect_url', this.$route.query.redirect_url)
        }

      },
      //打开弹窗
      showPop (index) {
        this.temp = index;
        this.popShow = true;
      },
      //上面按钮判断走向
      toNext1 () {
        if (!this.isPartake) {
          this.$router.push('/marketing/movies')
        } else {
          this.$router.push('/marketing/assisting')
        }
      },
      //下面按钮判断走向
      toNext2 () {
        if (!this.isPartake) {
          this.$router.push('/marketing/movies')
        } else {
          this.$router.push('/home')
        }
      }
    }
  }
</script>

<style scoped>
  .wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .content {
    font-size: 0;
  }
  img {
    width: 100%;
    pointer-events: none;
  }
  .tabWrapper {
    background: #ff2d4a;
  }
  .tabBtn {
    width: 5.15rem;
    height: .86rem;
    background: #d80014;
    border-radius: .5rem;
    color: #fff;
    line-height: .86rem;
    font-size: .4rem;
    text-align: center;
    margin: 0 auto;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,.5);
  }
  .popWrapper {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    z-index: 10;
  }
  .temp1, .temp2 {
    width: 8.56rem;
    margin: 0 auto;
    background: #fff;
    border-radius: .26rem;
    padding: .53rem .53rem 1.2rem;
  }
  .titleBtn {
    border-radius: .5rem;
    border: 1px solid #ff2d4a;
    line-height: .8rem;
    width: 2.46rem;
    text-align: center;
    color: #ff2d4a;
    font-size: .37rem;
  }
  .desc1, .desc2 {
    line-height: 1.5;
    font-size: .32rem;
  }
  .desc1 {
    margin-top: .4rem;
  }
  .desc2 {
    margin-top: .53rem;
  }
  .closeBtn {
    text-align: center;
    font-size: 0;
    margin-top: .4rem;
  }
  .closeBtnImg {
    width: 1rem;
  }
  .info {
    display: flex;
    align-content: flex-start;
    line-height: 1.5;
    margin-top: .4rem;
  }
  .info .left {
    color: #666;
    align-self: flex-start;
  }
  .right span {
    color: #ff2d4a;
    margin: 0;
  }
  .info .right {
    color: #333;
    margin-left: .1rem;
  }
</style>
