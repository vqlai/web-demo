import ax from './interceptors'
let qs = require('qs')

// export async function addUser(data) {
// 	let url = '/addUser'
// 	return await ax({
// 		url,
// 		method: 'post',
// 		// 传参方式: post方式用 data: {...params} ，get方式用 params: {...params}
// 		data: qs.stringify({...data}) // Form Data方式请求，Content-Type:application/x-www-form-urlencoded
// 		// data: {...data}  // Request Payload方式请求，Content-Type:application/json（axios默认的传值方式）
// 	})
// }

// 获取全部用户
// export async function getAllUser(params){
// 	return await ax({
// 		url: '/getAllUser',
// 		method: 'get',
// 		params: {...params}
// 	})
// }

// 获取轨迹
export async function getTrack(params) {
	return await ax({
		url: '/track/gettrack',
		method: 'get',
		// 传参方式: post方式用 data: {...params} ，get方式用 params: {...params}
		params: {...params} 
	})
}