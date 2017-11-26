// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import axios from 'axios'

Vue.prototype.$http = axios

Vue.config.productionTip = false

// 将fastclick挂载到body上，解决所有元素的点击事件的300ms延迟问题
fastclick.attach(document.body)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

// template: '<App/>',
// components: { App }