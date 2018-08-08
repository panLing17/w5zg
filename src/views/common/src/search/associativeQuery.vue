<template lang="pug">
  scroll.associativeQuery(:data="data")
    ul
      li(v-for="item in data", @click="selectItem(item)") {{item}}
</template>

<script>
  import Scroll from 'components/scroll'
  export default {
    name: "associativeQuery",
    props: {
      data: {
        type: Array,
        default () {
          return []
        }
      }
    },
    methods: {
      selectItem (item) {
        this.$emit('associativeSelect', item)
      }
    },
    components: {
      Scroll
    }
  }
</script>

<style scoped lang="stylus">
  @import '~assets/stylus/variable.styl'
  .associativeQuery {
    height: "calc(100vh - %s)" % $height-header;
    overflow hidden
    padding 0 .4rem
    ul {
      li {
        height: 1.2rem;
        line-height 1.2rem
        border-bottom:1px solid rgb(206,206,206);
        font-size:.37rem;
        color:rgb(51,51,51);
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
      }
    }
  }
</style>
