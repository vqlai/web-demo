const config = require('../config')
const jwt = require('jsonwebtoken')
// jwt生成token
module.exports = (userId) =>　{
	let privateKey = config.jwt.secret; // secret //撒盐：加密的时候混淆
	let expiresIn = config.jwt.expiresIn; // 3600s //到期时间
	// jwt.sign(payload, secretOrPrivateKey, [options, callback])
	// 负载 payload 定义一些需要使用的信息：客户端ID、JWT创建的时间、用户ID，负载中不需要传输敏感信息如密码、密钥等，JWT内容通过HTTP传输不安全。
	// options: algorithm (default: HS256) 
	// expiresIn: expressed in seconds or a string describing a time span zeit/ms. Eg: 60, "2 days", "10h", "7d"
	// {expiresIn} === {expiresIn: config.jwt.expiresIn} 使用es6对象解构赋值
	// 生成的token在node内存里，token过期jsonwebtoken插件会自动删除
	const token = jwt.sign({id: userId},privateKey,{expiresIn});
	console.log(token);
	return token; 
}