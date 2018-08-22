<template lang="pug">
  .advert(@click="toNext")
    img(:src="content.image | img-filter")
</template>

<script>
  export default {
    name: "advert",
    data() {
      return {
        content: {}
      }
    },
    methods: {
      toNext() {
        this.$method.goActivity.call(this, this.content)
        // switch (this.content.url_type) {
        //   // 跳外链
        //   case '143': window.location.href = this.content.url + '?shId=' + this.content.sh_id; break;
        //   // 跳3级页面 361代表从1级跳3级
        //   case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: this.content.id, title: this.content.title, shId: this.content.sh_id}}); break;
        //   // 跳商品详情页 取relate_id
        //   case '141': this.$router.push({ path: '/goodsDetailed', query: { id: this.content.relate_id }}); break;
        //   // 跳2级页面
        //   case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: this.content.id, title: this.content.title, shId: this.content.sh_id}}); break;
        //   // 跳3级页面模板2
        //   case '149': this.$router.push({ path: '/activity', query: { actId: this.content.id, title: this.content.title, parentType: '361', shId: this.content.sh_id}}); break;
        //   // 跳三级页面模板2
        //   case '148': this.$router.push({path: '/twoLevel', query: {parentType: '361',actId: this.content.id, title: this.content.title, shId: this.content.sh_id}}); break;
        // }
      }
    }
  }
</script>

<style scoped lang="stylus">
  .advert
    font-size 0
    margin-bottom 0.13rem
    img
      width 100%
      max-height 1.86rem
      pointer-events none
</style>
