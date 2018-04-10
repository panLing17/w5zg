<template lang="pug">
  .chooseBankCard
    nav-bar(background="white")
      .topLeft(slot="left")
        img(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      .topCenter(slot="center") 账户
      .topRight(slot="right")
    .content
      ul.list
        li.item(v-for="(item, index) in bankData", @click="change(index)")
          .icon
            img(:src="item.bank_icon | img-filter")
          .center
            .name {{item.bank_card_owner_name}}
            .type  {{item.mbc_type}}
            .cardNo **** **** **** {{item.bank_card.slice(item.bank_card.length-5,item.bank_card.length-1)}}
          img.checked(src="../../../../../assets/img/checked@2x.png", v-if="item.isChecked")
      .add
        img(src="../../../../../assets/img/newbankcard@2x.png", @click="$router.push('/my/addBankCard')")
</template>

<script>
    export default {
      name: "chooseBankCard",
      data () {
        return {
          bankData: [
            {
              bankName:'中国工商银行',
              type: '储蓄卡',
              cardNo:'2345',
              isChecked: true
            },
            {
              bankName:'中国农业银行',
              type: '储蓄卡',
              cardNo:'4189',
              isChecked: false
            },
            {
              bankName:'中国建设银行',
              type: '储蓄卡',
              cardNo:'1158',
              isChecked: false
            }
          ]
        }
      },
      mounted () {
        this.getBankCartData()
      },
      methods: {
        change (index) {
          this.bankData.forEach((item, i) => {
            if (i == index) {
              item.isChecked = true;
            }else {
              item.isChecked = false;
            }
          })
        },
        getBankCartData () {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiMember + 'memberBank/memberbankcards',
            params: {},
          }).then(function (response) {
            response.data.data.forEach((now)=>{
              now.isChecked = false
            })
            self.bankData = response.data.data
          })
        }
      }
    }
</script>

<style scoped>
  .chooseBankCard {
    background: rgb(242,242,242);
    width: 100%;
    min-height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .content {
    min-height: calc(100% - 1.3rem);
    display: flex;
    flex-flow: column;
  }
  .list {
    flex: 1;
  }
  .item {
    height: 2.4rem;
    display: flex;
    align-items: center;
    padding: 0 .2rem;
    background: #fff;
    margin-top: .26rem;
  }
  .item .icon {
    flex: none;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: #65aadd;
    align-self: flex-start;
    margin-top: .4rem;
    overflow: hidden;
  }
  .item .icon img{
    width: 100%;
    height: 100%;
  }
  .item .center {
    margin-left: .26rem;
    line-height: 1;
    flex: 1;
  }
  .item .center .name {
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .item .center .type {
    margin-top: .4rem;
    font-size: .32rem;
    color: rgb(153,153,153);
  }
  .item .center .cardNo {
    margin-top: .29rem;
    font-size: .48rem;
    color: rgb(153,153,153);
  }
  .item .checked {
    flex: none;
    width: .4rem;

  }
  .add {
    flex: 0;
    padding: .26rem 0;
    text-align: center;
  }
  .add img {
    width: 68%;
  }
</style>
