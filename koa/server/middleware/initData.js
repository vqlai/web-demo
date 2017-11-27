const config = require('../config');
const User = require('../model/user');
const md5 = require('md5');

// 初始化管理员帐号中间件(该中间件当用户访问时执行生成初始化数据)
module.exports = async (ctx, next) =>{
	let result = await User.find().exec().catch(err => {
		ctx.throw(500, '服务器内部错误--查找初始化数据错误!')
	})
	if(result.length === 0){
		for(let item of config.initData){
			const username = item.username;
			const password = md5(item.password);
			// 注意node环境的时间少8小时 createTime: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime()
			let user = new User({
				username,
				password,
				createTime: new Date()
			})
			await user.save().catch(err=>{
				// 注意throw抛出错误后就不会往下执行
				ctx.throw(500, '服务器内部错误--存储初始化数据错误!');
			})
		}
		console.log('初始化数据完成!')
	}
	await next();
}