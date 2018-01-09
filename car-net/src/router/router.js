// const Login = resolve => { require(['@/pages/login'], resolve); }
// const Main = () => import('@/pages/main')
// 根据环境的不同切换路由懒加载
const _import = require('./_import_' + process.env.NODE_ENV)

// 主路由
export const appRouter = [
  {
    path:"/",
    redirect: '/index'
  },{
    path: '/index',
    name: 'Index',
    component: _import('index/index')
  },{
    path: '/monitor',
    name: 'Monitor',
    component: _import('monitor/monitor')
  },{
    path: '/track',
    name: 'Track',
    component: _import('track/track')
  },{
    path: '/rail',
    name: 'Rail',
    component: _import('rail/rail')
  },{
    path: '/test',
    name: 'Test',
    component: _import('test')
  },{
    path: '/test2',
    name: 'Test2',
    component: _import('test2')
  },{
    path: '/demo1',
    name: 'Demo1',
    component: _import('demo1')
  },{
    path: '/demo2',
    name: 'Demo2',
    component: _import('demo2')
  }
];

export const routers = [
  ...appRouter
]