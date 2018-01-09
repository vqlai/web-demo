// 生成环境进行路由懒加载
module.exports = file => () => import('@/pages/'+file+'.vue')
