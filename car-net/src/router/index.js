import Vue from 'vue'
import Router from 'vue-router'
import {routers} from './router'


Vue.use(Router)

const routerConfig = {
  // mode: 'history', // 后端支持可开
  // scrollBehavior: () => ({ y: 0 }),
  routes: routers
}

// export default 可以在其他js直接引用 但export需要{}进行引用 
export const router = new Router(routerConfig)

router.beforeEach((to, from, next) =>{
  next();
})

router.afterEach((to) => {
  // window.scrollTo(0,0);
})

