var MongoClient = require('mongodb').MongoClient;
// 连接数据库
var url_test = 'mongodb://localhost:27017/blog'; //数据库test本不存在，连接时会自动创建
var insertData = function(db){
  // 往test数据库里新建一个site集合，并插入一条数据
  db.collection('site').insertOne({name: 'guojc', age: 99, hobby: 'movie'}, function(err, result){
    console.log('inserted successly');
    console.log(result);
    db.close();
    console.log('close');
  });
}
MongoClient.connect(url_test, function(err, db) {
  console.log('Connected successly to server.');
  insertData(db);
});