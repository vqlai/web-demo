<template>
  <div>
    news pages
  </div>
</template>

<script>
  export default {
  	data() {
  		return {

  		}
  	},
  	created() {

  	},
  	mounted() {
      this.$http.post('http://app.api.12thman.com.cn/api/v2_2/menu/index',{
      	  params: {
	      source: 'wechat',
		  app_status_time: 0,
		  version: '2.3.32',
		  sign: '202cb962ac59075b964b07152d234b70'
	    }
	  })
	  .then(function (response) {
	    console.log(response);
	  })
	  .catch(function (error) {
	    console.log(error);
	  });
  	},
  	methods: {

  	},
  	computed: {

  	},
  	watch: {

  	}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
</style>