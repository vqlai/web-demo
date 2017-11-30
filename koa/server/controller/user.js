const User = require('../model/user.js');
// const config = require('../config');
const createToken = require('../util/createToken.js')
const md5 = require('md5')

// 返回数据格式
//　{msg: '',success:boolean, data: {}}
// 注意ctx.success在条件分支语句中需要加return不然继续往下执行
// 注意ctx.response.body可以简写为ctx.body但ctx.request.body不可以简写
// ctx.query获取GET请求url参数，ctx.params获取POST请求url参数,ctx.request.body获取请求体参数
class UserController{
	// 登录
	static async login(ctx){
		const {username,password} = ctx.request.body;
		if(!username){
			return ctx.success({
				msg: '用户名不能为空!',
				success: false
			})
			// ctx.throw(400,'用户名不能为空!')
		}
		if(!password){
			return ctx.success({
				msg: '密码不能为空!',
				success: false
			})
			// ctx.throw(400,'密码不能为空!')
		}
		let result = await User.findOne({
			username
		})
		.exec()
		.catch(err => {
			ctx.throw(500, '服务器内部错误-login错误!')
		})
		// console.log('test:'+result)
		if(result){
			// 判断数据库的密码与前端传来的md5加密的密码是否相匹配
			if(result.password === md5(password)){
				let token = createToken(result._id);
				// console.log(token)
				return ctx.success({
					mag: '登录成功！',
					data: {
						uid: result._id,
						username: result.username,
						token
					},
					success: true
				})
			}else{
				return ctx.success({
					msg: '密码错误!',
					success: false
				})
			}
		}else{
			return ctx.success({
				msg: '用户名不存在!',
				success: false
			})
		}
	}
	// 获取所有用户
	static async getAllUser(ctx){
		// currentPage&&pageSize 不能为字符串只能为整形
		let currentPage  = ctx.query.currentPage ; // 当前页
		let pageSize  = ctx.query.pageSize  || 10; // 每页显示数，默认10条
		console.log(ctx.query)
		if(currentPage <= 0){
			currentPage = 1;
		}
		let result, total;
		if(currentPage  && pageSize ){
			result = await User
				.find()
				.sort({ 'createTime': -1 }) // 排序，-1为倒序
				.skip(parseInt(pageSize * (currentPage  -1))) // 跳过数
				.limit(parseInt(pageSize)) // 限制每页显示数
				.exec()
				.catch(err => {
					ctx.throw(500, '服务器错误-分页查找错误!')
				})
			total = await User
			  .count()
			  .exec()
			  .catch(err => {
			  	ctx.throw(500,'服务器内部错误-分页总数查询错误!')
			  })
		}else{
			result = await User
				.find()
				.exec() // 执行查询，并将查询结果传入回调函数,可以传人一个函数，会返回成为一个完整的 promise 对象
				// .then((val) => {
				// 	console.log(val)
				// })
				.catch(err => {
					console.log(err)
					ctx.throw(500, '服务器错误－getAllUser错误!')
				})
			// console.log(result) // rseult是一个对象数组
		}
		if(result){
			return ctx.success({
				msg: '获取成功',
				data: result,
				success: true,
				total
			})
		}else{
			return ctx.success({
				msg: '获取失败',
				success: false
			})
		}
	}

	// 添加用户
	static async addUser(ctx, next){
		// console.log(ctx.request.body);
		// 使用es6对象解构赋值
		const {username, password} = ctx.request.body;// 请求参数放在请求体
		if (!username) {
			ctx.throw(400, '用户名不能为空!')
		}
		if(!password){
			ctx.throw(400, '密码不能为空!')
		}
		// 注意node环境的时间少8小时	createTime: new Date(Date.now() + (8 * 60 * 60 * 1000)).getTime()

		const user = new User({
			username,
			password: md5(password),
			createTime: new Date()
		})
		let result = await user.save().catch((err) => {
      ctx.throw(500, '服务器内部错误-addUser错误!');
    });
    // console.log(result)
    ctx.success({
    	msg:'添加成功！',
    	data: result,
			success: true
    })
	}
  
  // 更新用户
  static async modifyUser(ctx){
  	const {username,password} = ctx.request.body; // 请求参数放在请求体
  	const id = ctx.params.id; // 请求参数放在请求路径
  	let result = await User.findByIdAndUpdate(id,{
  		username,
  		password
  	}, { new:true})
  	.exec() // 执行查询，并将查询结果传入回调函数,可以传人一个函数，会返回成为一个完整的 promise 对象
  	.catch((err)=>{
  		ctx.throw(500, '服务器内部错误-findByIdAndUpdate错误!');
    });
    ctx.success({
    	msg: '修改成功！',
    	data: result,
			success: true
    })
  }

  // 删除用户
  static async deleteUserById(ctx){
  	// console.log(ctx.request.body);
  	const id = ctx.params.id;// 请求参数放在请求路径
  	// const {id} = ctx.request.body;
  	// console.log(id);
  	let result = await User.findByIdAndRemove(id).exec().catch((err)=>{
  		ctx.throw(500, '服务器内部错误-findByIdAndRemove错误!')
  	});
  	ctx.success({
  		msg: '删除成功！',
  		data: result,
			success: true
  	});
  }		
}

// 注意区分es6导出模块的写法
module.exports = UserController;