// 可能是我的node版本问题，不用严格模式使用ES6语法会报错
// "use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();

/************** 新增(post/save) 获取(get/find) 更新(update) 删除(delete/remove) **************/

// 新增用户
router.post('/api/addUser',(req,res) => {
    // 这里的req.body能够使用就在index.js中引入了const bodyParser = require('body-parser')
    let newUser = new models.User({
        username : req.body.username,
        password : req.body.password
    });
    // 保存数据newAccount数据进mongoDB
    newUser.save((err,data) => {
        if (err) {
            res.send(err);
        } else {
        	console.log(data)
          res.send({code: 200, msg: '添加成功', data: data});
        }
    });
});

// 删除指定用户
router.post('/api/delUser',(req,res) => {
		console.log(req.body.id)
    // 通过模型去查找数据库
    models.User.remove({ _id: req.body.id}, (err,data) => {
        if (err) {
            res.send(err);
        } else {
        	// console.log(data)
          res.send({code: 200, msg: '删除成功'});
        }
    });
});

// 修改指定用户
router.post('/api/updateUser',(req,res) => {
		console.log(req.body)
    // 通过模型去查找数据库
    models.User.update(req.body, (err,data) => {
        if (err) {
            res.send(err);
        } else {
        	// console.log(data)
          res.send({code: 200, msg: '修改成功'});
        }
    });
});

// 获取所有用户
router.get('/api/getUser',(req,res) => {
    // 通过模型去查找数据库
    models.User.find((err,data) => {
        if (err) {
            res.send(err);
        } else {
        	// console.log(data)
        	var result = [];
        	data.forEach(function(item){
        		var obj = {}
        		obj.id = item._id
        		obj.username = item.username
        		obj.password = item.password
        		result.push(obj)
        	})
          res.send({code: 200, msg: '添加成功', data: result});
        }
    });
});

// 根据用户名获取用户
router.get('/api/getUserByName',(req,res) => {
		// console.log(req)
		console.log(req.query.username)
    // 通过模型去查找数据库
    models.User.find({username: req.query.username}, (err,data) => {
        if (err) {
            res.send(err);
        } else {
        	// console.log(data)
        	var result = [];
        	data.forEach(function(item){
        		var obj = {}
        		obj.id = item._id
        		obj.username = item.username
        		obj.password = item.password
        		result.push(obj)
        	})
          res.send({code: 200, msg: '查询成功', data: result});
        }

    });
});



module.exports = router;