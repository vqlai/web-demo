import axios from 'axios'

// 创建axios实例
const ax = axios.create({
  // baseURL: process.env.BASE_API+'/api', // api的base_url,后面加上'/api'因为后台有设置基础路径
  baseURL: '/api', // 使用代理,注意后台有没有基础路径
	timeout: 10000 // 请求超时时间
})
// axios.defaults.headers.post['Content-Type'] = 'application/json';
// ax.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截
ax.interceptors.request.use(config => {
	// 处理请求前逻辑
	if (window.sessionStorage.getItem('token')) {
    config.headers.Authorization = `Bearer ${window.sessionStorage.getItem('token')}`
  }
	return config
}, error => {
	return Promise.reject(error)
}) 

ax.interceptors.response.use(response => {
  return response
}, error => {
	return Promise.reject(error)
})

export default ax