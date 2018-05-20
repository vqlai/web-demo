import vLoading from './loading.vue'

let Loading = {}

Loading.install = (Vue) => {
  Vue.component('loading', vLoading)
}

export default Loading