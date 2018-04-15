<template lang="pug">
  .headlines
    .headerBox
      img.back(src="../../../../../assets/img/back@2x.png", @click="$router.go(-1)")
    .navBox
      .navItem(:class="{active:navActive===index}", @click="navChange(item.ic_id,index)", v-for="(item, index) in navList") {{item.ic_name}}
    transition(name="fade")
      router-view
</template>

<script>
    export default {
      name: "headlines",
      data () {
        return {
          navActive: 0,
          navList: []
        }
      },
      created () {
        this.getNav();
      },
      methods: {
        getNav() {
          let _this = this;
          this.$ajax({
            method: 'get',
            url: this.$apiApp + 'index/acInformationCataList',
            params:{}
          }).then(function (response) {
            _this.navList = response.data.data;
          })
        },
        navChange (cataId, index) {
          this.navActive = index;
          this.$router.replace(`/home/list/${cataId}/${index}`);
        }
      }
    }
</script>

<style scoped>
  .headlines {
    background: rgb(242,242,242);
    width: 100%;
    height: 100vh;
    position: absolute;
    z-index: 100;
  }
  .headerBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1.3rem;
    background: url("../../../../../assets/img/newsHeaderBg@2x.png") no-repeat bottom left;
    background-size: cover;
    display: flex;
    align-items: center;
  }
  .back {
    padding: 0 .2rem;
    width: .3rem;
    box-sizing: content-box;
    flex: 0;
  }
  .navBox {
    position: fixed;
    top: 1.3rem;
    left: 0;
    width: 100%;
    height: .93rem;
    display: flex;
    overflow: auto;
  }
  .navItem {
    flex: 1;
    /*width: 1.6rem;*/
    font-size: .4rem;
    color: rgb(51,51,51);
    text-align: center;
    line-height: .93rem;
  }
  .navItem.active {
    background: rgb(153,153,153);
    color: #fff;
  }
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active in below version 2.1.8 */ {
    opacity: 0
  }
</style>
