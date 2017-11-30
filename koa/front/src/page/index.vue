<template>
  <div class="index">
    <div class="exit-btn">您好，{{info}}。<a href="javascript:;" @click="exit">退出</a></div>
    <img src="../assets/logo.png">
    <form>
      用户名：<input type="text" name="username" v-model="username">
      密码：<input type="password" name="password" v-model="password">
      <a href="javascript:;" @click="_addUser">添加</a>
    </form>
    <ul>
      <li v-for="item in list">
        <span>用户名：{{item.username}} 密码：{{item.password}} 创建时间：{{moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>&nbsp;<a href="javascript:;"  @click="_deleteUser(item)">删除</a>&nbsp;<a href="javascript:;"  @click="showModifyForm(item)">修改</a>
      </li>
    </ul>
    <div>
      <a href="javascript:;" @click="prePage" v-show="preBtn">上一页</a>
      <a href="javascript:;" @click="nextPage" v-show="nextBtn">下一页</a>
    </div>
    <br/>
    <form v-show="isModifyForm">
      <input type="text" name="modifyUsername" v-model="modifyUsername">
      <input type="text" name="modifyPassword" v-model="modifyPassword">
      <a href="javascript:;" @click="_modifyUser">确定</a>
    </form>
  </div>
</template>

<script>
// var qs = require('qs')
import {getAllUser, addUser, modifyUser, deleteUser} from '../api/user.js'
export default {
  name: 'index',
  data () {
    return {
      info: sessionStorage.username,
      username: '',
      password: '',
      list: [],
      isModifyForm: false,
      modifyItem: null,
      modifyUsername: '',
      modifyPassword: '',
      currentPage: 1,
      pageSize: 3,
      total: 0,
      preBtn: false,
      nextBtn: true
    }
  },
  mounted(){
    this._getAllUser(this.currentPage, this.pageSize)    
  },
  methods:{
    exit(){
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('username');
      // this.$router.push({
      //   path: '/index'
      // });
      this.$router.replace({
          path: 'login'
      })
    },
    // 显示修改表单
    showModifyForm(item){
      console.log(item)
      this.modifyItem = null
      this.modifyItem = item
      this.isModifyForm = true
    },
    _modifyUser(){
      var that = this
      // this.$axios.patch(`/api/api/modifyUser/${that.modifyItem._id}`,qs.stringify({
      //   username: that.modifyUsername,
      //   password: that.modifyPassword
      // }),{
      //   headers: {'Authorization': `token ${sessionStorage.token}`}
      // })
      console.log(that.modifyItem._id)
      modifyUser(that.modifyItem._id,{
        username: that.modifyUsername,
        password: that.modifyPassword
      })
      .then(function(res){
        console.log(res)
        if(res.data.success === true){
          that._getAllUser(that.currentPage, that.pageSize)
          that.modifyUsername = ''
          that.modifyPassword = ''  
          that.isModifyForm = false
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 新增用户
    _addUser(){
      var that = this
      // cors访问：http://localhost:6090/api/addUser
      // 代理访问：/api/api/addUser
      // if(sessionStorage.token){ 
      // //如果存在token,那么每个请求都得携带token上去
      //   this.$axios.config.headers.Authorization = `token ${sessionStorage.token}`;
      // }
      // this.$axios.post('/api/api/addUser',qs.stringify({
      //   username: this.username,
      //   password: this.password
      // }),{
      //   headers: {'Authorization': `token ${sessionStorage.token}`}
      // })
      addUser({
        username: this.username,
        password: this.password
      })
      .then(function(res){
        console.log(res)
        if(res.data.success === true){
          that._getAllUser(that.currentPage, that.pageSize)
          that.username = ''
          that.password = ''
        }else{
          console.log(res)
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 删除用户
    _deleteUser(item){
      console.log(item._id)
      var that = this
      // this.$axios.delete(`/api/api/deleteUserById/${item._id}`,{
      //   headers: {'Authorization': `token ${sessionStorage.token}`}
      // })
      deleteUser(item._id)
      .then(function(res){
        console.log(res)
        if(res.data.success === true){
          that._getAllUser(that.currentPage, that.pageSize)
          that.username = ''
          that.password = ''
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    nextPage(){
      let pages = this.total%this.pageSize ? parseInt(this.total/this.pageSize)+1 : parseInt(this.total/this.pageSize);
      this._getAllUser(++this.currentPage, this.pageSize)
      if(this.currentPage > 1){
        this.preBtn = true
      }
      if(pages == this.currentPage){
        this.nextBtn = false
      }
    },
    prePage(){
      let pages = this.total%this.pageSize ? parseInt(this.total/this.pageSize)+1 : parseInt(this.total/this.pageSize);
      this._getAllUser(--this.currentPage, this.pageSize)
      if(this.currentPage == 1){
        this.preBtn = false
      }
      if(this.currentPage < pages){
        this.nextBtn = true
      }
    },
    // 加载用户
    _getAllUser(currentPage, pageSize){
      var that = this
      // cors访问：http://localhost:6090/api/getUser
      // 代理访问：/api/api/getUser
      // this.$axios.get('/api/api/getAllUser')
      getAllUser(currentPage, pageSize)
      .then(function(res){
        console.log(res)
        if(res.data.success === true){
          that.list = res.data.data
          that.total = res.data.total
        }
      })
      .catch(function(err){
        console.log(err)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px;
}
a {
  color: #42b983;
}
.exit-btn{
  text-align: right;
  margin-right: 20%;
}
.exit-btn a{
  color: #42b983;
}
</style>
