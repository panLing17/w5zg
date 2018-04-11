<template lang="pug">
  .accountDetailBox
    .nav
      img.back(src="../../../../../assets/img/back@2x.png", style="width:.3rem", @click="$router.go(-1)")
      ul.navList
        li.navItem(:class="{'active':itemActive===0}", @click="itemChange(0)")
          span.dec 余额明细
          img.icon(:src="drop?require('../../../../../assets/img/drop-down@2x.png'):require('../../../../../assets/img/pack-up@2x.png')", v-show="itemActive===0", @click.stop="dropChange")
        li.navItem.last(:class="{'active':itemActive===1}", @click="itemChange(1)")
          span.dec 第三方明细
          img.icon(:src="drop?require('../../../../../assets/img/drop-down@2x.png'):require('../../../../../assets/img/pack-up@2x.png')", v-show="itemActive===1", @click.stop="dropChange")
    transition(name="fade")
      .mask(v-show="filterShow", @click="closeFilter")
    .filterBoxWrapper
      transition(name="fold")
        .filterBox(v-show="filterShow")
          .btn(:class="{'active':filterActive===1}", @click="filterChange(1)") 全部
          .btn(:class="{'active':filterActive===2}", @click="filterChange(2)") 收入
          .btn(:class="{'active':filterActive===3}", @click="filterChange(3)") 支出
    transition(name="fade", mode="out-in")
      router-view
</template>

<script>
    export default {
      name: "accountDetail",
      data () {
        return {
          drop: true,
          itemActive: 0,
          filterShow:false,
          filterActive: 1
        }
      },
      computed: {

      },
      watch: {
        filterActive () {
          this.$router.replace({path:`/my/accountDetailContent/${this.itemActive}/${this.filterActive}`});
        },
        // 模态框出现禁止页面滑动
        filterShow (cur, old) {
          if (cur) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
          }else {
            document.getElementsByTagName('body')[0].style.overflow = 'auto';
          }
        }
      },
      mounted () {
        this.itemInit(this.$route.params.id);
      },
      methods: {
        itemInit (id) {
          this.itemActive = parseInt(id);
        },
        itemChange (index) {
          this.itemActive = index;
          this.drop = true;
          this.$router.replace({path:`/my/accountDetailContent/${index}/1`});
        },
        dropChange () {
          this.drop = !this.drop;
          if (this.drop) {
            this.filterShow = false;
          }else {
            this.filterShow = true;
          }
        },
        filterChange (index) {
          this.filterActive = index;
          this.filterShow = false;
          this.drop = true;
        },
        closeFilter () {
          this.filterShow = false;
          this.drop = true;
        }
      }
    }
</script>

<style scoped>
  .accountDetailBox {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .nav {
    display: flex;
    height: 1.3rem;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 150;
  }
  .back {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    padding: 0 .2rem;
    box-sizing: content-box;
  }
  .navList {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .navItem {
    height: 100%;
    line-height: 1.3rem;
    margin-right: .4rem;
    font-size: .4rem;
    color: rgb(51,51,51);
    padding-right: .4rem;
    position: relative;
  }
  .navItem.last {
    margin: 0;
  }
  .navItem .icon {
    width: .26rem;
    padding-left: 0.14rem;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    box-sizing: content-box;
  }
  .navItem.active {
    color: rgb(245,0,87);
  }
  .navItem.active:after {
    content: '';
    display: block;
    width: 100%;
    height: 0.053rem;
    background: rgb(245,0,87);
    position: absolute;
    left: 0;
    bottom: 0;
    border-radius: 0.26rem;
  }
  .mask {
    width: 100%;
    height: calc(100% - 1.3rem);
    position: fixed;
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
  .filterBoxWrapper {
    width: 100%;
    overflow: hidden;
    position: fixed;
    height: .93rem;
    top:1.3rem;
    left:0;
    z-index:150;
  }
  .filterBox {
    position: absolute;
    z-index: 150;
    width: 100%;
    background: rgb(242,242,242);
    height: .93rem;
    transform: translate3d(0,0,0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0 1.86rem;
    box-sizing: border-box;
  }
  .filterBox.fold-enter-active, .filterBox.fold-leave-active {
    transition: all 0.5s;
  }
  .filterBox.fold-enter, .filterBox.fold-leave-to {
    transform: translate3d(0,-100%,0);
  }
  .btn {
    flex: none;
    width: 1.3rem;
    line-height: .66rem;
    height: .66rem;
    text-align: center;
    border-radius: .1rem;
    font-size: .4rem;
    color: rgb(51,51,51);
  }
  .btn.active {
    background: rgb(255,128,171);
    color: #fff;
  }
</style>
