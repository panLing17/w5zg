<template lang="pug">
  .wrap
    .content
      .contentTop
        img.contentTopImg(src="../../../../../assets/img/01_index_1.png")
      .contentCenter(:class="{'margin-1': temp==1 || temp==5 }")
        img.contentCenterImg(src="../../../../../assets/img/13_helper_notice_bg.png")
        .temp1(v-if="temp==1")
          .temp1Desc 您还没参加领鞋活动哦
          .temp1Btn
            img.temp1BtnImg(src="../../../../../assets/img/06_user_error_btn.png")
        .temp2(v-if="temp==2")
          .info
            img.avatar
            .infoDesc 发起人：
            .infoName 张三(微信名)
          .temp2Desc
            p 已经为TA助力过啦~
            p 您还有3次领券机会，
            p 快去帮助其他小伙伴领券吧！
          .temp2Btn
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_join_btn.png")
        .temp3(v-if="temp==3")
          .info
            img.avatar
            .infoDesc 发起人：
            .infoName 张三(微信名)
          .temp3Desc
            p 已经为TA助力过啦~
            p 您的助力次数已达到上限！
          .temp2Btn
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_join_btn.png")
        .temp4(v-if="temp==4")
          .temp4Desc
            p 您已参加免费领鞋活动，
            p 不能帮其他小伙伴领券啦～
          .temp2Btn
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_user_btn.png")
        .temp5(v-if="temp==5")
          .info
            img.avatar
            .infoDesc 发起人：
            .infoName 张三(微信名)
          .temp3Desc
            p 您的好友想要领1200元的耐克鞋
            p 快来帮TA免费拿吧！
          .temp2Btn
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_help_btn.png")
        .temp6(v-if="temp==6")
          .info
            img.avatar
            .infoDesc 发起人：
            .infoName 张三(微信名)
          .temp3Desc
            p Sorry，
            p 您的助力次数已达到上限！
          .temp2Btn
            img.temp2BtnImg(src="../../../../../assets/img/13_helper_notice_join_btn.png")
      .contentBottom
        .temp2Bottom(v-if="temp==2 || temp==3 || temp==4 || temp==6")
          .temp2BottomDesc 或者还可以先逛逛商城，使用工会福利现金券
          .temp2BottomBtn
            img.temp2BottomBtnImg(src="../../../../../assets/img/06_user_not_started_btn.png")
</template>

<script>
  /*
  * temp 模板类型
  *   1：未参加用户-误点个人中心(默认)
  *   2：a-绑定-未达上限-普通用户
  *   3：b-绑定-已达上限-普通用户
  *   4：c-好友是发起人
  *   5：e-非绑定-未达上限-普通用户
  *   6：f-非绑定-已达上限-普通用户
  * */
  export default {
    name: "personal",
    data () {
      return {
        temp: 6
      }
    },
    mounted () {
      document.title = "个人中心"
    }
  }
</script>

<style scoped>
  .wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #ff314f;
  }
  .contentTop {
    font-size: 0;
  }
  .contentTopImg {
    width: 100%;
  }
  .contentCenter {
    font-size: 0;
    position: relative;
  }
  .margin-1 {
    margin-top: 1rem;
  }
  .contentCenterImg {
    width: 100%;
  }
  .temp1, .temp2, .temp3, .temp4, .temp5, .temp6 {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .temp1Desc {
    font-size: .48rem;
    color: #333;
    text-align: center;
    margin-top: 1.5rem;
  }
  .temp1Btn, .temp2Btn {
    font-size: 0;
    text-align: center;
    position: absolute;
    bottom: .6rem;
    left: 0;
    width: 100%;
  }
  .temp1BtnImg {
    width: 7rem;
  }
  .info {
    width: 5.84rem;
    height: 1.56rem;
    background: #ffe6bf;
    border-radius: 0.06rem;
    margin: 0.68rem auto 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    width: 1.33rem;
    height: 1.33rem;
    border-radius: 50%;
    background: black;
  }
  .infoDesc, .infoName {
    font-size: .32rem;
    color: #000;
    margin-left: 0.13rem;
    font-weight: bold;
  }
  .infoName {
    margin-left: 0;
  }
  .temp2Desc, .temp3Desc, .temp4Desc {
    text-align: center;
    font-size: .34rem;
    color: #333;
    margin-top: .38rem;
    line-height: 1.5;
  }
  .temp2BtnImg {
    width: 5rem;
  }
  .temp2BottomDesc {
    color: #fff;
    text-align: center;
    font-size: .32rem;
  }
  .temp2BottomBtn {
    text-align: center;
    font-size: 0;
  }
  .temp2BottomBtnImg {
    width: 9.1rem;
    margin-top: .2rem;
  }
  .temp4Desc {
    margin-top: 1.84rem;
  }
  img {
    pointer-events: none;
  }
</style>
