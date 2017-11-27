<template>
	<div class="login">
		<img src="../assets/logo.png">
		<div v-show="msg" v-text="msg" class="msg"></div>
		<form action="">
			<div>帐号：<input type="text" name="username" v-model="username"></div>
      <div>密码：<input type="password" name="password" v-model="password"></div>
      <div><a href="javascript:;" @click="handleLogin">登录</a></div>
		</form>
	</div>
</template>

<script>
import {login} from '../api/user.js'
// var qs = require('qs')
	export default{
		data() {
			return{
				username: '',
				password: '',
				msg: ''
			}
		},
		mounted(){},
		methods:{
			handleLogin(){
				// var that = this
				// this.$axios.post('/api/api/login',qs.stringify({
				//   username: that.username,
				//   password: that.password
				// }))
				login({
					username: this.username,
					password: this.password
				}).then((res) => {
				  console.log(res)
				  if(res.data.success === true){
				  	let token = res.data.data.token;
				  	sessionStorage.setItem('username', this.username);
				  	sessionStorage.setItem('token', token);
				  	// 跳转到token失效前访问中的页面
            let redirect = decodeURIComponent(this.$route.query.redirect || 'index')
				    this.$router.push({
              // path: '/index'
              path: redirect
            });
				  }
				  if(res.data.success === false){
				  	this.msg = res.data.msg
				  	if(sessionStorage.token){
				  		sessionStorage.removeItem('token');
				  		sessionStorage.removeItem('username');
				  	}
				  }
				})
				.catch((err) => {
				  console.log(err)
				})
			}
		}
	}
</script>

<style scoped>
	.login form{
		width: 40%;
		height: 300px;
		margin: 30px auto 0;
	}
	.login form > div{
		padding: 30px 0 0 0;
	}
	.login a{
		/*display: block;*/
		padding: 4px 2%;
		text-decoration: none;
		color: #42b983;
		border: 1px solid #42b983;
	}
	.msg{
		color: red;
	}
</style>