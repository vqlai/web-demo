import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/index'
// import Device from '@/pages/device'
import Monitor from '@/pages/monitor'
import Track from '@/pages/track'
import Rail from '@/pages/rail'
import Test from '@/pages/test'
import Test2 from '@/pages/test2'
import Demo1 from '@/pages/demo1'
import Demo2 from '@/pages/demo2'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path:"/",
      redirect: '/index'
    },{
      path: '/index',
      name: 'Index',
      component: Index
    },{
      path: '/monitor',
      name: 'Monitor',
      component: Monitor
    },{
      path: '/track',
      name: 'Track',
      component: Track
    },{
      path: '/rail',
      name: 'Rail',
      component: Rail
    },{
      path: '/test',
      name: 'Test',
      component: Test
    },{
      path: '/test2',
      name: 'Test2',
      component: Test2
    },{
      path: '/demo1',
      name: 'Demo1',
      component: Demo1
    },{
      path: '/demo2',
      name: 'Demo2',
      component: Demo2
    }
  ]
})
