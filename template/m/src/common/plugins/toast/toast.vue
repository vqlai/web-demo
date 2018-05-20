<template>
  <transition name="toast-fade">
    <div v-show="visible" class="toast">
      <span>{{message}}</span>
    </div>
</transition>
</template>

<script>
  export default{
    data() {
      return {
        visible: false,
        message: ''
      }
    }
  }
</script>

<style>
  .toast{ position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 999; padding: 1rem;
     font-size: 1rem; background-color: rgb(0,0,0,.8); border-radius: .5rem; color: #fff; }
  .toast-fade-enter-active, .toast-fade-leave-active { transition: opacity .2s }
  .toast-fade-enter, .toast-fade-leave-to { opacity: 0 }
</style>