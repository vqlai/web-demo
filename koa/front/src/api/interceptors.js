import axios from 'axios';
import router from '../router';

axios.defaults.headers.post['Content-Type'] = 'application/json';
// axios.defaults.baseURL = '/proxy'
axios.defaults.timeout = 5 * 1000;

axios.interceptors.request.use((config) => {
	if(sessionStorage.token){
		config.headers.Authorization = `token ${sessionStorage.token}`
	}
	return config;
}, (error) => {
	return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
	return response;
}, (error) => {
	if(error.response){
		switch(error.response.status){
			case 401:
				router.replace({
					path: '/login',
					query: {redirect: router.currentRoute.fullPath}
				})
		}
	}
	return Promise.reject(error);
});

// 注意区分node导出模块的写法
export default axios;
