const config = require('../config'),
			Router = require('koa-router'),
			router = new Router({
				prefix: config.app.routerBaseApi
			}),
			U = require('../controller/user.js');

/*HTTP动词
	GET     //查询 
	POST    //新增
	PUT     //替换
	PATCH   //更新
	DELETE  //删除
*/
router.get('/getAllUser', U.getAllUser);
router.post('/addUser', U.addUser);
router.post('/deleteUserById', U.deleteUserById);
router.post('/modifyUser/:id', U.modifyUser);

module.exports = router;