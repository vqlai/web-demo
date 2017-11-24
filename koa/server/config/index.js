let config = {
	jwt: {
		secret: 'secret', //撒盐：加密的时候混淆
		expiresIn: '3600s' // token到期时间 3600s
	},
	mongodb: {
		host: '127.0.0.1',
		database: 'koa-blog',
		port: 27017,
		user: '',
		password: ''
	},
	app: {
		port: process.env.PORT || 3030,
		routerBaseApi: '/api'
	}
}

// 注意区分es6导出模块的写法
module.exports = config;