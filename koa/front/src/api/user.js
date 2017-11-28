import axios from './interceptors.js'
let qs = require('qs')

// 登录
export function login(data) {
	console.log(data)
	const url = '/api/login';
	//qs.stringify(data)
	return axios.post(url, data).then(res => {
		return Promise.resolve(res)
	})
}

// 获取所有用户
export function getAllUser() {
	const url = '/api/getAllUser';
	return axios.get(url).then(res => {
		return Promise.resolve(res)
	})
}

// 新增用户
export function addUser(data) {
	const url = '/api/addUser';
	return axios.post(url,data).then(res => {
		return Promise.resolve(res)
	})
}

// 修改用户
export function modifyUser(id,data){
	const url = `/api/modifyUser/${id}`;
	return axios.patch(url, data).then(res => {
		return Promise.resolve(res)
	})
}

// 删除用户
export function deleteUser(data){
	const url = `/api/deleteUserById/${data}`;
	return axios.delete(url, data).then(res => {
		return Promise.resolve(res)
	})
}