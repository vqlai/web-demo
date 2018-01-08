var map;
var disTool;
var trafficCtrl;
var newPoint = { pIndex: 0, lon: 0, lat: 0, Direction: 0 }; //实时跟踪最新点
var monitorMarker = [];//实时跟踪累计的标注点
var TrackData;
//var travelOpts=$("#selPlayTimeSection").find('option.optTravel').html();
//清除覆盖物
function mapClearOverlays()
{
    map.clearOverlays();
}

//根据id移除覆盖物:id为字符串类型
function clearMarker(id)
{
    var allOverlay = map.getOverlays();
    var tempIndex = 0;
    for (var i = 0; i < allOverlay.length; i++)
    {
        if (allOverlay[i].getTitle() == id)
        {
            map.removeOverlay(allOverlay[i]);
            return false;
        }
    }
}

//初始化地图
function initMap()
{
    //$('#lastcss').after('<link href="/assets/plugins/baidu-map/css/TrafficControl_min.css" rel="stylesheet" type="text/css" />');//路况样式
    //$('#lastjs').after('<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=KyRER47el1c0CFlaPSby4nZzH5fw5Qop"></script>');//异步加载
    //$('#lastjs').after('<script type="text/javascript" src="/assets/plugins/baidu-map/js/TrafficControl_min.js"></script>');//路况脚本
    $('#lastjs').after('<script type="text/javascript" src="/assets/plugins/baidu-map/js/DistanceTool_min.js"></script>');//测距脚本
    map = new BMap.Map("divMapCountrol");            // 创建Map实例

    var defaultLat = 108.953514;
    var defaultLng = 34.276168;
    var dengji = 5;
    var _IDPath = parseInt($('#IDPath').val());
    //湖北日报默认中心位置：蔡甸 （西经0度 北纬114度30分）。
    if (_IDPath == "1/1012/3404/8394/") {
        defaultLat = 114.04561833;
        defaultLng = 30.54462333;
        dengji = 12;
    }
    var point = new BMap.Point(defaultLat, defaultLng); // 创建中心点坐标(西安)
    map.centerAndZoom(point, dengji);         // 初始化地图,设置中心点坐标和地图级别。
    map.addControl(new BMap.NavigationControl());
    var lang = $("#MapTypeControl").val();
    if (lang != "fa-IR") {
        map.addControl(new BMap.MapTypeControl({ mapTypes: [BMAP_NORMAL_MAP, BMAP_HYBRID_MAP] }));
    } 
    map.enableKeyboard();
    map.enableScrollWheelZoom();
    map.addEventListener("tilesloaded", function ()
    {
        //initTrafficControl();//初始化交通路况控件
            
        disTool = new BMapLib.DistanceTool(map);//初始化测距控件
    });//地图全部加载完之后，才开始添加路况控件
}



//在地图上显示家庭图标
function ShowHomePoint(lat,lon) {
    //创建家庭图标
    var pt = new BMap.Point(lat, lon);
    var myIcon = new BMap.Icon("/assets/img/icon/home.png", new BMap.Size(36, 36));
    var marker2 = new BMap.Marker(pt, { icon: myIcon });  // 创建标注
    var label = new BMap.Label('<span style="cursor:pointer; top: 35px;left:5px;position: absolute; font-family: simshei; font-size: 16px;">家</span>', { offset: new BMap.Size(30, -30) });
    label.setStyle({ color: "black", "max-width": "none", border: "0px" });
    marker2.setLabel(label); //添加百度label
    map.addOverlay(marker2);
}

//初始化交通路况控件
function initTrafficControl()
{
    trafficCtrl = new BMapLib.TrafficControl({
        showPanel: false //是否显示路况提示面板
    });
    map.addControl(trafficCtrl);
    trafficCtrl.setAnchor(BMAP_ANCHOR_BOTTOM_RIGHT);
}



function ShowSinglePointPanel(idex) {
    var point = new BMap.Point(jsonTrack[idex].BLongitude, jsonTrack[idex].BLatitude);
    map.centerAndZoom(point, 15);
    var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(jsonTrack[idex]));
    map.openInfoWindow(infoWindow,point);
}

//最新定位点描点
function CreateLocationMarkers(terID, lon, lat, iconName, panelContent, clearTag,icon)
{
    if (clearTag == 2)
    {
        map.clearOverlays();
    }
    else if (clearTag == 1)
    {
        clearMarker(terID.toString());
    }
    var myIcon = new BMap.Icon('/assets/img/device/'+icon+'/'+icon+'_' + iconName + '.png', new BMap.Size(36, 36));//图标要动态切换
    var point = new BMap.Point(lon, lat);
    var infoWindow = new BMap.InfoWindow(panelContent);  // 创建信息窗口对象    
    var marker = new BMap.Marker(point, { icon: myIcon });
    marker.setTitle(terID);
    marker.addEventListener("click", function ()
    {
        this.openInfoWindow(infoWindow);
    });
    map.addOverlay(marker);
    marker.openInfoWindow(infoWindow);
    return marker;
}


