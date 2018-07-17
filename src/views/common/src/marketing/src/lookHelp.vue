<template>

</template>

<script>
  export default {
    name: "lookHelp",
    created (){
      this.$router.replace('/marketing/assisting')
      // this.getWXUrl()
    },
    methods: {
      getWXUrl () {
        if (!this.$route.query.unionId) {
          let self = this
          self.$ajax({
            method: 'get',
            url: self.$apiTransaction + 'oauth2/wechat/createCodeUrl',
            params: {}
          }).then(function (response) {
            if (response) {
              window.location.href = response.data.data
            }
          })
        } else {
          this.$router.replace({path: '/marketing/assisting', query: {temp: 2}})
        }
      }
    }
  }
</script>

<style scoped>

</style>
