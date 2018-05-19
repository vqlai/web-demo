import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router)

// 路由懒加载
const test = () => import("@/pages/test/test.vue")
const test2 = () => import("@/pages/test2/test2")

const router = new Router({
  // mode: 'history', // 后端支持可开
  // scrollBehavior: () => ({ y: 0 }),
  routes: [
    {path: '/', redirect: '/test'},
    {path: '/test', name: 'test', component: test},
    {path: '/test2', name: 'test2', component: test2},
    {path: '*', redirect: '/test'}, // 未匹配到的路由跳到首页
  ]
})

router.beforeEach((to, from, next) =>{
  next()
})

router.afterEach((to) => {
})

// export default 可以在其他js直接引用 但export需要{}进行引用 
export default router
