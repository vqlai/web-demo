<template>
  <div class="hello">
    <form>
      <input type="text" name="username" v-model="username">
      <input type="text" name="password" v-model="password">
      <a href="javascript:;" @click="addUser">添加</a>
    </form>
    <ul>
      <li v-for="item in list">
        <span>用户名：{{item.username}} 密码：{{item.password}}</span>&nbsp;<a href="javascript:;"  @click="deleteUser(item)">删除</a>&nbsp;<a href="javascript:;"  @click="showModifyForm(item)">修改</a>
      </li>
    </ul>
    <br/>
    <form v-show="isModifyForm">
      <input type="text" name="modifyUsername" v-model="modifyUsername">
      <input type="text" name="modifyPassword" v-model="modifyPassword">
      <a href="javascript:;" @click="modifyUser">确定</a>
    </form>
  </div>
</template>

<script>
var qs = require('qs')
export default {
  name: 'HelloWorld',
  data () {
    return {
      username: '',
      password: '',
      list: [],
      isModifyForm: false,
      modifyItem: null,
      modifyUsername: '',
      modifyPassword: ''
    }
  },
  mounted(){
    this.getAllUser()    
  },
  methods:{
    // 显示修改表单
    showModifyForm(item){
      console.log(item)
      this.modifyItem = null
      this.modifyItem = item
      this.isModifyForm = true
    },
    modifyUser(){
      var that = this
      this.$axios.post(`/api/api/modifyUser/${that.modifyItem._id}`,qs.stringify({
        username: that.modifyUsername,
        password: that.modifyPassword
      }))
      .then(function(res){
        console.log(res)
        if(res.data.code === 200){
          that.getAllUser()
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
    addUser(){
      var that = this
      // cors访问：http://localhost:6090/api/addUser
      // 代理访问：/api/api/addUser
      this.$axios.post('/api/api/addUser',qs.stringify({
        username: this.username,
        password: this.password
      }))
      .then(function(res){
        console.log(res)
        if(res.data.code === 200){
          that.getAllUser()
          that.username = ''
          that.password = ''
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 删除用户
    deleteUser(item){
      console.log(item._id)
      var that = this
      this.$axios.post('/api/api/deleteUserById',qs.stringify({
        id: item._id
      }))
      .then(function(res){
        console.log(res)
        if(res.data.code === 200){
          that.getAllUser()
          that.username = ''
          that.password = ''
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 加载用户
    getAllUser(){
      var that = this
      // cors访问：http://localhost:6090/api/getUser
      // 代理访问：/api/api/getUser
      this.$axios.get('/api/api/getAllUser')
      .then(function(res){
        console.log(res)
        if(res.data.code === 200){
          that.list = res.data.data
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
</style>
