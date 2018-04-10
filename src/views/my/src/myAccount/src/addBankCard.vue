<template lang="pug">
  .addBankCard
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 添加银行卡
      .topRight(slot="right")
    .content
      .title 请绑定持卡人本人的银行卡
      .blockWrapper
        .block(@click="chooseShow=true")
          .left 开户行
          .right.choose
            input(type="text", readonly="readonly", v-model="chooseBank")
        .block
          .left 支行名称
          .right
            input(type="text", placeholder="请输入支行名称", v-model="form.branchName")
        .block
          .left 银行卡号
          .right
            input(type="number", placeholder="请输入银行卡号", v-model="form.bankCard")
      .title 持卡人信息
      .blockWrapper
        .block
          .left 持卡人
          .right
            input(type="text", placeholder="请输入持卡人姓名", v-model="form.bankCardOwnerName")
        .block
          .left 身份证号
          .right
            input(type="text", placeholder="请输入身份证号", v-model="form.bankCardOwnerIdentity")
        .block
          .left 手机号
          .right
            input(type="number", placeholder="请输入手机号", v-model="form.bankCardOwnerPhone")
      .bottomBtn(@click="save") 完成
    transition(name="fade")
      .mask(v-show="chooseShow", @click="chooseShow=false")
    transition(name="fold")
      .pickerBox(v-if="chooseShow")
        .controlBar
          .cancel(@click="chooseShow=false") 取消
          .confirm(@click="confirm") 确定
        .pickerContent
          i.top
          i.bottom
          ul.list
            li.item(v-for="(item,index) in bankList", :class="{'active':chooseActive===index}", @click="selectedBank(index,item.tb_id, item.tb_bank_name)") {{item.tb_bank_name}}
</template>

