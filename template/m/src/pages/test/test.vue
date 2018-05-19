<style scoped >
  @import "./test.css";
</style>
<template>
  <div class="test">
    <p>{{ msg }}</p>
    <img src="../../common/imgs/logo.png" alt="">
    <router-link to="/test2" tag="a">go test2</router-link>
    <div class="img-box"></div>
  </div>
</template>

<script>
export default {
  name: 'test',
  data () {
    return {
      msg: 'Welcome to my Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
