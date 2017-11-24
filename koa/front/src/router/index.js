import Vue from 'vue'
import Router from 'vue-router'
// import Index from '@/page/index'
// import Login from '@/page/login'

Vue.use(Router)

const Login = () => import('@/page/login')
const Index = () => import('@/page/index')

export default new Router({
	// mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    }
  ]
})
