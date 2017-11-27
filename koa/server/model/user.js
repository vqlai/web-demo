const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: String,
	password: String,
  createTime: Date
});
// Number
// mongoose 会自动把表名变成复数
// 想要指定collection的名称，需要设置第三个参数
// module.exports = mongoose.model('User', userSchema, 'User');
module.exports = mongoose.model('user', userSchema, 'user');