<template lang="pug">
  .searchInput
    img(src="../assets/img/searchInput搜索图标@2x.png")
    input(:type="type",:placeholder="placeholder" @focus="handFocus")
</template>
<script>
  export default {
    name: 'home',
    data () {
      return {

      }
    },
    props: {
      type: {
        type: String,
        default: 'text'
      },
      placeholder: {
        type: String,
        default: 'placeholder'
      }
    },
    mounted () {

    },
    methods: {
      handFocus () {
        this.$emit('focus', this.msg)
      }
    }
  }
</script>

<style scoped>
  .searchInput{
    width: 6.5rem;
    height: .9rem;
    background-color: #f2f2f2;
    border-radius: .9rem;
    line-height: .9rem;
  }
  .searchInput img{
    width: .4rem;
    vertical-align: middle;
    margin-left: .2rem;
  }
  .searchInput input{
    border: 0;
    outline: none;
    font-size: .3rem;
    margin-left: .1rem;
    background-color: #f2f2f2;
  }
</style>
