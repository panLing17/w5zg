<template lang="pug">
  .returnReason
    transition(name="fade")
      .bg(v-if="show", @click="hide")
    transition(name="fold")
      .main(v-if="show")
        .title  {{title}}
        .search
          img.icon(src="../../../../../assets/img/searchInput搜索图标@2x.png", @click.stop="search")
          input.searchText(placeholder="请输入查询快递名称", type="search", v-model="searchText", @search="search")
        ul
          li(v-for="(item,index) in data", @click="selected(index)") {{item[itemKey]}}
</template>

<script>
  export default {
    name: "pop3",
    data () {
      return {
        show: false,
        searchText: ''
      }
    },
    watch: {
      // 模态框出现禁止页面滑动
      show (cur, old) {
        if (cur) {
          document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        }else {
          document.getElementsByTagName('body')[0].style.overflow = 'auto';
        }
      }
    },
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      },
      title: String,
      itemKey: String
    },
    methods:{
      search () {
        let _this = this
        this.data = []
        this.$ajax({
          method: 'post',
          url: this.$apiMember + 'logisticsThird/api/logistics',
          params:{
            name: this.searchText,
            page: 1,
            rows: 500
          }
        }).then(function (response) {
          if (response.data.code === '081') {
            _this.data = response.data.data
          }else {
            _this.$message.error(response.data.msg);
          }
        })
      },
      showPop () {
        this.show = true
      },
      hide () {
        this.show = false
      },
      selected (num) {
        this.$emit('selected',{ultd_id:this.data[num].ultd_id,ultd_name:this.data[num].ultd_name})
        this.hide();
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
    opacity: 1;
  }
  .bg.fade-enter-active, .bg.fade-leave-active {
    transition: all 0.5s;
  }
  .bg.fade-enter, .bg.fade-leave-to {
    opacity: 0;
  }
  .main {
    background-color: white;
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 101;
    font-size: .4rem;
    transform: translate3d(0,0,0);
  }
  .main.fold-enter-active, .main.fold-leave-active {
    transition: all 0.5s;
  }
  .main.fold-enter, .main.fold-leave-to {
    transform: translate3d(0,100%,0);
  }
  .title {
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    width: 100%;
    font-weight: 600;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .main ul{
    padding: 0 .2rem;
    height: 10rem;
    overflow: auto;
  }
  .main ul li{
    height: 1.35rem;
    line-height: 1.35rem;
    text-align: center;
  }
  .search {
    margin: 1rem auto 0;
    position: relative;
    height: 1rem;
    width:60%;
  }
  .icon {
    position: absolute;
    width: .5rem;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    padding: .2rem;
    box-sizing: content-box;
  }
  .searchText {
    width: 100%;
    height: 100%;
    border: 1px solid rgb(154,154,154);
    border-radius: .5rem;
    padding-left: 1rem;
    outline: none;
  }
  img {
    pointer-events: auto !important;
  }
</style>
