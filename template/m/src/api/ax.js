import axios from 'axios'
import {router} from '../router/index.js'

// 创建axios实例
const ax = axios.create({
  baseURL: process.env.BASE_API+'/api', // api的base_url,后面加上'/api'因为后台有设置基础路径
  // baseURL: '/api/api', // 使用代理,注意后台有没有基础路径
	timeout: 10000 // 请求超时时间
})

// 请求拦截
ax.interceptors.request.use(config => {
  // if (
  //    config.method === 'post' ||
  //    config.method === 'put' ||
  //    config.method === 'delete' ||
  //    config.method === 'patch'
  //  ) {
  //    config.data = querystring.stringify(config.data)
  //  }
	// 处理请求前逻辑
	// if (window.sessionStorage.getItem('token')) {
  //   config.headers.Authorization = `Bearer ${window.sessionStorage.getItem('token')}`
  // }
	return config
}, error => {
	return Promise.reject(error)
}) 

// 正常响应走response，抛出的异常走error
ax.interceptors.response.use( response => {
  // console.log(response)
  return response
}, error => {
  console.log(error)
	return Promise.reject(error)
})

export default ax