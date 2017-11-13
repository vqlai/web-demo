// Schema、Model、Entity或者Documents的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
const mongoose = require('mongoose');
// 连接数据库 如果不自己创建 默认test数据库会自动生成
mongoose.connect('mongodb://localhost:27017/blog');

// 为这次连接绑定事件
const db = mongoose.connection;
db.once('error',() => console.log('Mongo connection error'));
db.once('open',() => console.log('Mongo connection successed'));

/************** 定义表userSchema **************/
let schema =　mongoose.Schema
const userSchema = new schema({
    username : String,
    password : String
});

/************** 创建模型Model **************/
const Models = {
		// mongoose 会自动把表名变成复数
		// 想要指定collection的名称，需要设置第三个参数
    User : mongoose.model('User', userSchema, 'User') 
}

module.exports = Models;
// module.exports = db;