//异步加载实时信息(单个)
function loadRealTimeInfo(selectedTerId,tag)
{
    var iconName;
    var startMarker;
    $.post('/Monitor/RealTimeInfo', { TerIds: selectedTerId, SortField: '', SortWay: '' }, function (vms)
    {
        var vm = vms[0];
        if (vm.TerId > 0)
        {
            newPoint.pIndex = 0;
            newPoint.lon = vm.BLongitude;
            newPoint.lat = vm.BLatitude;
            newPoint.Direction = vm.Direction;

            ///绑路功能
            var boundRoadType = vm.IndustryType;
            $("#selBoundRoad").find("option[value='" + boundRoadType + "']").attr("selected", true);
            $("#divPopoverText").html("推荐方案");

            $("#divTerName").html(vm.TerName == "" ? vm.IMEI : vm.TerName);
            iconName = vm.RunStatus + '_' + vm.Directions.Key;
            startMarker = CreateLocationMarkers(vm.TerId, vm.BLongitude, vm.BLatitude, iconName, TrackLocationInfoPanel(vm), 2,vm.Icon);

            monitorMarker = [];//清空数组
            monitorMarker.push(startMarker);
            map.centerAndZoom(startMarker.getPosition(), 15); //alert(travelOpts);
            if (vm.TerTypeCode == "S28" || vm.TerTypeCode=="MT300S" || vm.TerTypeCode=="S33" || vm.TerTypeCode.indexOf("T9") > -1)
            {
                /*$("#selPlayTimeSection").val("0");
                $("#selPlayTimeSection").find('option.optTravel').remove();*/
                $("#selPlayTimeSection").val("0").find('option.optTravel').attr('disabled', true);
                $("#divUserTimeSection").removeClass("hidden");
                $('#selShieldSpeed').find('option[value="0"]').attr("selected", true);
            } else {
                /*$("#selPlayTimeSection").val("10");
                $("#selPlayTimeSection").append(travelOpts);*/
                $("#selPlayTimeSection").find('option.optTravel').attr('disabled', false);
                //$("#divUserTimeSection").addClass("hidden");
            }

            if (tag == 1)
            {
                //实时监控模式初始点，在轨迹清单中表元素
                $("#divTrackLog").html(AddTrackDataRow(vm, newPoint.pIndex));
            }
        }
        else
        {
            alert('Data Request Error!');
        }
    });
}

//实时监控查找新的点
function loadNewLocation()
{
    var selectedTerId = $("#hdMonitorTerID").val();
    var iconName;
    var newMarker;
    $.post('/Monitor/RealTimeInfo', { TerIds: selectedTerId, SortField: '', SortWay: '' }, function (vms)
    {
        var vm = vms[0];
        if (vm.TerId > 0)
        {
            if (newPoint.lon != vm.BLongitude || newPoint.lat != vm.BLatitude)
            {//有新的位置：旧点切换标注图片为轨迹点，新点增加car标注，并画线
                var pointDirection = Track.GetTimeHour(newPoint.Direction);//方向指针号0~11
                var pointIcon = new BMap.Icon("/assets/img/icon/pnode_" + pointDirection + ".png", new BMap.Size(20, 20));
                monitorMarker[newPoint.pIndex].setIcon(pointIcon); 

                iconName = vm.RunStatus + '_' + vm.Directions.Key;
                newMarker = CreateLocationMarkers(vm.TerId, vm.BLongitude, vm.BLatitude, iconName, TrackLocationInfoPanel(vm), 0,vm.Icon);

                var carIcon = new BMap.Icon('/assets/img/device/car/car_' + vm.RunStatus + '_' + vm.Directions.Key + '.png', new BMap.Size(36, 36));
                var point1 = new BMap.Point(newPoint.lon, newPoint.lat);
                var point2 = new BMap.Point(vm.BLongitude, vm.BLatitude);
                var polyline = new BMap.Polyline([point1, point2], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1, strokeStyle: 'slolid' });
                map.addOverlay(polyline);

                newPoint.pIndex++;
                newPoint.lon = vm.BLongitude;
                newPoint.lat = vm.BLatitude;
                newPoint.Direction = vm.Direction;

                monitorMarker.push(newMarker);
                map.setCenter(newMarker.getPosition());

                $("#tb_Tracklog>tbody>tr:first").before(AddTrackDataRow(vm, newPoint.pIndex));

                $("#divTracingDesc").html($("#runtime_resx").val() + ":" + vm.LocateTime.substring(10));
            }
            else
            {
                $("#divTracingDesc").html($("#hdTracingDesc").val() + ":" +  new Date().Format(" HH:mm:ss"));
            }
        }
        else
        {
            alert('Data Request Error!');
        }
    });
}

