<template>
  <div class="test2">
    <p>{{ msg }}</p>
    <mt-button type="primary" @click="showMsg()">primary</mt-button>
    <router-link :to="{name: 'test'}" tag="a">back test</router-link>
  </div>
</template>

<script>
// import { Toast } from 'mint-ui'
export default {
  name: 'test2',
  data () {
    return {
      msg: 'test2'
    }
  },
  methods: {
    showMsg() {
      // Toast({ message: '测试', position: 'bottom', duration: 2000 });
      this.$toast('测试')
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
