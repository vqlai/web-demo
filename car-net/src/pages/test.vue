<template>
  <div class="index">
    <div id="allmap"></div>
    <div>
      <button @click="handlePlay()">播放</button> 
      <button @click="handleStop()">停止</button> 
      <button @click="handlePause()">暂停</button> 
      <button @click="handleContinue()">继续</button> 
    </div>
  </div>
</template>

<script>
import {getTrack} from '@/api/index'
import track from '@/common/libs/track.js'
export default {
  name: 'index',
  data () {
    return {
      bdmap: null,
      trackData: [],
      pointMarker: null,
      trackMarkers: [],
      trackCount: 0,
      travelIsPlay: false,
      travelIsPause: false,
      movingPointIndex: 0,
      trackPlayTimer: null, // 小车运行定时器
      carIcon: null,
      carMarker: null,
      pointDirection: null,
      trackSpeed: 500
      // lushu: null
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
        entity_name: 'vqlai',
        // start_time: 1515143380,
        start_time: 1515380000,
        // end_time: 1515143580,
        end_time: 1515380800
      }
      getTrack(params).then(res => {
        // 百度地图API功能
        this.bdmap = new BMap.Map("allmap",{enableMapClick : false});    // 创建Map实例
        this.bdmap.centerAndZoom(new BMap.Point(res.data.start_point.longitude, res.data.start_point.latitude), 12);  // 初始化地图,设置中心点坐标和地图级别
        this.bdmap.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
        // 创建polyline对象
        let pois = []
        this.trackData = res.data.points
        this.trackCount = this.trackData.length
        console.log(this.trackData)
        // 画轨迹线
        this._DrawMapLine(this.trackData)
      })
    },
    // 创建轨迹点覆盖物
    _createPointMarkers(pointInfo, pType){
      var trackMarker;
      var trackPoint = new BMap.Point(pointInfo.longitude, pointInfo.latitude);
      var pointDirection = track.GetTimeHour(pointInfo.direction);//方向指针号0~11
      var pointIcon = new BMap.Icon(require(`../common/images/node/pnode_${pointDirection}.png`), new BMap.Size(20, 20));
      if (pType != "node"){
        pointIcon = new BMap.Icon(require(`../common/images/${pType}_icon.png`), new BMap.Size(27, 32));
      }

      //描点，创建标注 
      pointIcon.iconAnchor = new BMap.Point(5, 5);
      pointIcon.shadow = "";
      trackMarker = new BMap.Marker(trackPoint, { icon: pointIcon });
      //trackMarker.setTitle(pointInfo.TracklogID);
      if (pType == "node"){
        trackMarker.hide();//先隐藏，再根据播放需要是否显示
      }else{
        trackMarker.setOffset(new BMap.Size(-1, -15));//大图标，偏移确定图片在点正上方
      }

      trackMarker.addEventListener("click", function (){
        let opts = {
          width : 200,     // 信息窗口宽度
          height: 100,     // 信息窗口高度
          title : "test" , // 信息窗口标题
          enableMessage:true //设置允许信息窗发送短息
        }
        let infoWindow = new BMap.InfoWindow('title', opts);  // 创建信息窗口对象
        // var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(pointInfo));  // 创建信息窗口对象  
        this.openInfoWindow(infoWindow);
      });
      this.bdmap.addOverlay(trackMarker);
      return trackMarker;
    },
    _DrawMapLine(tracks){
      var TrackData = tracks;
      var carMarker = null;
      var pointType = "node";//点类型
      var pointLogLat = new BMap.Point(TrackData[0].longitude, TrackData[0].latitude);//起点
      this.bdmap.centerAndZoom(pointLogLat, 13);
      var onLineCoordinates = [];
      for (var i = 0; i < this.trackCount; i++){
        //线上的点
        pointLogLat = new BMap.Point(TrackData[i].longitude, TrackData[i].latitude);
        onLineCoordinates.push(pointLogLat);

        //描点
        if (i == 0)
          pointType = "start";
        else if (i==(this.trackCount - 1))
          pointType = "end";
        else if (TrackData[i].StayTime >= 300 && TrackData[i].LocateType!=2) //基站点不给停标记
          pointType = "stay";
        else
          pointType = "node";

        this.pointMarker = this._createPointMarkers(TrackData[i], pointType);
        this.trackMarkers.push(this.pointMarker);
      }
      //画线
      var polyline = new BMap.Polyline(onLineCoordinates);//BMap.Polyline([point1,point2], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1, strokeStyle: 'slolid' });
      polyline.setStrokeColor("blue");
      polyline.setStrokeWeight(4);
      polyline.setStrokeOpacity(1);
      polyline.setStrokeStyle('solid');
      this.bdmap.addOverlay(polyline);
      //最佳视野
      this.bdmap.setViewport(onLineCoordinates); 
    },
    _playTravel(){   
      console.log(this.trackMarkers)
      for(let [index,item] of this.trackMarkers.entries()){
        if(index == 0 || index == this.trackMarkers.length-1){
          item.show();
        }else{
          item.hide();
        }
      }
      if (this.trackCount > 1){ // trackCount 轨迹点数量
        if (this.trackPlayTimer != null){ // 定时器
          clearInterval(this.trackPlayTimer);
        }
        var TrackData = this.trackData;
        var mPoint = this.trackMarkers[0].getPosition(); //起点
        this.pointDirection = track.GetTimeHour(TrackData[0].direction);//方向指针号0~11
        this.carIcon = new BMap.Icon(require(`../common/images/car/car_p_${this.pointDirection}.png`), new BMap.Size(36, 36), {//小车图片
            //offset: new BMap.Size(0, -5),    //相当于CSS精灵
            imageOffset: new BMap.Size(0, 0)   //图片的偏移量。为了是图片底部中心对准坐标点。
        });
        this.carIcon.iconAnchor = new BMap.Point(5, 5);
        this.carIcon.shadow = "";

        //map.centerAndZoom(mPoint, 15);
        this.movingPointIndex = 0;
        if (this.carMarker != null){
          this.carMarker.setPosition(mPoint);
          //隐藏轨迹点
          for (var i = 1; i < this.trackCount - 1; i++){
            if (TrackData[i].StayTime <300 || TrackData[i].LocateType == 2)
              this.trackMarkers[i].hide();
          }
        }else{
            this.carMarker = new BMap.Marker(mPoint, { icon: this.carIcon });
            this.carMarker.addEventListener("click", function(){
              let opts = {
                width : 200,     // 信息窗口宽度
                height: 100,     // 信息窗口高度
                title : "test" , // 信息窗口标题
                enableMessage:true //设置允许信息窗发送短息
              }
              let infoWindow = new BMap.InfoWindow('title', opts);  // 创建信息窗口对象
              // var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(pointInfo));  // 创建信息窗口对象  
              this.openInfoWindow(infoWindow);
            });
            this.bdmap.addOverlay(this.carMarker);
        }

        // var container = $('div [id="divTrackLog"]');//滚动容器
        // var scrollTo;
        let that = this
        function resetMkPoint(pIndex){
          if (that.travelIsPlay){
            mPoint = that.trackMarkers[pIndex].getPosition();
            that.pointDirection = track.GetTimeHour(TrackData[pIndex].direction);//方向指针号0~11
            console.log(that.pointDirection)
            that.carIcon = new BMap.Icon(require(`../common/images/car/car_p_${that.pointDirection}.png`), new BMap.Size(36, 36));
            that.carMarker.setZIndex(100);
            that.carMarker.setIcon(that.carIcon);
            that.carMarker.setPosition(that.trackMarkers[pIndex].getPosition());
            //carMarker.show();
            //当前点是否居中
            // if (document.getElementById("chkTerCenter").checked){
                // that.bdmap.setCenter(mPoint);
            // }else{//判断是否超出地图范围，超出则设定当前点为中心点
                var bs = that.bdmap.getBounds();   //获取可视区域
                var bssw = bs.getSouthWest();   //可视区域左下角，西南
                var bsne = bs.getNorthEast();   //可视区域右上角，东北

                if (mPoint.lng <= bssw.lng || mPoint.lat <= bssw.lat || mPoint.lng >= bsne.lng || mPoint.lat >= bsne.lat)
                    that.bdmap.setCenter(mPoint);
            // }
            //是否显示轨迹点
            // if (document.getElementById("chkShowPoint").checked){ //&& pIndex > 1 && pIndex < trackCount - 1
                that.trackMarkers[pIndex - 1].show();
            // }

            //轨迹清单行滚动定位
            // if (document.getElementById("chkRoll").checked){
            //     if (scrollTo != null)
            //     {
            //         scrollTo.removeClass("PlayintRowBg");
            //     }

            //     scrollTo = $('#row_' + TrackData[pIndex].TracklogID.toString());
            //     scrollTo.addClass("PlayintRowBg");
            //     container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
            // }

            that.movingPointIndex++;
          }else if (that.travelIsPause == false){//非暂停则重置
            that.movingPointIndex = 0;
          }

          if (that.movingPointIndex < that.trackCount){
            that.trackPlayTimer = setTimeout(
              function () { resetMkPoint(that.movingPointIndex); }, that.trackSpeed
              // $('#selPlaySpeed').val()
            );
            // console.log(1)
          }else{
            that._stopOrEndPlay(1)
            console.log(2)
            //scrollTo.removeClass("PlayintRowBg"); 
            // var alertStr=$("#hdPlayfinished").val() + $("#hdTotalMileage").val() + ":";
            // if (this.trackCount < 1000){
            //     var licheng =parseFloat($("#hdSearchAllMileage").val());

            //     if (licheng <= 0){
            //         alert(alertStr + (Math.round(allmileage * 100) / 100) + "km");
            //     }else{
            //         alert(alertStr + (Math.round(licheng * 100) / 100) + "km");
            //     }
            // }else{
            //     alert(alertStr + (Math.round(allmileage * 100) / 100) + "km(1000" + $("#hdShowTrackPoint").val() + ")");
            // }
          }
        }

        that.trackPlayTimer = setTimeout(
          function () { resetMkPoint(1); }, that.trackSpeed
          // $('#selPlaySpeed').val()
        );
      }else{
          clearInterval(that.trackPlayTimer);
      }
    },
    _stopOrEndPlay(tag){
      clearInterval(this.trackPlayTimer);
      this.travelIsPlay = false;
      this.travelIsPause = false;
      // $("#btnTrackPlay").removeClass("hidden");
      // $("#btnTrackStop").addClass("hidden");
      // $("#btnTrackQuery").removeClass("hidden");
      // $("#btnTrackPause").addClass("hidden");
      // $("#btnTrackContinue").addClass("hidden");
      if (tag == 0 && this.carMarker != null){//主动停止时汽车回到到原点
        this.carIcon = new BMap.Icon(require(`../common/images/car/car_p_${this.pointDirection}.png`), new BMap.Size(36, 36));
        this.carMarker.setIcon(this.carIcon);
        this.carMarker.setPosition(this.trackMarkers[0].getPosition());
        this.bdmap.setCenter(this.trackMarkers[0].getPosition());
      }
    },
    // 播放轨迹
    handlePlay() {
      if (this.trackCount >= 2){
        this.travelIsPlay = true;
        this.travelIsPause = false;
        this._playTravel();
      }else{
        this.trackCount = 0;
        // mapClearOverlays(-1);
        this.bdmap.clearOverlays();
        // TrackQuery(); 
        this._getTrack();
      }
    },
    // 停止播放轨迹
    handleStop() {
      this._stopOrEndPlay(0)
    },
    // 暂停播放轨迹
    handlePause() {
      this.travelIsPause = true;
      this.travelIsPlay = false;
    },
    // 暂停后继续播放
    handleContinue(){
      this.travelIsPause = false;
      this.travelIsPlay = true;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#allmap {width: 100%; height:800px; overflow: hidden;}
</style>
