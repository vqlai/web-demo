<style scoped >
  @import "./test.css";
</style>
<template>
  <div class="test">
   
    <img src="../../common/imgs/logo.png" alt="">
    <router-link to="/test2" tag="a">go test2</router-link>
    <div class="img-box"></div>
    <loading color="black" type="spinner"/>
    <loading color="white" type="spinner"/>
    <p>{{ result }}</p>
  </div>
</template>

<script>
import {getRank} from '@/api/test.js'
export default {
  name: 'test',
  data () {
    return {
      result: ''
    }
  },
  created(){
    this.getRank()
  },
  methods: {
    getRank() {
      let params = {
        season_id: 10219,
        version: 0,
        refer: 'data_tab',
        type: 'total_ranking',
        from: 'msite_com',
      }
      getRank(params).then((res)=>{
        console.log(res)
        this.result = res.data.content.description
      })
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  
</style>