<script>
    export default {
      name: "addBankCard",
      data () {
        return {
          bankList: [
            {
              value:'CDB',
              text:'国家开发银行'
            },
            {
              value:'ICBC',
              text:'中国工商银行'
            },
            {
              value:'ABC',
              text:'中国农业银行'
            },
            {
              value:'BOC',
              text:'中国银行'
            },
            {
              value:'CCB',
              text:'中国建设银行'
            },
            {
              value:'PSBC',
              text:'中国邮政储蓄银行'
            },
            {
              value:'COMM',
              text:'交通银行'
            },
            {
              value:'CMB',
              text:'招商银行'
            },
            {
              value:'SPDB',
              text:'上海浦东发展银行'
            },
            {
              value:'CIB',
              text:'兴业银行'
            },
            {
              value:'HXBANK',
              text:'华夏银行'
            },
            {
              value:'GDB',
              text:'广东发展银行'
            },
            {
              value:'CMBC',
              text:'中国民生银行'
            },
            {
              value:'CITIC',
              text:'中信银行'
            },
            {
              value:'CEB',
              text:'中国光大银行'
            },
            {
              value:'EGBANK',
              text:'恒丰银行'
            },
            {
              value:'CZBANK',
              text:'浙商银行'
            },
            {
              value:'BOHAIB',
              text:'渤海银行'
            },
            {
              value:'SPABANK',
              text:'平安银行'
            },
            {
              value:'SHRCB',
              text:'上海农村商业银行'
            },
            {
              value:'YXCCB',
              text:'玉溪市商业银行'
            },
            {
              value:'YDRCB',
              text:'尧都农商行'
            },
            {
              value:'BJBANK',
              text:'北京银行'
            },
            {
              value:'SHBANK',
              text:'上海银行'
            },
            {
              value:'JSBANK',
              text:'江苏银行'
            },
            {
              value:'HZCB',
              text:'杭州银行'
            },
            {
              value:'NJCB',
              text:'南京银行'
            },
            {
              value:'NBBANK',
              text:'宁波银行'
            },
            {
              value:'HSBANK',
              text:'徽商银行'
            },
            {
              value:'CSCB',
              text:'长沙银行'
            },
            {
              value:'CDCB',
              text:'成都银行'
            },
            {
              value:'CQBANK',
              text:'重庆银行'
            },
            {
              value:'DLB',
              text:'大连银行'
            },
            {
              value:'NCB',
              text:'南昌银行'
            },
            {
              value:'FJHXBC',
              text:'福建海峡银行'
            },
            {
              value:'HKB',
              text:'汉口银行'
            },
            {
              value:'WZCB',
              text:'温州银行'
            },
            {
              value:'QDCCB',
              text:'青岛银行'
            },
            {
              value:'TZCB',
              text:'台州银行'
            },
            {
              value:'JXBANK',
              text:'嘉兴银行'
            },
            {
              value:'CSRCB',
              text:'常熟农村商业银行'
            },
            {
              value:'NHB',
              text:'南海农村信用联社'
            },
            {
              value:'CZRCB',
              text:'常州农村信用联社'
            },
            {
              value:'H3CB',
              text:'内蒙古银行'
            },
            {
              value:'SXCB',
              text:'绍兴银行'
            },
            {
              value:'SDEB',
              text:'顺德农商银行'
            },
            {
              value:'WJRCB',
              text:'吴江农商银行'
            },
            {
              value:'ZBCB',
              text:'齐商银行'
            },
            {
              value:'GYCB',
              text:'贵阳市商业银行'
            },
            {
              value:'ZYCBANK',
              text:'遵义市商业银行'
            },
            {
              value:'HZCCB',
              text:'湖州市商业银行'
            },
            {
              value:'DAQINGB',
              text:'龙江银行'
            },
            {
              value:'JINCHB',
              text:'晋城银行JCBANK'
            },
            {
              value:'ZJTLCB',
              text:'浙江泰隆商业银行'
            },
            {
              value:'GDRCC',
              text:'广东省农村信用社联合社'
            },
            {
              value:'DRCBCL',
              text:'东莞农村商业银行'
            },
            {
              value:'MTBANK',
              text:'浙江民泰商业银行'
            },
            {
              value:'GCB',
              text:'广州银行'
            },
            {
              value:'LYCB',
              text:'辽阳市商业银行'
            },
            {
              value:'JSRCU',
              text:'江苏省农村信用联合社'
            },
            {
              value:'LANGFB',
              text:'廊坊银行'
            },
            {
              value:'CZCB',
              text:'浙江稠州商业银行'
            },
            {
              value:'DYCB',
              text:'德阳商业银行'
            },
            {
              value:'JZBANK',
              text:'晋中市商业银行'
            },
            {
              value:'BOSZ',
              text:'苏州银行'
            },
            {
              value:'GLBANK',
              text:'桂林银行'
            },
            {
              value:'URMQCCB',
              text:'乌鲁木齐市商业银行'
            },
            {
              value:'CDRCB',
              text:'成都农商银行'
            },
            {
              value:'ZRCBANK',
              text:'张家港农村商业银行'
            },
            {
              value:'BOD',
              text:'东莞银行'
            },
            {
              value:'LSBANK',
              text:'莱商银行'
            },
            {
              value:'BJRCB',
              text:'北京农村商业银行'
            },
            {
              value:'TRCB',
              text:'天津农商银行'
            },
            {
              value:'SRBANK',
              text:'上饶银行'
            },
            {
              value:'FDB',
              text:'富滇银行'
            },
            {
              value:'CRCBANK',
              text:'重庆农村商业银行'
            },
            {
              value:'ASCB',
              text:'鞍山银行'
            },
            {
              value:'NXBANK',
              text:'宁夏银行'
            },
            {
              value:'BHB',
              text:'河北银行'
            },
            {
              value:'HRXJB',
              text:'华融湘江银行'
            },
            {
              value:'ZGCCB',
              text:'自贡市商业银行'
            },
            {
              value:'YNRCC',
              text:'云南省农村信用社'
            },
            {
              value:'JLBANK',
              text:'吉林银行'
            },
            {
              value:'DYCCB',
              text:'东营市商业银行'
            },
            {
              value:'KLB',
              text:'昆仑银行'
            },
            {
              value:'ORBANK',
              text:'鄂尔多斯银行'
            },
            {
              value:'XTB',
              text:'邢台银行'
            },
            {
              value:'JSB',
              text:'晋商银行'
            },
            {
              value:'TCCB',
              text:'天津银行'
            },
            {
              value:'BOYK',
              text:'营口银行'
            },
            {
              value:'JLRCU',
              text:'吉林农信'
            },
            {
              value:'SDRCU',
              text:'山东农信'
            },
            {
              value:'XABANK',
              text:'西安银行'
            },
            {
              value:'HBRCU',
              text:'河北省农村信用社'
            },
            {
              value:'NXRCU',
              text:'宁夏黄河农村商业银行'
            },
            {
              value:'GZRCU',
              text:'贵州省农村信用社'
            },
            {
              value:'FXCB',
              text:'阜新银行'
            },
            {
              value:'HBHSBANK',
              text:'湖北银行黄石分行'
            },
            {
              value:'ZJNX',
              text:'浙江省农村信用社联合社'
            },
            {
              value:'XXBANK',
              text:'新乡银行'
            },
            {
              value:'HBYCBANK',
              text:'湖北银行宜昌分行'
            },
            {
              value:'LSCCB',
              text:'乐山市商业银行'
            },
            {
              value:'TCRCB',
              text:'江苏太仓农村商业银行'
            },
            {
              value:'BZMD',
              text:'驻马店银行'
            },
            {
              value:'GZB',
              text:'赣州银行'
            },
            {
              value:'WRCB',
              text:'无锡农村商业银行'
            },
            {
              value:'BGB',
              text:'广西北部湾银行'
            },
            {
              value:'GRCB',
              text:'广州农商银行'
            },
            {
              value:'JRCB',
              text:'江苏江阴农村商业银行'
            },
            {
              value:'BOP',
              text:'平顶山银行'
            },
            {
              value:'TACCB',
              text:'泰安市商业银行'
            },
            {
              value:'CGNB',
              text:'南充市商业银行'
            },
            {
              value:'CCQTGB',
              text:'重庆三峡银行'
            },
            {
              value:'XLBANK',
              text:'中山小榄村镇银行'
            },
            {
              value:'HDBANK',
              text:'邯郸银行'
            },
            {
              value:'KORLABANK',
              text:'库尔勒市商业银行'
            },
            {
              value:'BOJZ',
              text:'锦州银行'
            },
            {
              value:'QLBANK',
              text:'齐鲁银行'
            },
            {
              value:'BOQH',
              text:'青海银行'
            },
            {
              value:'YQCCB',
              text:'阳泉银行'
            },
            {
              value:'SJBANK',
              text:'盛京银行'
            },
            {
              value:'FSCB',
              text:'抚顺银行'
            },
            {
              value:'ZZBANK',
              text:'郑州银行'
            },
            {
              value:'SRCB',
              text:'深圳农村商业银行'
            },
            {
              value:'BANKWF',
              text:'潍坊银行'
            },
            {
              value:'JJBANK',
              text:'九江银行'
            },
            {
              value:'JXRCU',
              text:'江西省农村信用'
            },
            {
              value:'HNRCU',
              text:'河南省农村信用'
            },
            {
              value:'GSRCU',
              text:'甘肃省农村信用'
            },
            {
              value:'SCRCU',
              text:'四川省农村信用'
            },
            {
              value:'GXRCU',
              text:'广西省农村信用'
            },
            {
              value:'SXRCCU',
              text:'陕西信合'
            },
            {
              value:'WHRCB',
              text:'武汉农村商业银行'
            },
            {
              value:'YBCCB',
              text:'宜宾市商业银行'
            },
            {
              value:'KSRB',
              text:'昆山农村商业银行'
            },
            {
              value:'SZSBK',
              text:'石嘴山银行'
            },
            {
              value:'HSBK',
              text:'衡水银行'
            },
            {
              value:'XYBANK',
              text:'信阳银行'
            },
            {
              value:'NBYZ',
              text:'鄞州银行'
            },
            {
              value:'ZJKCCB',
              text:'张家口市商业银行'
            },
            {
              value:'XCYH',
              text:'许昌银行'
            },
            {
              value:'JNBANK',
              text:'济宁银行'
            },
            {
              value:'CBKF',
              text:'开封市商业银行'
            },
            {
              value:'WHCCB',
              text:'威海市商业银行'
            },
            {
              value:'HBC',
              text:'湖北银行'
            },
            {
              value:'BOCD',
              text:'承德银行'
            },
            {
              value:'BODD',
              text:'丹东银行'
            },
            {
              value:'JHBANK',
              text:'金华银行'
            },
            {
              value:'BOCY',
              text:'朝阳银行'
            },
            {
              value:'LSBC',
              text:'临商银行'
            },
            {
              value:'BSB',
              text:'包商银行'
            },
            {
              value:'LZYH',
              text:'兰州银行'
            },
            {
              value:'BOZK',
              text:'周口银行'
            },
            {
              value:'DZBANK',
              text:'德州银行'
            },
            {
              value:'SCCB',
              text:'三门峡银行'
            },
            {
              value:'AYCB',
              text:'安阳银行'
            },
            {
              value:'ARCU',
              text:'安徽省农村信用社'
            },
            {
              value:'HURCB',
              text:'湖北省农村信用社'
            },
            {
              value:'HNRCC',
              text:'湖南省农村信用社'
            },
            {
              value:'NYNB',
              text:'广东南粤银行'
            },
            {
              value:'LYBANK',
              text:'洛阳银行'
            },
            {
              value:'NHQS',
              text:'农信银清算中心'
            },
            {
              value:'CBBQS',
              text:'城市商业银行资金清算中心'
            }
          ],
          chooseShow:false,
          chooseActive: -1,
          chooseBank:'',
          form: {
            bankId: '',
            branchName: '',
            bankCard: '',
            bankCardOwnerName: '',
            bankCardOwnerPhone: '',
            bankCardOwnerIdentity: ''
          }
        }
      },
      computed: {
      },
      mounted () {
        this.getBankList()
      },
      methods: {
        selectedBank (index, id, name) {
          this.chooseActive = index
          this.form.bankId = id
          this.chooseBank = name
        },
        confirm () {
          /* if (this.bankList[this.chooseActive]) {
            this.chooseBank = this.bankList[this.chooseActive].text;
          }else {
            this.chooseBank = '';
          } */
          this.chooseShow = false;
        },
        getBankList () {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiMember + 'memberBank/bankNames',
            params: self.form,
          }).then(function (response) {
            self.bankList = response.data.data
          })
        },
        save () {
          let self = this
          self.$ajax({
            method: 'post',
            url: self.$apiMember + 'memberBank/memberbankcard',
            params: self.form,
          }).then(function (response) {
            self.$message.success('添加成功')
            self.$router.go(-1)
          })
        }
      }
    }
