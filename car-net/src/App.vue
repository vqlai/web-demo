<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  overflow: hidden;
  padding-top: 60px;
  position: relative;
  box-sizing: border-box;
}
</style>
