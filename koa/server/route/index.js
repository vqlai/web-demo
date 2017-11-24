const config = require('../config'),
			Router = require('koa-router'),
			router = new Router({
				prefix: config.app.routerBaseApi
			}),
			U = require('../controller/user.js'),
			checkToken = require('../middleware/checkToken.js');

/*HTTP动词
	GET     //查询 
	POST    //新增
	PUT     //替换
	PATCH   //更新
	DELETE  //删除
*/
router.post('/login', U.login);
router.get('/getAllUser', checkToken, U.getAllUser);
router.post('/addUser', checkToken, U.addUser);
router.delete('/deleteUserById/:id', checkToken, U.deleteUserById);
router.patch('/modifyUser/:id', checkToken, U.modifyUser);

module.exports = router;