</script>

<style scoped>
  input::-webkit-input-placeholder{
    color:rgb(204,204,204);
  }
  .addBankCard {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .title {
    padding: .53rem .2rem .26rem;
    font-size: .4rem;
    color: rgb(153,153,153);
  }
  .blockWrapper {
    background: #fff;
    padding: 0 .2rem;
    box-sizing: border-box;
  }
  .block {
    height: 1.2rem;
    line-height: 1.2rem;
    display: flex;
    border-bottom: 1px solid rgb(153,153,153);
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .block:last-child {
    border: none;
  }
  .block .left{
    flex: none;
    height: 100%;
  }
  .block .right {
    flex: 1;
    height: 100%;
  }
  .block .right input {
    width: 100%;
    height: 100%;
    text-align: right;
    font-size: .4rem;
    color: rgb(51,51,51);
    border: none;
    outline: none;
    display: inline-block;
    vertical-align: top;
  }
  .block .right.choose {
    background: url("../../../../../assets/img/more@2x.png") no-repeat center right;
    background-size: .25rem auto;
    padding-right: .4rem;
  }
  .bottomBtn {
    width: 68%;
    height: 1rem;
    line-height: 1rem;
    margin: 1.6rem auto 0;
    background: #f50057;
    color: #fff;
    font-size: .37rem;
    text-align: center;
    border-radius: .53rem;
  }
  .mask {
    width: 100%;
    height: calc(100% - 1.3rem);
    position: absolute;
    top: 1.3rem;
    left: 0;
    z-index: 101;
    background: rgba(51,51,51,.5);
    opacity: 1;
  }
  .mask.fade-enter-active, .mask.fade-leave-active {
    transition: all 0.5s;
  }
  .mask.fade-enter, .mask.fade-leave-to {
    opacity: 0;
  }
  .pickerBox {
    transform: translate3d(0,0,0);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 150;
  }
  .pickerBox.fold-enter-active, .pickerBox.fold-leave-active {
    transition: all 0.5s;
  }
  .pickerBox.fold-enter, .pickerBox.fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .controlBar {
    height: 1rem;
    background: #fff;
    display: flex;
    justify-content: space-between;
  }
  .cancel, .confirm {
    padding: 0 .8rem;
    line-height: 1rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .confirm {
    flex: none;
  }
  .cancel {
    flex: none;
  }
  .pickerContent {
    height: 5.2rem;
    background: #f2f2f2;
    padding: .8rem 0 .53rem;
    position: relative;
  }
  .pickerContent .list {
    height: 100%;
    overflow: auto;
  }
  .pickerContent .item {
    text-align: center;
    font-size: .53rem;
    color: rgb(153,153,153);
  }
  .pickerContent .item.active {
    color: rgb(51,51,51);
    font-size: .66rem;
  }
  i.top {
    width: 100%;
    height: .8rem;
    position: absolute;
    top: .8rem;
    left: 0;
    background: linear-gradient(0deg,rgba(242,242,242,.4),rgba(242,242,242,.8));
  }
  i.bottom {
    width: 100%;
    height: .8rem;
    position: absolute;
    bottom: .53rem;
    left: 0;
    background: linear-gradient(0deg,rgba(242,242,242,.8),rgba(242,242,242,.4));
  }
</style>
