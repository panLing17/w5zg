<template>
  <div id="app">
    <transition name="fade" , mode="out-in">
       <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
li{
  list-style: none;
}
.clearBoth{
  clear: both;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
a{text-decoration:none}
.scrollWarpClass {
  position: fixed;
  bottom: 2rem;
  right: .5rem;
  width: 1rem;
}
</style>
