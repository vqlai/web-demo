// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import '@/common/css/index.css' // 引入基础样式

import Toast from '@/common/plugins/toast/index.js'
Vue.use(Toast)

import Loading from '@/common/plugins/loading/index.js'
Vue.use(Loading)

import { Button } from 'mint-ui'
// import { Toast } from 'mint-ui'
// Vue.use(Toast)
Vue.component(Button.name, Button);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
