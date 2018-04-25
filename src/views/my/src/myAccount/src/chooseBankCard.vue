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
          .slide
            .slideWrapper(@touchstart='touchStart(index)', @touchmove='touchMove(index)', @touchend='touchEnd(index)', :style="deleteSlider(index)")
              .icon
                img(:src="item.bank_icon | img-filter")
              .center
                .name {{item.bank_card_owner_name}}
                .type  {{item.mbc_type}}
                .cardNo **** **** **** {{item.bank_card | cardNo}}
              img.checked(src="../../../../../assets/img/checked@2x.png", v-if="item.isChecked")
            .remove(ref="remove", @click.stop="remove(item.id)") 删除
      .add(@click="$router.push('/my/addBankCard')")
</template>

<script>
    export default {
      name: "chooseBankCard",
      data () {
        return {
          bankData: [],
          removeState:[]
        }
      },
      mounted () {
        this.getBankCartData()
      },
      filters: {
        cardNo(value) {
          return value && value.slice(value.length-5,value.length-1);
        }
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
          this.bankData = null;
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
            self.createRemoveState ();
          })
        },
        remove (id) {
          let _this = this
          this.$ajax({
            method: 'delete',
            url: this.$apiMember + 'memberBank/memberbankcard',
            params: {memberBankCardId:parseInt(id)},
          }).then(function (response) {
            _this.$message.success('删除成功')
            _this.getBankCartData()
            _this.removeState.forEach((item) => {
              item.deleteSlider =  "transform:translateX(0px)";
            })
          })
        },
        createRemoveState () {
          let _this = this;
          this.bankData.forEach((item, index) => {
            _this.removeState.push({
              startX:0,   //触摸位置
              endX:0,     //结束位置
              moveX: 0,   //滑动时的位置
              disX: 0,    //移动距离
              deleteSlider: '',//滑动时的效果,使用v-bind:style="deleteSlider"
            });
          });
        },
        deleteSlider (index) {
          return this.removeState[index].deleteSlider;
        },
        touchStart(index,ev){
          ev= ev || event
          //tounches类数组，等于1时表示此时有只有一只手指在触摸屏幕

          if(ev.touches.length == 1){
            // 记录开始位置
            this.removeState[index].startX = ev.touches[0].clientX;
          }
        },
        touchMove(index,ev){
          ev = ev || event;
          //获取删除按钮的宽度，此宽度为滑块左滑的最大距离
          let wd=this.$refs.remove[0].offsetWidth;
          if(ev.touches.length == 1) {
            // 滑动时距离浏览器左侧实时距离
            this.removeState[index].moveX = ev.touches[0].clientX

            //起始位置减去 实时的滑动的距离，得到手指实时偏移距离
            this.removeState[index].disX = this.removeState[index].startX - this.removeState[index].moveX;
            // 如果是向右滑动或者不滑动，不改变滑块的位置
            if(this.removeState[index].disX < 0 || this.removeState[index].disX == 0) {
              this.removeState[index].deleteSlider = "transform:translateX(0px)";
              // 大于0，表示左滑了，此时滑块开始滑动
            }else if (this.removeState[index].disX > 0) {
              //具体滑动距离我取的是 手指偏移距离*5。
              this.removeState[index].deleteSlider = "transform:translateX(-" + this.disX*5 + "px)";

              // 最大也只能等于删除按钮宽度
              if (this.removeState[index].disX*5 >=wd) {
                this.removeState[index].deleteSlider = "transform:translateX(-" +wd+ "px)";

              }
            }
          }
        },
        touchEnd(index,ev){
          ev = ev || event;
          let wd=this.$refs.remove[0].offsetWidth;
          if (ev.changedTouches.length == 1) {
            let endX = ev.changedTouches[0].clientX;

            this.removeState[index].disX = this.removeState[index].startX - endX;
            //如果距离小于删除按钮一半,强行回到起点

            if ((this.removeState[index].disX*5) < (wd/2)) {

              this.removeState[index].deleteSlider = "transform:translateX(0px)";
            }else{
              //大于一半 滑动到最大值
              this.removeState[index].deleteSlider = "transform:translateX(-"+wd+ "px)";
            }
          }
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
  }
  .list {

  }
  /*.item {
    height: 2.4rem;
    display: flex;
    align-items: center;
    padding: 0 .2rem;
    background: #fff;
    margin-top: .26rem;
  }*/
  .item {
    height: 2.4rem;
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
    margin: 2rem auto 0;
    text-align: center;
    font-size: 0;
    width: 68%;
    height: 1rem;
    background: url("../../../../../assets/img/newbankcard@2x.png") no-repeat top left;
    background-size: 100% 100%;
  }

  .slide {
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
    margin-top: .26rem;
  }
  .slideWrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    transition: 0.3s;
    display: flex;
    align-items: center;
    padding: 0 .2rem;
    background: #fff;

  }
  .remove{
    position: absolute;
    width:2rem;
    height:100%;
    background:rgb(245,0,87);
    right: 0;
    top: 0;
    color:#fff;
    text-align: center;
    font-size: .4rem;
    line-height: 2.4rem;
  }
</style>
