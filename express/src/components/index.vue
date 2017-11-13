<template>
  <div class="index">
    <h1>{{ msg }}</h1>
    <form>
      <input type="text" name="username" v-model="username">
      <input type="text" name="password" v-model="password">
      <a href="javascript:;" @click="addUser">添加</a>
    </form>
    <br/>
    <form>
      <input type="text" name="searchText" v-model="searchText">
      <a href="javascript:;" @click="searchUser">查询</a>
    </form> 
    <br/>
    <ul>
      <li v-for="item in list">
        <span>用户名：{{item.username}}</span> <span>密码：{{item.password}}</span>&nbsp;<a href="javascript:;"  @click="delUser(item)">删除</a>&nbsp;<a href="javascript:;"  @click="showUpdateForm(item)">修改</a>
      </li>
    </ul>
    <br/>
    <form v-show="isUpdateForm">
      <input type="text" name="updateUsername" v-model="updateUsername">
      <input type="text" name="updatePassword" v-model="updatePassword">
      <a href="javascript:;" @click="updateUser">修改</a>
    </form>
  </div>
</template>

<script>
var qs = require('qs')
export default {
  name: 'Index',
  data () {
    return {
      msg: 'vue2.5+express+mongodb',
      username: '',
      password: '',
      searchText: '',
      list: null,
      isUpdateForm: false,
      updateItem: null,
      updateUsername: '',
      updatePassword: ''
    }
  },
  mounted(){
    this.getUser()    
  },
  methods:{
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
          that.getUser()
          that.username = ''
          that.password = ''
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 删除用户
    delUser(item){
      console.log(item.id)
      var that = this
      this.$axios.post('/api/api/delUser',qs.stringify({
        id: item.id
      }))
      .then(function(res){
        console.log(res)
        if(res.data.code === 200){
          that.getUser()
          that.username = ''
          that.password = ''
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 显示修改表单
    showUpdateForm(item){
      console.log(item)
      this.updateItem = null
      this.updateItem = item
      this.isUpdateForm = true
    },
    // 修改用户
    updateUser() {
      var that = this
      this.$axios.post('/api/api/updateUser',qs.stringify({
        id: that.updateItem.id,
        username: that.updateUsername,
        password: that.updatePassword
      }))
      .then(function(res){
        console.log(res)
        if(res.data.code === 200){
          that.getUser()
          that.username = ''
          that.password = ''
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 查询用户
    searchUser(){
      var that = this
      this.$axios.get('/api/api/getUserByName',{
         params: { username: that.searchText }
      })
      .then(function(res){
        console.log(res)
        if(res.data.code === 200){
          that.list = res.data.data
        }
      })
      .catch(function(err){
        console.log(err)
      })
    },
    // 加载用户
    getUser(){
      var that = this
      // cors访问：http://localhost:6090/api/getUser
      // 代理访问：/api/api/getUser
      this.$axios.get('/api/api/getUser')
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
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: block;
  margin: 10px;
}

a {
  color: #42b983;
}
</style>