//轨迹点描点
function CreatePointMarkers(pointInfo, pType)
{
    var trackMarker;
    var trackPoint = new BMap.Point(pointInfo.BLongitude, pointInfo.BLatitude);

    var pointDirection = Track.GetTimeHour(pointInfo.Direction);//方向指针号0~11
    var pointIcon = new BMap.Icon("/assets/img/icon/pnode_" + pointDirection + ".png", new BMap.Size(20, 20));
    if (pType != "node")
    {
        pointIcon = new BMap.Icon("/assets/img/" + pType + "_icon.png", new BMap.Size(27, 32));
    }

    //描点，创建标注 
    pointIcon.iconAnchor = new BMap.Point(5, 5);
    pointIcon.shadow = "";
    trackMarker = new BMap.Marker(trackPoint, { icon: pointIcon });
    //trackMarker.setTitle(pointInfo.TracklogID);
    if (pType == "node")
    {
        trackMarker.hide();//先隐藏，再根据播放需要是否显示
    }
    else
    {
        trackMarker.setOffset(new BMap.Size(-1, -15));//大图标，偏移确定图片在点正上方
    }

    trackMarker.addEventListener("click", function ()
    {
        var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(pointInfo));  // 创建信息窗口对象  
        this.openInfoWindow(infoWindow);
    });
    map.addOverlay(trackMarker);

    return trackMarker;
}

//画轨迹线
function DrawMapLine(tracks,homepoint)
{
    ShowHomePoint(homepoint.split(',')[0], homepoint.split(',')[1]);
    TrackData = tracks;
    carMarker = null;
    var pointType = "node";//点类型
    var pointLogLat = new BMap.Point(TrackData[0].BLongitude, TrackData[0].BLatitude);//起点 

    map.centerAndZoom(pointLogLat, 13);
    var onLineCoordinates = [];
    for (var i = 0; i < trackCount; i++)
    {
        //线上的点
        pointLogLat = new BMap.Point(TrackData[i].BLongitude, TrackData[i].BLatitude);
        onLineCoordinates.push(pointLogLat);

        //描点
        if (i == 0)
            pointType = "origin";
        else if (i==(trackCount - 1))
            pointType = "terminus";
        else if (TrackData[i].StayTime >= 300 && TrackData[i].LocateType!=2) //基站点不给停标记
            pointType = "stay";
        else
            pointType = "node";

        pointMarker = CreatePointMarkers(TrackData[i], pointType);

        trackMarkers.push(pointMarker);
    }
    //画线
    var polyline = new BMap.Polyline(onLineCoordinates);//BMap.Polyline([point1,point2], { strokeColor: "blue", strokeWeight: 4, strokeOpacity: 1, strokeStyle: 'slolid' });
    polyline.setStrokeColor("blue");
    polyline.setStrokeWeight(4);
    polyline.setStrokeOpacity(1);
    polyline.setStrokeStyle('solid');
    map.addOverlay(polyline);
    //最佳视野
    map.setViewport(onLineCoordinates);
}


