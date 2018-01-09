<template>
	<!-- 注意el-header/el-footer默认高度是60px而且是动态设置绑定的 -->
  <el-header class="nav-menu">
	  <el-row type="flex" class="row-bg">
	    <el-col :span="4"><div class="">logo</div></el-col>
	    <el-col :span="16">
	    	<el-menu :default-active="currentPath" active-text-color="#409EFF" class=""	mode="horizontal" @select="handleSelect" router>
	    	  <el-menu-item index="/index">首页</el-menu-item>
	    	  <el-menu-item index="/monitor">监控中心</el-menu-item>
	    	  <el-menu-item index="/track">轨迹管理</el-menu-item>
	    	  <el-menu-item index="/rail">电子围栏</el-menu-item>
	    	  <el-submenu index="/other">
	    	    <template slot="title">其他</template>
	    	    <el-menu-item index="/demo1">选项1</el-menu-item>
	    	    <el-menu-item index="/demo2">选项2</el-menu-item>
	    	  </el-submenu>
	    	</el-menu>
	    </el-col>
	    <el-col :span="4"><div class="">exit</div></el-col>
	  </el-row>
  </el-header>
</template>

<script>
export default {
  name: 'car-header',
  data () {
    return {
    	currentPath: this.$route.path
    }
  },
  mounted() {
  },
  methods:{
  	handleSelect(key, keyPath) {
      console.log(key, keyPath);
      // this.activePath = key
      // localStorage.setItem('currentPath',key)
      // this.$router.push({
      //   path: redirect
      // },()=>{})
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.el-header {
		position: absolute;
		top: 0;
		left: 0;
    display: flex;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #fff;
    color: #333;
  }
  .el-row{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		border-bottom: 1px solid #e6e6e6;
  }
  /*注意box-sizing只在设置了宽高的元素中生效*/
  .el-menu{
  	height: 60px;
  	box-sizing: border-box;
  }
  .el-menu-item{
  	height: 59px;
  	box-sizing: border-box;
  }
  .el-menu-item:hover{
  	color: #409EFF;
  	/*border-bottom-color: #409EFF!important;*/
  	/*background: #e6eff9;*/
  }
  .el-menu-item:focus{
  	color: #909399;
  }
</style>
