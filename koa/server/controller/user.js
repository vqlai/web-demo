const User = require('../model/user.js');
// const config = require('../config');
const createToken = require('../util/createToken.js')

// 返回数据格式
//　{msg: '',success:boolean, data: {}}
// 注意ctx.success在条件分支语句中需要加retur不然继续往下执行

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
			if(result.password === password){
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
		let result = await User
				.find()
				.exec() // 执行查询，并将查询结果传入回调函数,可以传人一个函数，会返回成为一个完整的 promise 对象
				// .then((val)=>{
				// 	console.log(val)
				// })
				.catch(err => {
					console.log(err)
					ctx.throw(500, '服务器错误－getAllUser错误!')
				})
		// console.log(result) // rseult是一个对象数组
		if(result){
			return ctx.success({
				msg: '获取成功',
				data: result,
				success: true
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
		const user = new User({
			username,
			password
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