import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const News = (resolve) => {
  import('pages/news/news.vue').then((module) => {
    resolve(module)
  })
}

const Race = (resolve) => {
  import('pages/race/race.vue').then((module) => {
    resolve(module)
  })
}

const Team = (resolve) => {
  import('pages/team/team.vue').then((module) => {
    resolve(module)
  })
}

const Data = (resolve) => {
  import('pages/data/data.vue').then((module) => {
    resolve(module)
  })
}

const router = new Router({
  routes: [
   {
      path: '/',
      redirect: '/news'
    },
    {
      path: '/news',
      component: News
    },
    {
      path: '/race',
      component: Race
    },
    {
      path: '/team',
      component: Team
    },
    {
      path: '/data',
      component: Data
    }
  ]
})

export default router