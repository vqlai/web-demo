// use: 用于给所有请求统一响应--统一响应中间件
// 在ctx对象上挂载方法，如果在调用的是有些参数没有出入，那么相当这个参数不存在，除非才有默认值的方式
module.exports = async (ctx, next) => {
	//　请求成功时
	ctx.success = ({data, msg, total, success}) => {
		// 注意ctx.response.body可以简写为ctx.body但ctx.request.body不可以简写
		ctx.body = {code: 200, data, msg, total, success};
	};
	// 传递到下一个中间件
	await next();
};