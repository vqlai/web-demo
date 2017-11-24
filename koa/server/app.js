// koa 
const koa = require('koa');
const app = new koa();

// 配置文件
const config = require('./config');

// 引人路由
const router = require('./route');

// mongooes 数据库连接
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const mongoUrl = `mongodb://${config.mongodb.user}:${config.mongodb.password}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.database}`;
mongoose.connect(mongoUrl);
const db = mongoose.connection;
db.on('error',()=>{
	console.log('数据库连接出错！');
})
db.once('open', ()=>{
	console.log('数据库连接成功！');
})

// bodyParser中间件
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());

// 使用response中间件(放在最前面)
// app.use可以直接执行引人文件里的module.export内容
const response = require('./middleware/response.js')
app.use(response);

// 使用errorHandle中间件
const errorHandle = require('./middleware/errorHandle.js')
app.use(errorHandle);

//　使用路由中间件
app.use(router.routes())
	 .use(router.allowedMethods());

app.listen(config.app.port, ()=>{
	console.log('The server is running at http://localhost:' +config.app.port)
})