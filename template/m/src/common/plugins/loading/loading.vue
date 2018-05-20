<template>
  <!-- <div :class="[type, color]" :style="style">
    <span :class="'spinner', type">
      <i v-for="item in (type === 'spinner' ? 12 : 0)" />
      <svg v-if="type === 'circular'" :class="'circular'" viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" fill="none"/>
      </svg>
    </span>
  </div> -->
  <div>
    loading
  </div>
</template>

<script>
  export default{
    name: 'loading',
    props: {
      size: String,
      type: {
        type: String,
        default: 'circular'
      },
      color: {
        type: String,
        default: 'black'
      }
    },
    computed: {
      style() {
        return this.size ? {
          width: this.size,
          height: this.size
        } : {};
      }
    }
  }
</script>

<style scoped>

</style>