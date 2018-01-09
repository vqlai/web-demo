<template>
  <div class="test2">
    <div id="allmap"></div>
    <div>
      <button @click="handleRun()">开始</button> 
      <button @click="handleStop()">停止</button> 
      <button @click="handlePause()">暂停</button> 
    </div>
  </div>
</template>

<script>
import {getTrack} from '@/api/index'
export default {
  name: 'test2',
  data () {
    return {
      bdmap: null,
      lushu: null
    }
  },
  mounted() {
    this._getTrack()
  },
  methods:{
    _getTrack(){
      let params = {
        ak: 'ti54rLodpyERCGze5DNxvXkx02zezS9C',
        service_id: '157644',
        entity_name: 'cisco',
        start_time: 1514976090,
        end_time: 1514976990
      }
      getTrack(params).then(res => {
        console.log(res)
        // 百度地图API功能
        this.bdmap = new BMap.Map("allmap",{enableMapClick : false});    // 创建Map实例
        this.bdmap.centerAndZoom(new BMap.Point(res.data.start_point.longitude, res.data.start_point.latitude), 12);  // 初始化地图,设置中心点坐标和地图级别
        this.bdmap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        // 创建polyline对象
        let pois = [
          // new BMap.Point(116.350658,39.938285),
          // new BMap.Point(116.386446,39.939281),
          // new BMap.Point(116.389034,39.913828),
          // new BMap.Point(116.442501,39.914603)
        ];
        for(let item of res.data.points){
          pois.push(new BMap.Point(item.longitude, item.latitude))
        }
        this._CreatePointMarkers(res.data.start_point.longitude, res.data.start_point.latitude,'start')
        this._CreatePointMarkers(res.data.end_point.longitude, res.data.end_point.latitude,'end')

        // var sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_OPEN_ARROW, {
        //     scale: 0.6,//图标缩放大小
        //     strokeColor:'#fff',//设置矢量图标的线填充颜色
        //     strokeWeight: '2',//设置线宽
        // });
        // var icons = new BMap.IconSequence(sy, '10', '30');
        // var polyline =new BMap.Polyline(pois, {
        //    enableEditing: false,//是否启用线编辑，默认为false
        //    enableClicking: true,//是否响应点击事件，默认为true
        //    icons:[icons],
        //    strokeWeight:'5',//折线的宽度，以像素为单位
        //    strokeOpacity: 0.5,//折线的透明度，取值范围0 - 1
        //    strokeColor:"#111" //折线颜色
        // });

        let polyline = new BMap.Polyline(pois);
        polyline.setStrokeColor("blue");
        polyline.setStrokeWeight(4);
        polyline.setStrokeOpacity(1);
        polyline.setStrokeStyle('slolid');
        this.bdmap.addOverlay(polyline); // 增加折线
        //最佳视野
        this.bdmap.setViewport(pois);

        this.lushu = new BMapLib.LuShu(this.bdmap, pois, {
         defaultContent:"<p>test</p>",
         autoView:true,//是否开启自动视野调整，如果开启那么路书在运动过程中会根据视野自动调整
         icon  : new BMap.Icon('http://lbsyun.baidu.com/jsdemo/img/car.png', new BMap.Size(52,26),{anchor : new BMap.Size(26, 13)}),
         speed: 1000,
         enableRotation:true,//是否设置marker随着道路的走向进行旋转
         landmarkPois: []
        });        
      })
    },
    _CreatePointMarkers(lon, lat, type){
      let point = new BMap.Point(lon, lat);
      let myIcon = new BMap.Icon(require(`../common/images/${type}_icon.png`), new BMap.Size(30,40));
      let marker = new BMap.Marker(point, {icon:myIcon});  // 创建标注
      marker.setZIndex(1);
      marker.setTop(false);
      console.log(point);
      marker.setOffset(new BMap.Size(2, 0));
      let opts = {
        width : 200,     // 信息窗口宽度
        height: 100,     // 信息窗口高度
        title : "test" , // 信息窗口标题
        enableMessage:true //设置允许信息窗发送短息
      }
      let infoWindow = new BMap.InfoWindow('title', opts);  // 创建信息窗口对象
      marker.addEventListener("click", ()=>{
        this.bdmap.openInfoWindow(infoWindow, point);
      });
      this.bdmap.addOverlay(marker);  
    },
    handleRun() {
      this.lushu.start();
    },
    handleStop() {
      this.lushu.stop();
    },
    handlePause() {
      this.lushu.pause();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#allmap {width: 100%; height:800px; overflow: hidden;}
</style>
