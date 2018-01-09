<template>
  <section class="index">    
		<CHeader></CHeader>
	  <el-container>
	    <el-main>Main</el-main>
	    <el-aside width="300px">Aside</el-aside>
	  </el-container>
	  <!-- <el-footer>bottom</el-footer> -->
  </section> 
</template>

<script>
import CHeader from '@/components/c-header.vue'
export default {
  name: 'c-index',
  data () {
    return {
    }
  },
  mounted() {
  },
  methods:{
  },
  components:{
  	CHeader
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.index{
		width: 100%;
		height: 100%;
	}
	.el-container{
		width: 100%;
		height: 100%;
	}
  .el-main {
  	padding: 0;
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
  }
  .el-aside {
  	height: 100%;
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }
  /*.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    height: 120px!important;
  }*/
</style>
