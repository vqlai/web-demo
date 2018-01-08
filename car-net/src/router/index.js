import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
import Test from '@/pages/test'
import Monitor from '@/pages/monitor'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },{
      path: '/test',
      name: 'Test',
      component: Test
    },{
      path: '/monitor',
      name: 'Monitor',
      component: Monitor
    }
  ]
})
