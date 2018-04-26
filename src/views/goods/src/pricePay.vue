<template>
  <div class="pricePay">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div class="bg" v-if="show" @click="close" @touchmove.prevent=""></div>
    </transition>
    <transition enter-active-class="animated fadeInUpBig" leave-active-class="animated fadeOutDownBig">
      <div class="main" v-if="show">
        <!-- 余额支付 -->
        <div class="paymentModel">
          <div class="paymentWindow" id="balancePayment">
            <h1>
              <span><mu-icon value="close"/></span>
              请输入支付密码
            </h1>
            <div class="paymentWindowPassword">
              <ul>
                <li><input type="password" class="pwdShow" v-model="inputList[0].value" disabled></li>
                <li><input type="password" class="pwdShow" v-model="inputList[1].value" disabled></li>
                <li><input type="password" class="pwdShow" v-model="inputList[2].value" disabled></li>
                <li><input type="password" class="pwdShow" v-model="inputList[3].value" disabled></li>
                <li><input type="password" class="pwdShow" v-model="inputList[4].value" disabled></li>
                <li><input type="password" class="pwdShow" v-model="inputList[5].value" disabled></li>
              </ul>
              <!--<a>忘记密码?</a>-->
              <div style=" clear: both"></div>
            </div>
            <ul class="passwordInput">
              <li @click="inputPwd">1</li>
              <li @click="inputPwd">2</li>
              <li @click="inputPwd">3</li>
              <li @click="inputPwd">4</li>
              <li @click="inputPwd">5</li>
              <li @click="inputPwd">6</li>
              <li @click="inputPwd">7</li>
              <li @click="inputPwd">8</li>
              <li @click="inputPwd">9</li>
              <li style="background: #eee;color: #666"></li>
              <li @click="inputPwd">0</li>
              <li style="background: #eee;color: #666; display: flex;justify-content: center;align-items: center" @click="deletePwd">
                <img src="../../../assets/img/back@2x.png" style="height:.5rem; opacity: .5">
              </li>
              <p style="clear: both"></p>
            </ul>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: "price-pay",
    props: {
      show: Boolean,
    },
    data() {
      return {
        inputList: [
          {
            value: ''
          }, {
            value: ''
          }, {
            value: ''
          }, {
            value: ''
          }, {
            value: ''
          }, {
            value: ''
          }
        ]
      }
    },
    methods: {
      close() {
        this.$emit('close')
        // this.show = false
      },
      //键入密码
      inputPwd: function (e) {
        //当前点击的数字
        let a = e.target.innerHTML;
        //input列表
        let pwdList = this.inputList
        //为上面展示的密码赋值
        for (let i = 0; i < pwdList.length; i++) {
          if (pwdList[i].value === '') {
            pwdList[i].value = a;
            //倒数第二位若不为空，确认付款
            if (pwdList[pwdList.length - 1].value !== '') {
              let payPassword = "";
              for (let a = 0; a < pwdList.length; a++) {
                payPassword += pwdList[a].value
              }
              alert(payPassword)
              //提交支付请求
              //this.subPayment(payPassword)
            }
            return false
          }
        }
      },
      deletePwd: function () {
        //input列表
        let pwdList = this.inputList;
        //已输入密码数量（此处初始化）
        let a = 0;
        for (let i = 0; i < pwdList.length; i++) {
          if (pwdList[i].value !== '') {
            a = i
          }
        }
        pwdList[a].value = ""
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
    height: 8.5rem;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 102;
  }
  .paymentModel {

  }

  .paymentWindow {


  }

  .paymentWindow > h1 {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #333;
    padding: 6px 13px;
    border-bottom: solid 1px #ddd;
  }

  .paymentWindow > h1 > span {
    float: left;
    font-size: 14px;
    color: #999;
  }

  .paymentWindowPassword {
    padding: 20px 13px;
  }

  .paymentWindowPassword > a {
    float: right;
    font-size: 14px;
    margin-top: 8px;
    color: #48ace6;
  }

  .paymentWindowPassword > ul > li {
    float: left;
    width: 16.5%;
    height: 30px;
    border: solid 1px #ddd;
    border-left: none;
  }

  .paymentWindowPassword > ul > li:first-child {
    border-left: solid 1px #ddd;
    border-bottom-left-radius: 5px;
    border-top-left-radius: 5px;
  }

  .paymentWindowPassword > ul > li:last-child {
    border-right: solid 1px #ddd;
    border-bottom-right-radius: 5px;
    border-top-right-radius: 5px;
  }

  .paymentWindowPassword > ul > li > input {
    width: 100%;
    height: 100%;
    line-height: 30px;
    color: #333;
    border: none;
    background: none;
    text-align: center;
    font-size: 20px;

  }
  .passwordInput{
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  .passwordInput > li {
    float: left;
    width: 33.3%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    border-bottom: solid 1px #ddd;
    border-right: solid 1px #ddd;
  }

  .passwordInput > li:active {
    animation: myfirst .3s;
    -webkit-animation: myfirst .3s; /* Safari and Chrome */
  }
  @keyframes myfirst
  {
    from {background:rgba(208,0,13,0.2);}
    to {background:#eee;}
  }

  @-webkit-keyframes myfirst /* Safari and Chrome */
  {
    from {background:rgba(208,0,13,0.2);}
    to {background:#eee;}
  }
  .passwordInput>li:nth-child(1),.passwordInput>li:nth-child(2),.passwordInput>li:nth-child(3){
    border-top: 1px solid #ddd;
  }
</style>
