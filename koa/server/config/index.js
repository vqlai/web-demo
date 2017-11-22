let config = {
	jwt: {
		secret: 'secret',
		exprisesIn: '3600s'
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

module.exports = config;