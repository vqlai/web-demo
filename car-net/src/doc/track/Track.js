
var trackCount = 0;
var travelIsPlay = false;
var travelIsPause = false;
var exportWaitSec = 10;
var firstTerID = $("#hdMonitorTerID").val();
var exportTimer;
var Track = function (){
    var trackingTimer;//实时跟踪刷新定时器对象
    var refreshTime = 15;//实时跟踪刷新时间为15秒
    var countdown = 30;//实时跟踪刷新时间倒计时 

    QuickSidebar.init();//侧滑代理商树初始化,监控中心页面才有

    //隐藏右侧设备列表check列，轨迹管理不需要
    $('#myterlist thead tr').find('th:eq(0)').hide();
    $('#agentterlist thead tr').find('th:eq(0)').hide(); $('#agentlist_thead colgroup col:eq(0)').remove(); $('#agentterlist colgroup col:eq(0)').remove(); $('#agentlist_thead thead tr:eq(0) th:eq(0)').remove();
    $('#myattentlist thead tr').find('th:eq(0)').hide(); $('#myattentlist_thead colgroup col:eq(0)').remove(); $('#myattentlist colgroup col:eq(0)').remove(); $('#myattentlist_thead thead tr:eq(0) th:eq(0)').remove();
    //$(':checkbox').attr('checked', false); 

    //我的设备或设备列表设备名称链接点击事件
    $(document.body).on('click', '.device', function () {
        var terid = $(this).attr('data-val'); 
        
        //可能播放中点了另外一个，所以必须执行停止事件
        if (travelIsPlay == true || trackCount>0)
        {
            trackCount = 0;
            stopOrEndPlay(0);
        }
        
        $("#divTrackLog").html("");
        $("#divTravelList").html($("#hdPleaseQurey").val());

        $("#hdMonitorTerID").val(terid);
        if ($.cookie)
        {
            $.cookie('TerID', terid, { path: '/' });
            $.cookie('TerName', $(this).html(), { path: '/' });
        }
        loadRealTimeInfo(terid,$("#hdMonitorOpType").val());
    });

    $(document).ready(function ()
    {        
        //轨迹风险评估
        $("#btnabnormal").click(function ()
        {
            var id = $("#hdAbnormalID").val();
            var title = $(this).attr('data-title');
            layer.open({ type: 2, title: title, area: ['680px', '420px'], offset: '50px', content: '/RiskManag/_AssessEdit?track=1&id='+id });
        });
        //轨迹回放
        $("#rdoRePlay").click(function ()
        {
            $('#hdMonitorOpType').val($("#rdoRePlay").val());
            ChangeMonitorOpType($("#rdoRePlay").val())
        });

        //实时监控
        $("#rdoMonitor").click(function ()
        {
            $('#hdMonitorOpType').val($("#rdoMonitor").val());
            ChangeMonitorOpType($("#rdoMonitor").val())
        });

        //切换轨迹回放的时间范围
        $("#selPlayTimeSection").change(function ()
        {
            if ($("#selPlayTimeSection").val() == 0)
            {
                $("#divUserTimeSection").removeClass("hidden");
            }
            else
            {
                $("#divUserTimeSection").addClass("hidden");
            }
        });

        $("#selMonitorRefresh").change(function ()
        {
            //$("#lblMonitorRefresh").html($("#selMonitorRefresh").find("option:selected").text());
            if (trackingTimer)
            {
                monitorRefresh(false);

                monitorRefresh(true);
            }
            else
            {
                $('#lblMonitorRefresh').text($("#selMonitorRefresh").val() + $('#second_resx').val());
            }
        });

        //查询事件
        $("#btnTrackQuery").click(function ()
        {
            if ($("#hdMonitorTerID").val() != "")
            {
                $("#hdQueryAndPlay").val(0);
                Common.startPageLoading({ message: $('body').attr('data-loading') });
                trackCount = 0;
                mapClearOverlays(-1);
                TrackQuery(); 
            }
            else
            {
                alert($("#hdUnSelectedTer").val());
            }

        });

        //暂停事件
        $("#btnTrackPause").click(function ()
        {
            $("#btnTrackContinue").removeClass("hidden");
            $("#btnTrackPause").addClass("hidden");
            travelIsPause = true;
            travelIsPlay = false;
        });

        //暂停后继续事件
        $("#btnTrackContinue").click(function ()
        {
            $("#btnTrackPause").removeClass("hidden");
            $("#btnTrackContinue").addClass("hidden");
            travelIsPause = false;
            travelIsPlay = true;
        });

        //回放事件
        $("#btnTrackPlay").click(function ()
        {
            if (trackCount >= 2)
            {
                travelIsPlay = true;
                travelIsPause = false;

                playTravel();//初始化标注并播放轨迹

                //切换按钮
                $("#btnTrackPlay").addClass("hidden");
                $("#btnTrackStop").removeClass("hidden");
                $("#btnTrackQuery").addClass("hidden");
                $("#btnTrackPause").removeClass("hidden");
            }
            else
            {
                $("#hdQueryAndPlay").val(1);
                Common.startPageLoading({ message: $('body').attr('data-loading') });
                trackCount = 0;
                mapClearOverlays(-1);
                TrackQuery(); 
            }
        });

        //回放停止事件
        $("#btnTrackStop").click(function ()
        {
            stopOrEndPlay(0);
        });

        //监控开始事件
        $("#btnMStart").click(function ()
        {
            $("#btnMStop").removeClass("disabled");
            $("#btnMStart").addClass("disabled");
            monitorRefresh(true);
        });

        //监控手动刷新事件
        $("#btnMRefresh").click(function ()
        {
            loadNewLocation();
        });

        //监控停止事件
        $("#btnMStop").click(function ()
        {
            $("#btnMStop").addClass("disabled");
            $("#btnMStart").removeClass("disabled");
            monitorRefresh(false);
        });

        $('#maptype').change(function ()
        {
            $.cookie('map', $(this).val(), { path: '/' });
            location.reload();
        });
        
        if ($("#hdMonitorOpType").val() == 1)
        {//页面初始时为实时监控
            $("#rdoMonitor").attr("checked", "checked");
            $("#divTrackPanel").addClass("hidden");
            $("#divTravelStatistic").addClass("hidden");
            $("#divTracingPanel").removeClass("hidden");
        }

        //页面元素尺寸适应窗口
        var divContent = $(".page-content-wrapper");
        var divBar = $(".page-bar");
        var divMap = $("#divMapCountrol");
        var divTBHead = $("#divTrackLog_head");
        var divTList = $("#divTravelTrack");
        divMap.css("height", (divContent.height() - divBar.height() - divTBHead.height() - divTList.height() - 6) + "px");
        $("#hdWindowHeight").val($(window).height());//初始化window窗口的高度

        //初始化地图
        initMap();

        //初始化选中设备的位置
        if (firstTerID == null || firstTerID == '')
            firstTerID = 0;

        if (firstTerID == 0)
        {//检测是否有cookie
            if ($.cookie)
            {
                firstTerID = $.cookie('TerID');
                if (parseInt(firstTerID) > 0)
                {
                    $("#hdMonitorTerID").val(firstTerID);
                }
            }
        }

        if (parseInt(firstTerID) > 0)
        {
            $.getJSON('/Ter/GetTerName/' + firstTerID, function (xhr)
            {//初始化名称
                $("#divTerName").html(xhr);
            });

            if ($("#hdMonitorOpType").val() == 1)
            {//自动开启跟踪
                Track.loadRealTimeInfo(firstTerID, $("#hdMonitorOpType").val());
                TrackQuery();//不查轨迹只呈现轨迹点DIV容器

                $("#btnMStart").click();
            }
            else
            {//默认查找最后一次行程的轨迹 
                $("#divTerName").html($.cookie('TerName'));
                //TrackQuery();
                //alert($("a.device[data-val='" + firstTerID + "']").html()); 
            }
        }

        $('div.right-toggle a').click(function () { UpdateWinSize();});
    });

    //单个解析地址
    this.ParseCnAddress = function (aId,lon,lat)
    {
        $("#" + aId).addClass("hidden");
        $("#" + aId).after(GetCnAddress(lon, lat));
    }

    //解析轨迹清单中地址
    this.ParseTableCnAddress=function()
    {
        var aobj=$("#aParseAddress").parent().parent();
        var thIndex = aobj.parent().find("th").index(aobj);//求得A_解析地址所在列序

        $("#tb_Tracklog>tbody>tr").each(function ()
        {
            GetCnAddressAsync($(this).find("td:eq(" + thIndex + ")"));
        });
    }

    //同步执行地址解析
    this.GetCnAddress = function (lon, lat)
    {
        var result = "";
        $.ajax({
            url: '/Geocoder/GetAddress',
            async: false,
            data: { lat: lat, lng: lon },
            dataType: 'json',
            success: function (str)
            {
                result = str.toString();
                }
        });
        return result;
            }

    //异步执行地址解析
    this.GetCnAddressAsync = function (obj)
    {
        var lonlat = obj.text().trim().split('@');
        if(lonlat.length==1)
        {
            lonlat = lonlat[0].split(',');
            if (lonlat.length == 2)
            {
                $.getJSON('/Geocoder/GetAddress', { lat: lonlat[1], lng: lonlat[0] }, function (str)
                {
                    obj.append("@" + str.toString());
                });
            }
        }
    }

    //导出轨迹点
    this.TrackPointExport = function ()
    {
        Common.startPageLoading({ message: $('body').attr('data-loading') });
        var defindTime = "";//自定义时间范围 
        var selTime = $("#selPlayTimeSection").val();
        if (selTime == 0)
        {
            defindTime = $('#LocateTime1').val() + "|" + $('#LocateTime2').val();
        }
        var boundRoad = $("#hdBoundRoadType").val();

        $("input[name='strboundRoad']").val(boundRoad);
        $("input[name='strTerID']").val($('#hdMonitorTerID').val());
        $("input[name='selTime']").val(selTime);
        $("input[name='defindTime']").val(defindTime);
        $("input[name='thanSpeed']").val($("#selShieldSpeed").val());
        $("input[name='excLocateType']").val($("#selFilterPoint").val());

        //表单提交 
        //$.ajax({
        //    type: "post",
        //    url: "/Track/ExportTrackPoints",
        //    data: $("form[name='ExportTrackPoints']").serialize(),
        //    success: function () { Common.stopPageLoading(); }
        //});

        $("form[name='ExportTrackPoints']").attr({ "action": "ExportTrackPoints", "method": "POST" }).submit();

        exportWaitSec = trackCount / 12;
        if (exportWaitSec < 5)
            exportWaitSec = 5;
        if (exportWaitSec > 60)
            exportWaitSec = 60;

        exportTimer = setInterval(ExportTimerDec, 1000);
        //Common.stopPageLoading();
    }

    this.ExportTimerDec = function ()
    {
        exportWaitSec = exportWaitSec-1;
        if (exportWaitSec <= 0)
        {
            clearInterval(exportTimer);
            Common.stopPageLoading();
        }
    }

    //创建轨迹点信息面板Html内容
    this.TrackPointInfoPanel = function (trackPoint)
    {
        var locateTypeName=$("#basestation_resx").val();
        var sHtml = '<div class="bg-blue">';
        sHtml += '<div class="pull-left"><i class="fa fa-file-text-o margin-right-5"></i>' + trackPoint.IMEI + '</div>';
        sHtml += '<div class="pull-right text-right margin-right-10">';
        var powerRateIndex = parseInt(trackPoint.PowerRate / 33);
        if (trackPoint.PowerRate == 0)
        {
            powerRateIndex = 0;
        } else if (trackPoint.PowerRate >= 100)
        {
            powerRateIndex = 5;
        } else
        {
            powerRateIndex++;
        }
        sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/power_' + powerRateIndex + '.png" /><sup>' + trackPoint.PowerRate + '</sup></span>';
        if (trackPoint.LocateType == 1)
        {
            locateTypeName="GPS";
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/gps.png" /><sup>' + trackPoint.GpsRate + '</sup></span>';
        }
        else if (trackPoint.LocateType == 4)
        {
            locateTypeName=$("#BDS_resx").val();
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/bds.png" /><sup>' + trackPoint.DipperRate + '</sup></span>';
        }
        else if (trackPoint.LocateType == 5)
        {
            locateTypeName=$("#GPS_BDS_resx").val();
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/gps.png" /><sup>' + trackPoint.GpsRate + '</sup></span>';
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/bds.png" /><sup>' + trackPoint.DipperRate + '</sup></span>';
        }
        else if (trackPoint.LocateType == 6)
        {
            locateTypeName = "Wifi";
        }
        var gsmRateIndex = parseInt(trackPoint.GsmRate / 7);
        if (trackPoint.GsmRate == 0)
        {
            gsmRateIndex = 0;
        } else if (trackPoint.GsmRate >= 31)
        {
            gsmRateIndex = 5;
        } else
        {
            gsmRateIndex++;
        }
        sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/gsm_' + gsmRateIndex + '.png" /><sup>' + trackPoint.GsmRate + '</sup></span>';
        sHtml += '</div>';
        sHtml += '</div>';

        //sHtml += '<div class="map-position table-style">';
        sHtml += '<table class="table table-bordered table-responsive table-margin-bottom-0" style="margin-bottom:1px;"><tbody>';
        //sHtml += '<tr><td class="text-right active active-background" width="20%">' + $('#lngandlat_resx').val() + '</td>';
        //sHtml += '<td width="80%">' + trackPoint.Longitude + ',' + trackPoint.Latitude;
        //if (trackPoint.LocateType == 2)
        //{
        //    sHtml += '(Lac:' + trackPoint.LAC + ',Cell:' + trackPoint.CELL + ')';
        //}
        //sHtml += '</td></tr>';

        sHtml += '<tr><td class="text-right active active-background" style="width:60px;">' + $('#locatetype_resx').val() + '</td>';
        sHtml += '<td style="width:145px;">' + locateTypeName + '</td>';
        //sHtml += '</tr><tr>'; 
        sHtml += '<td class="text-right active active-background" style="width:60px;">' + $('#direction_resx').val() + '</td>';
        sHtml += '<td style="width:145px;">' + trackPoint.Directions.Value + '(' + trackPoint.Direction + ')</td></tr>';

        sHtml += '<tr>';
        if (trackPoint.StayTime >= 300)
        {
            sHtml += '<td class="text-right active active-background">' + $('#stoptime_resx').val() + '</td>';
            sHtml += '<td>' + trackPoint.LocateTime1 + '</td>';
            //sHtml += '</tr><tr>'; 
            sHtml += '<td class="text-right active active-background">' + $('#stoptimespan_resx').val() + '</td>';
            sHtml += '<td>' + trackPoint.StayTime1 + '</td>';
            
        }
        else
        {
            sHtml += '<td class="text-right active active-background">' + $('#runtime_resx').val() + '</td>';
            sHtml += '<td>' + trackPoint.LocateTime1 + '</td>';
            //sHtml += '</tr><tr>'; 
            sHtml += '<td class="text-right active active-background">' + $('#speed_resx').val() + '</td>';
            sHtml += '<td>' + trackPoint.Speed + 'km/h</td>';
        }
        sHtml += '</tr>';

        sHtml += '<tr>';
        sHtml += '<td class="text-right active active-background">' + $('#location_resx').val() + '</td>';
        sHtml += '<td colspan="3" style="height:46px;max-width:350px;"><a id="' + trackPoint.TracklogID + '" href=\'javascript:ParseCnAddress("' + trackPoint.TracklogID +
                 '","' + trackPoint.Longitude + '","' + trackPoint.Latitude + '")\'>[' + trackPoint.Longitude + ',' + trackPoint.Latitude;
        if (trackPoint.LocateType == 2)
        {
            sHtml += '(Lac:' + trackPoint.LAC + ',Cell:' + trackPoint.CELL + ')';
        }
        sHtml += ']' + $('#hdDescription').val() + '</a></td>';
        sHtml += '</tr>';
        sHtml += '</tbody></table>';
        //sHtml += '</div>';
        return sHtml;
    }

    //创建定位位置信息面板Html内容
    this.TrackLocationInfoPanel=function (vm) {
        var sHtml = '<div class="row bg-blue">';
        sHtml += '<div class="pull-left"><i class="fa fa-file-text-o margin-right-5"></i>' + vm.TerName + '</div>';
        sHtml += '<div class="pull-right margin-right-10">';
        var powerRateIndex = parseInt(vm.PowerRate / 33);
        if (vm.PowerRate == 0) {
            powerRateIndex = 0;
        } else if (vm.PowerRate>=100) {
            powerRateIndex = 5;
        } else {
            powerRateIndex++;
        }
        sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/power_' + powerRateIndex + '.png" /><sup>' + vm.PowerRate + '</sup></span>';
        if (vm.LocateType == 1) {
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/gps.png" /><sup>' + vm.GpsRate + '</sup></span>';
        } else if (vm.LocateType == 4) {
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/bds.png" /><sup>' + vm.DipperRate + '</sup></span>';
        } if (vm.LocateType == 5) {
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/gps.png" /><sup>' + vm.GpsRate + '</sup></span>';
            sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/bds.png" /><sup>' + vm.DipperRate + '</sup></span>';
        }

        var gsmRateIndex = parseInt(vm.GsmRate /7);
        if (vm.GsmRate == 0) {
            gsmRateIndex = 0;
        } else if (vm.GsmRate>=31) {
            gsmRateIndex = 5;
        } else {
            gsmRateIndex++;
        }
        sHtml += '<span class="margin-right-10"><img src="/assets/img/icon/gsm_' + gsmRateIndex + '.png" /><sup>' + vm.GsmRate + '</sup></span>';
        sHtml += '</div>';
        sHtml += '</div>';

        //sHtml += '<div class="map-position table-style">';
        sHtml += '<table class="table table-bordered table-responsive table-margin-bottom-0"><tbody>'; 
        sHtml += '<tr><td class="text-right active active-background" style="width:60px;">' + $('#locatetype_resx').val() + '</td>';
        sHtml += '<td style="width:145px;">' + vm.LocateTypeName + '</td>';
        //sHtml += '</tr><tr>'; 
        sHtml += '<td class="text-right active active-background" style="width:60px;">' + $('#direction_resx').val() + '</td>';
        sHtml += '<td style="width:145px;">' + vm.Directions.Value + '(' + vm.Direction + ')</td></tr>';

        sHtml += '<tr>';
        if (vm.RunStatus == 1)
        {
            sHtml += '<td class="text-right active active-background">' + $('#runtime_resx').val() + '</td>';
            sHtml += '<td>' + vm.LocateTime + '</td>';
            //sHtml += '</tr><tr>'; 
            sHtml += '<td class="text-right active active-background">' + $('#speed_resx').val() + '</td>';
            sHtml += '<td>' + vm.Speed + 'km/h</td>';
        }
        else if (vm.RunStatus == 2)
        {
            if (vm.LocateType != 2) {
                sHtml += '<td class="text-right active active-background">' + $('#stoptime_resx').val() + '</td>';
                sHtml += '<td>' + vm.StopTime + '</td>';
            } else {
                sHtml += '<td class="text-right active active-background">' + $('#locatetime_resx').val() + '</td>';
                sHtml += '<td>' + vm.LocateTime + '</td>';
            }
            //sHtml += '</tr><tr>'; 
            sHtml += '<td class="text-right active active-background">' + $('#stoptimespan_resx').val() + '</td>';
            sHtml += '<td>' + vm.StopTimeSpan + '</td>';
        }
        else
        {
            sHtml += '<td class="text-right active active-background">' + $('#offlinetime_resx').val() + '</td>';
            sHtml += '<td>' + vm.LastComTime + '</td>';
            //sHtml += '</tr><tr>'; 
            sHtml += '<td class="text-right active active-background">' + $('#offlinetimespan_resx').val() + '</td>';
            sHtml += '<td>' + vm.OffLineTimeSpan + '</td>';
        }
        sHtml += '</tr>';
        sHtml += '<tr><td class="text-right active active-background">' + $('#lngandlat_resx').val() + '</td>';
        sHtml += '<td colspan="3">' + vm.Longitude + ',' + vm.Latitude;
        if (vm.LocateType == 2)
        {
            sHtml += '(MCC:' + vm.MCC + ',MNC:' + vm.MNC + ',LAC:' + vm.LAC + ',CELL:' + vm.CELL + ')';
        }
        sHtml += '</td></tr>';
        sHtml += '<tr>';
        sHtml += '<td class="text-right active active-background">' + $('#location_resx').val() + '</td>';
        sHtml += '<td colspan="3" style="max-width:350px;">' + this.GetCnAddress(vm.Longitude, vm.Latitude) + '</td>';
        sHtml += '</tr>';
        sHtml += '</tbody></table>';
        //sHtml += '</div>';
        return sHtml;
    }

    //实时监控添加监控点信息行Html
    this.AddTrackDataRow = function (vm,index)
    {
        var tbHtml = "";
        var tbEnd = "";
        var locateTypeName = $("#basestation_resx").val();
        var locateRate = 'Lac:' + vm.LAC + ',Cell:' + vm.CELL;
        var weilan = "";
        var chaosu = "";
        var ddinaya = "";
        if (vm.LocateType == 1)
        {
            locateTypeName = "GPS";
            locateRate=vm.GpsRate;
        }
        else if (vm.LocateType == 4)
        {
            locateTypeName = $("#BDS_resx").val();
            locateRate=vm.DipperRate;
        }
        else if (vm.LocateType == 5)
        {
            locateTypeName = $("#GPS_BDS_resx").val();
            locateRate = vm.GpsRate + "/" + vm.DipperRate;
        }
        if (vm.IsLowPower)
        {
            ddinaya = $("#hdIsLowPower").val();
        }
        if (vm.IsOverSpeed)
        {
            chaosu = $("#hdIsOverSpeed").val();
        }
        if (vm.IsCrossFence == 1)
        {
            weilan = $("#hdEFence1").val();
        }
        else if (vm.IsCrossFence == 2)
        {
            weilan = $("#hdEFence2").val();
        }
        else if (vm.IsCrossFence == 3)
        {
            weilan = $("#hdEFence3").val();
        }
        else if (vm.IsCrossFence == 4)
        {
            weilan = $("#hdEFence4").val();
        }

        if (index == 0)
        {
            tbHtml = "<table id='tb_Tracklog' class='table table-striped table-hover table-margin-bottom-0'><tbody>";
            tbEnd = "</tbody></table>";
        }
        tbHtml += "<tr><td style='width:35px'>" + (index +1).toString() +"</td>" ;
        tbHtml += "<td style='width:68px'>" + locateTypeName + "</td>";
        tbHtml += "<td style='width:140px'>" + vm.LocateTime + "</td>";
        tbHtml += "<td style='width:82px'>" + vm.Speed + (chaosu==""?"":("<small style='color:red'>"+chaosu+"</small>")) + "</td>";
        tbHtml += "<td style='width:88px'>" + vm.Directions.Value + "</td>";
        tbHtml += "<td style='width:50px'>" + vm.PowerRate +(ddinaya==""?"":("<small style='color:red'>"+ddinaya+"</small>"))+ "</td>";
        tbHtml += "<td style='width:50px'>" + locateRate + "</td>";
        tbHtml += "<td style='width:65px'>" + vm.GsmRate + "</td>";
        tbHtml += "<td style='width:71px'>" + weilan + "</td>";
        tbHtml += "<td style='width:250px'>" + vm.Longitude + ',' + vm.Latitude + "</td>";
        tbHtml += "<td class='hidden'>" + vm.IMEI + "</td>"
        tbHtml += "</tr>" + tbEnd; 
        return tbHtml;
    }

    //实时跟踪读秒
    this.monitorRefresh = function (beginTiming) {
        //实时跟踪加载刷新时间 
        refreshTime = $("#selMonitorRefresh").val();
        countdown = refreshTime;
        
        if (beginTiming)
        {
            trackingTimer = setInterval(monitorCountdown, 1000);
        }
        else if (trackingTimer)
        {
            clearInterval(trackingTimer);
            $('#lblMonitorRefresh').text(refreshTime + $('#second_resx').val());
        }
    }

    //实时跟踪读秒事件
    this.monitorCountdown = function ()
    {
        if (countdown >= 0)
        {
            $('#lblMonitorRefresh').text(countdown + $('#second_resx').val());
        }
        else
        {
            countdown = refreshTime;
            loadNewLocation();            
        }
        countdown--;
    }    

    //弹出窗
    this.showWin = function (title,url) {
        dialog({
            title:title,
            content: $('<div></div>').load(url)
        }).show();
    }

    //开启测距
    this.ranging = function ()
    {
        if (disTool == null)
        {
            alert("undefined");
        }
        else{
            disTool.open();
        }
    }

    //方向角转时针方向
    this.GetTimeHour=function(direction)
    {
        var jiaodu = Math.floor(direction);
        if (jiaodu >= 345 || jiaodu < 15)
        {
            return 0;
        }
        else if (jiaodu >= 15 && jiaodu < 45)
        {
            return 1;
        }
        else if (jiaodu >= 45 && jiaodu < 75)
        {
            return 2;
        }
        else if (jiaodu >= 75 && jiaodu < 105)
        {
            return 3;
        }
        else if (jiaodu >= 105 && jiaodu < 135)
        {
            return 4;
        }
        else if (jiaodu >= 135 && jiaodu < 165)
        {
            return 5;
        }
        else if (jiaodu >= 165 && jiaodu < 195)
        {
            return 6;
        }
        else if (jiaodu >= 195 && jiaodu < 225)
        {
            return 7;
        }
        else if (jiaodu >= 225 && jiaodu < 255)
        {
            return 8;
        }
        else if (jiaodu >= 255 && jiaodu < 285)
        {
            return 9;
        }
        else if (jiaodu >= 285 && jiaodu < 315)
        {
            return 10;
        }
        else if (jiaodu >= 315 && jiaodu < 345)
        {
            return 11;
        }
    }

    Date.prototype.Format = function (fmt)
    { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "H+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    return this;
}();

//回放or监控切换
function ChangeMonitorOpType(tag)
{
    if (tag == 1)
    {//实时监控
        $("#divTrackPanel").addClass("hidden");
        $("#divTravelStatistic").addClass("hidden");
        $("#divTracingPanel").removeClass("hidden");
    }
    else
    {
        //先停止监控
        $("#btnMStop").addClass("disabled");
        $("#btnMStart").removeClass("disabled");
        monitorRefresh(false);

        $("#divTrackPanel").removeClass("hidden");
        $("#divTravelStatistic").removeClass("hidden");
        $("#divTracingPanel").addClass("hidden");
    }

    $("#divTrackLog").html("");
    mapClearOverlays(-1);
    firstTerID = $("#hdMonitorTerID").val();
    if (firstTerID == null || firstTerID == '' || firstTerID == 0)
    {
        alert($("#hdUnSelectedTer").val());
    }
    else
    {
        loadRealTimeInfo(firstTerID, $("#hdMonitorOpType").val());
    }
}

function TrackQuery()
{
    var terid = $("#hdMonitorTerID").val();

    var selTime = $("#selPlayTimeSection").val();
    var defindTime = "";//自定义时间范围
    var thanSpeed = $("#selShieldSpeed").val();//过滤速度
    var excLocateType = $("#selFilterPoint").val();//过滤定位类型

    var selTime = $("#selPlayTimeSection").val();
    if (selTime == 0)
    {
        defindTime = $('#LocateTime1').val() + "|" + $('#LocateTime2').val();
        if (defindTime == '')
        {
            alert($("#hdWriteFullTrackDate").val());
            return false;
        }
    }
    var boundRoad = $("#hdBoundRoadType").val();
    var divMap = $("#divMapCountrol");
    var divList =$('#divTravelTrack');
    if(divList.height()==0)
    {
        divMap.css("height",(divMap.height()-177)+ "px");
    }
    divList.removeClass("hidden");
    divList.css("height", "177px");
    var optype = $("#hdMonitorOpType").val();
    $('#divTravelTrack').load('/Track/_List', { terid: terid, selTime: selTime, defindTime: defindTime, thanSpeed: thanSpeed, excLocateType: excLocateType, optype: optype, boundRoad: boundRoad });
}

function setTrackPointListVisible()
{
    var divContent = $(".page-content-wrapper");
    var divBar = $(".page-bar");
    var divMap = $("#divMapCountrol");
    var divTLog = $("#divTrackLog");
    var divTList = $("#divTravelTrack");
    var tag = $("#hdPointListVisible").val();
    if (tag == 1)
    {
        $("#aPointListVisible").html('<i class="fa fa-angle-up"></i>');
        $("#hdPointListVisible").val("0");
        //$("#divTrackLog").parent().addClass("hidden");
        $("#divTrackLog").addClass("hidden");
        divMap.css("height", (divMap.height() + divTLog.height()) + "px");
        divTList.css("height", (divTList.height() - divTLog.height()) + "px"); 
    }
    else
    {
        $("#aPointListVisible").html('<i class="fa fa-angle-down"></i>');
        $("#hdPointListVisible").val("1");
        //$("#divTrackLog").parent().removeClass("hidden");
        $("#divTrackLog").removeClass("hidden");
        divMap.css("height", (divMap.height() - divTLog.height()) + "px");
        divTList.css("height", (divTList.height() + divTLog.height()) + "px"); 
    }
}

function UpdateWinSize()
{
    /*var leftBarWidth = $('.page-content').width();
    if ($('#frozeHead_Container table').width() > leftBarWidth) {
        $('#frozeHead_Container,#frozeHead_Container .theadscroll,.tbodydiv').width($('#frozeHead_Container table thead').width());
    } else {
        $('#frozeHead_Container,#frozeHead_Container .theadscroll,.tbodydiv').width(leftBarWidth);
    }*/
    //var pageWidth = $('.page-content-wrapper').width();
    //var pagerightWidth = 0;
    //var s = $('div.right-toggle a').find('i').is('.fa-angle-right');
    //if (s) {
    //    pagerightWidth = $('.page-quick-sidebar-wrapper').width();
    //}
    //var leftBarWidth = pageWidth - pagerightWidth - 3;
    //if ($('#frozeHead_Container table').width() > leftBarWidth) {
    //    $('#frozeHead_Container,#frozeHead_Container .theadscroll,.tbodydiv').width($('#frozeHead_Container table thead').width());
    //} else {
    //    $('#frozeHead_Container,#frozeHead_Container .theadscroll,.tbodydiv').width(leftBarWidth);
    //}

    //var documentWidth = $(document).width();
    //if (documentWidth < 1920) {
    //    $('.headdiv,.bigtablediv').width(1920);
    //} else {
    //    $('.headdiv,.bigtablediv').width(documentWidth);
    //}
    //var wrapperHeight = $('.page-content').height() - $('.page-bar').height();
    //$('#divTrackLog').height(wrapperHeight - 5);
    //$('.tbodydiv').height(wrapperHeight - $('.headdiv').height() - $('.paging').height() - 35);
    //$('#frozeHead_Container,.tableheadcover').height($('.theadheight').height());
    var divMap = $("#divMapCountrol");
    var winHeight1 = $("#hdWindowHeight").val();
    var winHeight2 = $(window).height();

    divMap.css("height", (divMap.height() - (winHeight1 - winHeight2)) + "px");

    $("#hdWindowHeight").val(winHeight2);

    //当屏幕宽度<850 隐藏轨迹列表头的序号列
    if ($(window).width() < 850)
    {
        $("#tb_Tracklog_head thead th:first").addClass("hidden");
        if ($("#tb_Tracklog tbody td").length > 2)
        {
            $("#tb_Tracklog tbody td:first").addClass("hidden");
        }
    }
    else
    {
        $("#tb_Tracklog_head thead th:first").removeClass("hidden");
        $("#tb_Tracklog tbody td:first").removeClass("hidden");
    }

    //控制轨迹清单搞宽度
    var pageWidth = $('.page-content-wrapper').width();
    var pagerightWidth = 0;
    var s = $('div.right-toggle a').find('i').is('.fa-angle-right');
    if (s) {
        pagerightWidth = $('.page-quick-sidebar-wrapper').width();
    }
    var leftBarWidth = pageWidth - pagerightWidth - 3;
    $('#frozeHead_Container table').width(leftBarWidth);
    if ($('#frozeHead_Container table').width() > leftBarWidth) {
        $('#frozeHead_Container,#frozeHead_Container .theadscroll,.tbodydiv,#tb_Tracklog').width($('#frozeHead_Container table thead').width());
    } else {
        $('#frozeHead_Container,#frozeHead_Container .theadscroll,.tbodydiv,#tb_Tracklog').width(leftBarWidth);
        $('.theadheight th div,#tb_Tracklog td div').width("100%");
    }
    var tempHeight = $('.theadheight').height();
    $('#frozeHead_Container,.tableheadcover').height($('.theadheight').height() - 2);
}

