<template lang="pug">
  div.box
    ul
      li(v-for="(item, index) in list.slice(0,5)", v-lazy-container="{ selector: 'img'}", @click="toNext(1,index)")
        img(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+item.image" ,
            :data-loading="require('../../../assets/img/default/btn.png')",
            :data-error="require('../../../assets/img/default/btn.png')",
            )
        span {{item.title}}
    ul
      li(v-for="(item, index) in list.slice(5,10)", v-lazy-container="{ selector: 'img'}", @click="toNext(2,index)")
        img(:data-src="'http://w5zg-mall.oss-cn-hangzhou.aliyuncs.com/'+item.image" ,
        :data-loading="require('../../../assets/img/default/btn.png')",
        :data-error="require('../../../assets/img/default/btn.png')",
        )
        span {{item.title}}
</template>

<script>
  export default {
    name: "hot-button",
    props:{
      list: Array
    },
    methods: {
      toNext (arrType,index) {
        let data = {};
        if (arrType === 2) {
          data = this.list[5+index];
        }else {
          data = this.list[index];
        }
        this.$method.goActivity.call(this, data, 1)
        // switch (data.url_type) {
        //   // 跳外链
        //   case '143': window.location.href = data.url + '?shId=' + data.sh_id; break;
        //   // 跳3级页面 361代表从1级跳3级
        //   case '145': this.$router.push({path: '/home/sports',query:{parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
        //   // 跳商品详情页 取relate_id
        //   case '141': this.$router.push({ path: '/goodsDetailed', query: { id: data.relate_id }}); break;
        //   // 跳2级页面
        //   case '144': this.$router.push({path: '/home/largeCollection',query:{parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
        //   // 跳3级页面模板2
        //   case '148': this.$router.push({path: '/twoLevel', query: {parentType: '361',actId: data.id, title: data.title, shId: data.sh_id}}); break;
        //   // 跳3级页面模板2
        //   case '149': this.$router.push({ path: '/activity', query: { actId: data.id, title: data.title, parentType: '361', shId: data.sh_id}}); break;
        //
        // }
      }
    }
  }
</script>

<style scoped>
  .box {
    width: 100%;
    /*height: 4.2rem;*/
    background: white;
    padding: .24rem 0 .16rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .box > ul {
    height: 45%;
    display: flex;
  }

  .box > ul > li {
    margin-bottom: .13rem;
    width: 20%;
    height: 100%;
    display: flex;
    display:-webkit-box;
    display: -moz-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .box > ul > li > img {
    width: 100%;
  }
  .box > ul > li > span {
    display: block;
    margin-top: .13rem;
    font-size: .32rem;
    font-style: normal;
    line-height: 1;
  }
</style>