//开始播放
function playTravel()
{   
    if (trackCount > 1) // trackCount 轨迹点数量
    {
        if (trackPlayTimer != null) // 定时器
        {
            clearInterval(trackPlayTimer);
        }

        var mPoint = trackMarkers[0].getPosition(); //起点
        var carIcon = new BMap.Icon("/assets/img/device/car/car_p_" + Track.GetTimeHour(TrackData[0].Direction) + ".png", new BMap.Size(36, 36), {//小车图片
            //offset: new BMap.Size(0, -5),    //相当于CSS精灵
            imageOffset: new BMap.Size(0, 0)   //图片的偏移量。为了是图片底部中心对准坐标点。
        });
        carIcon.iconAnchor = new BMap.Point(5, 5);
        carIcon.shadow = "";

        //map.centerAndZoom(mPoint, 15);
        movingPointIndex = 0;

        if (carMarker != null)
        {
            carMarker.setPosition(mPoint);
            //隐藏轨迹点
            for (var i = 1; i < trackCount - 1; i++)
            {
                if (TrackData[i].StayTime <300 || TrackData[i].LocateType == 2)
                    trackMarkers[i].hide();
            }
        }
        else
        {
            carMarker = new BMap.Marker(mPoint, { icon: carIcon });
            carMarker.addEventListener("click", SetPointInfoWindow);
            map.addOverlay(carMarker);
        }

        var container = $('div [id="divTrackLog"]');//滚动容器
        var scrollTo;

        function resetMkPoint(pIndex)
        {
            if (travelIsPlay)
            {
                mPoint = trackMarkers[pIndex].getPosition();
                carIcon = new BMap.Icon("/assets/img/device/car/car_p_" + Track.GetTimeHour(TrackData[pIndex].Direction) + ".png", new BMap.Size(36, 36));
                carMarker.setIcon(carIcon);
                carMarker.setPosition(trackMarkers[pIndex].getPosition());
                //carMarker.show();
                //当前点是否居中
                if (document.getElementById("chkTerCenter").checked)
                {
                    map.setCenter(mPoint);
                }
                else
                {//判断是否超出地图范围，超出则设定当前点为中心点
                    var bs = map.getBounds();   //获取可视区域
                    var bssw = bs.getSouthWest();   //可视区域左下角，西南
                    var bsne = bs.getNorthEast();   //可视区域右上角，东北

                    if (mPoint.lng <= bssw.lng || mPoint.lat <= bssw.lat || mPoint.lng >= bsne.lng || mPoint.lat >= bsne.lat)
                        map.setCenter(mPoint);
                }
                //是否显示轨迹点
                if (document.getElementById("chkShowPoint").checked)
                { //&& pIndex > 1 && pIndex < trackCount - 1
                    trackMarkers[pIndex - 1].show();
                }

                //轨迹清单行滚动定位
                if (document.getElementById("chkRoll").checked)
                {
                    if (scrollTo != null)
                    {
                        scrollTo.removeClass("PlayintRowBg");
                    }

                    scrollTo = $('#row_' + TrackData[pIndex].TracklogID.toString());
                    scrollTo.addClass("PlayintRowBg");
                    container.scrollTop(scrollTo.offset().top - container.offset().top + container.scrollTop());
                }

                movingPointIndex++;
            }
            else if (travelIsPause == false)
            {//非暂停则重置
                movingPointIndex = 0;
            }

            if (movingPointIndex < trackCount)
            {
                trackPlayTimer = setTimeout(
                    function () { resetMkPoint(movingPointIndex); },
                    $('#selPlaySpeed').val()
                );
            }
            else
            {
                stopOrEndPlay(1);
                //scrollTo.removeClass("PlayintRowBg"); 
                var alertStr=$("#hdPlayfinished").val() + $("#hdTotalMileage").val() + ":";
                if (trackCount < 1000)
                {
                    var licheng =parseFloat($("#hdSearchAllMileage").val());

                    if (licheng <= 0)
                    {
                        alert(alertStr + (Math.round(allmileage * 100) / 100) + "km");
                    }
                    else
                    {
                        alert(alertStr + (Math.round(licheng * 100) / 100) + "km");
                    }
                }
                else
                {
                    alert(alertStr + (Math.round(allmileage * 100) / 100) + "km(1000" + $("#hdShowTrackPoint").val() + ")");
                }
            }
        }

        trackPlayTimer = setTimeout(
            function () { resetMkPoint(1); },
            $('#selPlaySpeed').val()
        );
    }
    else
    {
        clearInterval(trackPlayTimer);
    }
}

function SetPointInfoWindow()
{
    var infoWindow = new BMap.InfoWindow(Track.TrackPointInfoPanel(TrackData[movingPointIndex - 1]));  // 创建信息窗口对象
    this.openInfoWindow(infoWindow);
}

//停止播放或播放完毕
function stopOrEndPlay(tag)
{
    clearInterval(trackPlayTimer);
    travelIsPlay = false;
    travelIsPause = false;
    $("#btnTrackPlay").removeClass("hidden");
    $("#btnTrackStop").addClass("hidden");
    $("#btnTrackQuery").removeClass("hidden");
    $("#btnTrackPause").addClass("hidden");
    $("#btnTrackContinue").addClass("hidden");
    if (tag == 0 && carMarker != null)
    {//主动停止时汽车回到到原点
        carIcon = new BMap.Icon("/assets/img/device/car/car_p_" + Track.GetTimeHour(TrackData[0].Direction) + ".png", new BMap.Size(36, 36));
        carMarker.setIcon(carIcon);
        carMarker.setPosition(trackMarkers[0].getPosition());
        map.setCenter(trackMarkers[0].getPosition());
    }
}