		var islogin1 = 0;
		var car_type=0;// 
		mui.init();		
//		mui(".mui-title div span").each(function(){			
//			this.addEventListener('tap', function(e) {
//				mui(".mui-title div span").each(function(){ this.className="";	});				
//				this.className="curr";
//				car_type=this.getAttribute("data-val");		
//				console.log(car_type);
//			});
//		});
		
		/*获取上下车地址 自动填入*/
//			var startPosition = document.getElementById("startPosition");
//			var endPosition = document.getElementById("endPosition");
//			var start_postion = plus.storage.getItem("choose_start_postion");
//			var end_postion = plus.storage.getItem("choose_end_postion");
//			console(start_postion);
			
										
		mui(".choose_taxi").each(function(){			
			this.addEventListener('tap', function(e) {
				mui(".choose_taxi").each(function(){ });				
				//this.className="curr";
				car_type=this.getAttribute("value");		
				console.log(car_type);
			});
		});

		
		document.getElementById("person_center").addEventListener('tap', function(e) {
			islogin = plus.storage.getItem('islogin');
			islogin =1; //测试用
			/*判空操作*/
			if (islogin == null) {
				plus.storage.setItem('islogin', 0);
			}
			console.log("islogin0====" + islogin);
			if ((islogin != 1) || (islogin != "1")) {
				mui.openWindow({
					id: "login",
					url: "login/login.html"
				});
			} else {
				mui.openWindow({
					id: "setting_menu",
					url: "setting_menu.html"
				});
			}
		});			
		document.getElementById("pop_adv").addEventListener("tap", function() {				
			mui.openWindow({
				id: "ordermanager",
				url: "usercenter/ordermanager.html"
			});									
		});
		/*预约用车按钮事件*/
		var date_car = document.getElementById("date_car");
		date_car.addEventListener("tap", function() {
			islogin = plus.storage.getItem('islogin');
			islogin =1; //测试用
			
			/*判空操作*/
			if (islogin == null) {
				plus.storage.setItem('islogin', 0);
			}
			if ((islogin != 1) || (islogin != "1")) {
				mui.openWindow({
					id: "login",
					url: "login/login.html"
				});
			} else {
				plus.storage.setItem('date_type', "1");
				mui.openWindow({
					id: "yuyue",
					url: "yuyue.html"
				})
			}
		});
		/*预约用车按钮事件*/
		var fastdate_car = document.getElementById("fastdate_car");
		fastdate_car.addEventListener("tap", function() {	
				
			islogin = plus.storage.getItem('islogin');
			islogin =1; // 测试用
			if (islogin == null) {
				plus.storage.setItem('islogin', 0);
			}
			if ((islogin != 1) || (islogin != "1")) {
				mui.openWindow({
					id: "login",
					url: "login/login.html"
				});
			} else {	
				if(document.getElementById("start_address").value=="")
				{
					mui.toast("请输入或选择发货地点");
					return false;
				}
				if(document.getElementById("end_address").value=="")
				{
					mui.toast("请输入或选择收货地点");
					return false;
				}
				var url = request_url + "get_user_order_state";
				console.log(url);
				mui.ajax(url, {
					data: {
						"user_pk": plus.storage.getItem('user_pk')
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为5秒；
					success: function(rsp) {
						console.log(rsp);
//						if(parseInt(rsp.result)==0) //留单功能
//						{
							if(car_type==0)
							{								
								plus.storage.setItem('date_type', "2");
								mui.openWindow({
									id: "fast_yuyue",
									url: "fast_yuyue.html"
								});
							}
							else
							{
								GetAwayAndTime();
							}
//						}
//						else
//						{
//							mui.toast("您有未完成订单，暂不能发货!");
//						}
					}
				});	
console.log('222');						
			}
		});

		//定义保存在用户端显示司机位置信息的数组
		var coach_lonArr = "";
		var coach_latArr = "";
		var preMarker = new Array();
		var tj=false;
		// var g_getinfo    = "";		
		mui.plusReady(function() {		
			//获得用户订单信息
			get_user_order_info();	
			
			if(parseFloat(plus.storage.getItem('islogin') || 0)!=1)
			{
				mui.openWindow({
					id: "login",
					url: "login/login.html"
				});
			}
			//检查更新	
			plus.runtime.getProperty(plus.runtime.appid, function (wgtinfo) {						
				mui.ajax(request_url + "get_update", {	
					data: {
						"_type":1,
						"version":wgtinfo.version
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为5秒； 
					success: function(rsp) {								
						if(parseInt(rsp.result)==100) 
						{
							// var btnArray = ['更新', '取消'];
							// mui.confirm('系统有更新，立即更新？', '系统提示', btnArray, function(e) {
							// 	if (e.index == 0) {
							// 		plus.runtime.openURL(request_img_url+"down.aspx");									
							// 	} 
							// });
						}						
					}
				});				
			}); 
			mui.ajax(request_url + "get_ad_one", {	
				data: {
					"_type":"0000500003",							
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 1, //超时时间设置为5秒； 
				success: function(rsp) {					
					if(rsp.result!="")
					{
						if((plus.storage.getItem('ad') || "").toString().indexOf(rsp.result+";")<0) 
						{
							mui(".mui-content")[0].style.display="none";
							document.getElementById("ad_img").setAttribute("src",request_img_url+rsp.result);
							document.getElementById("ad").style.display="block";
							document.getElementById("zzc").style.display="block"; 
							plus.storage.setItem('ad',rsp.result+";");	
						}
					}
				}
			});
			document.getElementById("mui-close").addEventListener("tap", function() {
				document.getElementById("ad").style.display="none"; 
				document.getElementById("zzc").style.display="none";
				mui(".mui-content")[0].style.display="block";
			});
			document.getElementById("start_address").addEventListener("tap", function() {							
				plus.storage.setItem('date_type',"1");				
				mui.openWindow({
					url: "choose_position.html",
				});
			});
			document.getElementById("end_address").addEventListener("tap", function() {
				plus.storage.setItem('date_type',"1");
				mui.openWindow({
					url: "choose_endposition.html"
				});
			});
			window.addEventListener('id', function(event) {
				var strTmp = event.detail.id;
				if(strTmp.split('&').length==3)
				{
					document.getElementById("start_address").value = strTmp.split('&')[0];
					plus.storage.setItem("start_postion", strTmp);	
					document.getElementById("map_result").innerHTML="<lable style='color: darkgreen;font-weight: 900;'>发货点：</lable> " + strTmp.split('&')[0] + " <lable style='color: darkgreen;font-weight: 900;'></lable>";	
					var eePoint = new BMap.Point(parseFloat(strTmp.split('&')[2]), parseFloat(strTmp.split('&')[1]));
					map.centerAndZoom(eePoint,map.getZoom());
				}
			});
			window.addEventListener('id_endarea', function(event) {
				var strTmp = event.detail.id_endarea;
				if(strTmp.split('&').length==3)
				{					
					document.getElementById("end_address").value = strTmp.split('&')[0];
					plus.storage.setItem("end_postion", strTmp);
				}
			});
//			document.getElementById("down_car").addEventListener("tap", function() {
//				var order_pk=document.getElementById("down_car").getAttribute("order_pk");
//				pay_order(order_pk);
//			});
			document.getElementById("call_coach").addEventListener("tap", function() {
				var coach_phone=document.getElementById("call_coach").getAttribute("coach_phone");
				plus.device.dial(coach_phone, true);
			});
			document.getElementById("cancel_order").addEventListener("tap", function() {				
				plus.nativeUI.confirm("确定要取消订单吗？", function(e) {
					if (e.index == 0) {
						var user_pk = plus.storage.getItem('user_pk');
						var order_pk=document.getElementById("cancel_order").getAttribute("order_pk");
						var url = request_url + "cancel_order";
						mui.ajax(url, {
							data: {
								"user_pk": user_pk,
								"order_pk": order_pk
							},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 5000, //超时时间设置为10秒；
							success: function(response) {						
								if (response.result == 0) {
									mui.toast("订单取消失败!");
								} else {		
									document.getElementById("order_div_1").style.display="block";
									document.getElementById("order_div_2").style.display="none";
									mui.toast("取消订单成功！");
								}
							},
							error: function(xhr, type, errorThrown) {
								//异常处理；
								console.log("\n失败$$$$$" + xhr.status + "$$$" + type + "$$$" + errorThrown);
							}
						});	
					}
				}, "提示");				
			});
			document.getElementById("cancel_order_1").addEventListener("tap", function() {				
				plus.nativeUI.confirm("确定要取消订单吗？", function(e) {
					if (e.index == 0) {
						var user_pk = plus.storage.getItem('user_pk');
						var order_pk=document.getElementById("cancel_order_1").getAttribute("order_pk");
						var url = request_url + "cancel_order";
						mui.ajax(url, {
							data: {
								"user_pk": user_pk,
								"order_pk": order_pk
							},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 5000, //超时时间设置为10秒；
							success: function(response) {						
								if (response.result == 0) {
									mui.toast("订单取消失败!");
								} else {		
									document.getElementById("order_div_1").style.display="block";
									document.getElementById("order_div_3").style.display="none";
									mui.toast("取消订单成功！");
								}
							},
							error: function(xhr, type, errorThrown) {
								//异常处理；
								console.log("\n失败$$$$$" + xhr.status + "$$$" + type + "$$$" + errorThrown);
							}
						});	
					}
				}, "提示");				
			});
			
				/*调用初始化定位信息*/
				var point2 = new BMap.Point(109.417524,24.326119); // 创建点坐标
				map = new BMap.Map("map"); // 创建地图实例
				map.centerAndZoom(point2, 20); // 初始化地图，设置中心点坐标和地图级别
				map.addControl(new BMap.NavigationControl());
				//获取用户订单状态
				get_user_order_info();
				/*定时获取司机集合 com=get_coach_list*/
				get_coachlist_info();
				
				document.getElementById("map_result").addEventListener("click", function() {
					document.getElementById("start_address").value=plus.storage.getItem("start_address");					
				});
				function getPosition() {
					var mPoint = map.getCenter();
					var lat = mPoint.lat; //获取到当前位置的纬度；			
					var longt = mPoint.lng; //获取到当前位置的经度
					var url = "http://api.map.baidu.com/geocoder/v2/?ak=FC9c13967bf240823ed03d702d883e83&location=" + lat + "," + longt + "&output=json&pois=1"
					mui.getJSON(url, function(rsp) {
						if (rsp != null) {							
							var addComp = rsp.result.addressComponent;
							var currentStreet = addComp.district + addComp.street;
							var currentPosition = rsp.result.sematic_description;							
//							if (currentPosition != "") {
//								document.getElementById("map_result").innerHTML = "<lable style='color: darkgreen;font-weight: 900;'>我从</lable> " + currentStreet + "<br/>" + currentPosition + " <lable style='color: darkgreen;font-weight: 900;'>上车</lable>";
//								document.getElementById("start_address").value=currentStreet+currentPosition;
//								plus.storage.setItem("start_postion", currentStreet + currentPosition + "&" + mPoint.lat + "&" + mPoint.lng);
//							} else {
//								document.getElementById("map_result").innerHTML = "<lable style='color: darkgreen;font-weight: 900;'>我从</lable> " + currentStreet + " <lable style='color: darkgreen;font-weight: 900;'>上车</lable>";
//								document.getElementById("start_address").value=currentStreet;
//								plus.storage.setItem("start_postion", currentStreet + "&" + mPoint.lat + "&" + mPoint.lng);
//							}
							currentStreet=rsp.result.pois[3].addr+rsp.result.pois[3].name;
							document.getElementById("map_result").innerHTML = "<lable style='color: darkgreen;font-weight: 900;'>我从</lable> " + currentStreet + " <lable style='color: darkgreen;font-weight: 900;'>上车</lable>";
							//document.getElementById("start_address").value=currentStreet;
							plus.storage.setItem("start_address", currentStreet);
							plus.storage.setItem("start_postion", currentStreet + "&" + mPoint.lat + "&" + mPoint.lng);						
						}
					});
				}
				getPosBaidu();
				//开始移动地图
				map.addEventListener("dragstart", function(e) {													
					document.getElementById("map_result_div").style.display = "none";
				});
				//移动地图结束
				map.addEventListener("dragend", function(e) {					
					getPosition();
					document.getElementById("map_result_div").style.display = "";
				});
				
				
				plus.push.setAutoNotification(false);
				var info = plus.push.getClientInfo();
				plus.storage.setItem("clientid", info.clientid);
				plus.storage.setItem("appid", info.appid);
				plus.storage.setItem("appkey", info.appkey);
				plus.storage.setItem("token", info.token);
				console.log(info.appkey);
				plus.push.addEventListener("click", function(msg) {
					// 判断是从本地创建还是离线推送的消息
					switch (msg.payload) {
						case "LocalMSG":
							outSet("点击本地创建消息启动：");
							break;
						default:
							outSet("点击离线推送消息启动：");
							break;
					}
					// 处理其它数据
					logoutPushMsg(msg);
				}, false);
				// 监听在线消息事件
				plus.push.addEventListener("receive", function(msg) {
					if (msg.aps) { // Apple APNS message
						//					mui.toast("接收到在线APNS消息：");
					} else {
						//					mui.toast("接收到在线透传消息：");
					}
					logoutPushMsg(msg);
				}, false);
				/**
				 * 日志输入推送消息内容
				 */
				function logoutPushMsg(msg) {
					if (msg.payload) {
						islogin = plus.storage.getItem('islogin');
						/*判空操作*/
						if (islogin == null) {
							plus.storage.setItem('islogin', 0);
						}
						if ((islogin != 1) || (islogin != "1")) {
						} else {
							document.getElementById("order_div_1").style.display="none";
							document.getElementById("order_div_2").style.display="none";
							document.getElementById("order_div_3").style.display="none";
							document.getElementById("order_div_4").style.display="none";
							document.getElementById("order_div_5").style.display="none";
							tj=true;
							get_user_order_info();
//							 mui.openWindow({
//								id: "qiangdan",
//								url: "qiangdan.html",
//								extras: {
//									param: msg.payload
//								}
//							});
						}	
					} else {
						console.log("payload: undefined");
					}
					if (msg.aps) {
						console.log("aps: " + JSON.stringify(msg.aps));
					}
				}
				//首页返回键处理
				//处理逻辑：1秒内，连续两次按返回键，则退出应用；
				var first = null;
				mui.back = function() {
					//首次按键，提示‘再按一次退出应用’
					if (!first) {
						first = new Date().getTime();
						mui.toast('再按一次退出应用');
						setTimeout(function() {
							first = null;
						}, 1000);
					} else {
						if (new Date().getTime() - first < 1000) {
							plus.runtime.quit();
						}
					}
				};
			});
			/*增加标记点*/
		function addMarker(point) { // 创建图标对象   
			var myIcon = new BMap.Icon("img/car.png", new BMap.Size(17, 31));
			// 创建标注对象并添加到地图   
			var marker = new BMap.Marker(point, {
				icon: myIcon
			});
			map.addOverlay(marker);
			preMarker.push(marker);
		}
		//有未支付订单
			function has_unpay(){
							mui(".mui-content")[0].style.display="none";
							document.getElementById("pay_img").setAttribute("src",'img/iconfont-chongzhi(2).png');
							document.getElementById("payorder").style.display="block";
							document.getElementById("zzc").style.display="block"; 
			}
			//已付后
			function has_unpay_ed(){
							mui(".mui-content")[0].style.display="block";
							document.getElementById("payorder").style.display="none";
							document.getElementById("zzc").style.display="none"; 
							document.getElementById("order_div_1").style.display="block";
							document.getElementById("order_div_2").style.display="none";
							document.getElementById("order_div_3").style.display="none";
							document.getElementById("order_div_4").style.display="none";
							document.getElementById("order_div_5").style.display="none"; 
			}
			
//		window.setTimeout("get_user_order_info()", 5000);//重复获取信息 测试用
			
		//获取用户订单状态
		function get_user_order_info()
		{
			console.log('获得订单用户信息');
			var user_pk = plus.storage.getItem('user_pk');	
			var url = request_url + "get_user_order_info";
			mui.ajax(url, {
				data: {
					"user_pk": user_pk				
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 5000, //超时时间设置为10秒；
				success: function(response) {	
					if(response.Table.length>0)
					{
						console.log(response.Table[0].order_state);
						if(response.Table[0].order_state=="0")
						{
							document.getElementById("order_div_5").style.display="none";
							document.getElementById("order_div_4").style.display="none";
							document.getElementById("order_div_3").style.display="none";
							document.getElementById("order_div_2").style.display="block";
							document.getElementById("order_yj_fee").innerHTML=response.Table[0].order_fee;
							document.getElementById("cancel_order").setAttribute("order_pk",response.Table[0].order_pk);	
							
							plus.storage.setItem('unpay_order',response.Table[0].order_pk);
							console.log('订单状态:0  订单号：'+response.Table[0].order_pk+" 价格："+response.Table[0].order_fee);
							 
							window.setTimeout("get_user_order_info()", 2000);//重复获取信息
						}
						else if(response.Table[0].order_state=="1")
						{
							
							document.getElementById("order_div_5").style.display="none";
							document.getElementById("order_div_4").style.display="none";
							document.getElementById("order_div_3").style.display="block";
							document.getElementById("order_div_2").style.display="none";
							var coach_car_number = response.Table[0].coach_car_number;
							coach_car_number = coach_car_number;							
							document.getElementById("coach_info").innerHTML=response.Table[0].coach_name + "•" + coach_car_number;
							document.getElementById("call_coach").setAttribute("coach_phone",response.Table[0].coach_phone);	
							document.getElementById("cancel_order_1").setAttribute("order_pk",response.Table[0].order_pk);
							
							plus.device.beep( 1 );
							var p = plus.audio.createPlayer("img/souli.mp3");//neworder
								p.play(function() {}, function(e) {//订单已受理
								outLine("播放音频文件\"" + url + "\"失败：" + e.message);
							});
					
							console.log('订单状态:1');
							//window.setTimeout("get_user_order_info()", 2000); //重复获取信息
						}
						else if(response.Table[0].order_state=="2")
						{
							document.getElementById("order_div_5").style.display="none";
							document.getElementById("order_div_4").style.display="block";
							document.getElementById("order_div_3").style.display="none";
							document.getElementById("order_div_2").style.display="none";
							document.getElementById("al_away").innerHTML=parseFloat(response.Table[0].order_away || 0);
							document.getElementById("al_fee").innerHTML=parseFloat(response.Table[0].order_fee || 0);
							window.setTimeout("get_user_order_info()", 2000);//重复获取信息
							console.log('订单状态:2');
						}
						else if(response.Table[0].order_state=="3")
						{
							document.getElementById("order_div_5").style.display="block";
							document.getElementById("order_div_4").style.display="none";
							document.getElementById("order_div_3").style.display="none";
							document.getElementById("order_div_2").style.display="none";
							//document.getElementById("down_car").setAttribute("order_pk",response.Table[0].order_pk);
							window.setTimeout("get_user_order_info()", 2000);//重复获取信息
							document.getElementById("order_fee").innerHTML=response.Table[0].order_fee;								
							console.log('订单状态:3');
						}
						else if(response.Table[0].order_state=="4") // && tj
						{
							tj=false;
							
							document.getElementById("order_div_5").style.display="none";
							document.getElementById("order_div_4").style.display="none";
							document.getElementById("order_div_3").style.display="none";
							document.getElementById("order_div_2").style.display="none";
							document.getElementById("order_div_1").style.display="block";	
							mui.openWindow({
								url: "usercenter/ordermanager_detail.html",
								extras: {
									param: response.Table[0].order_pk
								}
							});				
							console.log('订单状态:4  '+response.Table[0].order_pk+" 价格："+response.Table[0].order_fee);
						}else if(response.Table[0].order_state=="6")
						{ //需用户支付 
							document.getElementById("order_money").value=response.Table[0].order_fee;
							document.getElementById("order_money_txt").innerHTML =response.Table[0].order_fee;
							plus.storage.setItem('unpay_order',response.Table[0].order_pk);
							has_unpay();
							console.log('订单状态:6  订单号：'+response.Table[0].order_pk+" 价格："+response.Table[0].order_fee);
							window.setTimeout("get_user_order_info()", 2000);//重复获取信息
						}
						else{
							mui(".mui-content")[0].style.display="block";
							document.getElementById("payorder").style.display="none";
							document.getElementById("zzc").style.display="none"; 
							
							document.getElementById("order_div_1").style.display="block";
							console.log('订单状态>6:'+response.Table[0].order_state+'  订单号：'+response.Table[0].order_pk+" 价格："+response.Table[0].order_fee); 
						
						} 
					}
					else document.getElementById("order_div_1").style.display="block";
					
				}, 
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log("\n失败$$$$$" + xhr.status + "$$$" + type + "$$$" + errorThrown);
				}
			});
		}
		
		//获取司机列表
		function get_coachlist_info() {
			coach_lonArr = new Array();
			coach_latArr = new Array();
			//初始化，清空数组元素
			coach_lonArr.splice(0, coach_lonArr.length);
			coach_latArr.splice(0, coach_latArr.length);
			var url = request_url + "get_coach_list";
			mui.getJSON(url, function(rsp) {
				//console.log(JSON.stringify(rsp));
				if (preMarker.length > 0) {
					for (var i = 0; i < preMarker.length; i++) {
						map.removeOverlay(preMarker[i]);
					}
					preMarker.length = 0;
				}
				for (var i = 0; i < rsp.Table.length; i++) {
					coach_lonArr[i] = rsp.Table[i].coach_lon;
					coach_latArr[i] = rsp.Table[i].coach_lat;
					addMarker(new BMap.Point(coach_lonArr[i], coach_latArr[i]));
				}
			});
			window.setTimeout("get_coachlist_info()", 2000);
		}
		/*初始化地图时时定位信息*/
		function geoInf(position) {
			var codns = position.coords; //获取地理坐标信息；
			var lat = codns.latitude; //获取到当前位置的纬度；			
			var longt = codns.longitude; //获取到当前位置的经度
			var url = "http://api.map.baidu.com/geocoder/v2/?ak=FC9c13967bf240823ed03d702d883e83&location=" + lat + "," + longt + "&output=json&pois=1"
			mui.getJSON(url, function(rsp) {
				if (rsp != null) {
					console.log(JSON.stringify(rsp));					
					var addComp = rsp.result.addressComponent;
					var currentStreet = addComp.district + addComp.street;
					var currentPosition = rsp.result.sematic_description;
					
					var mPoint = new BMap.Point(longt, lat);
//					if (currentPosition != "") {
//						document.getElementById("map_result").innerHTML = "<lable style='color: darkgreen;font-weight: 900;'>我从</lable> " + currentStreet + "<br/>" + currentPosition + " <lable style='color: darkgreen;font-weight: 900;'>上车</lable>";
//						plus.storage.setItem("start_postion", currentStreet + currentPosition + "&" + mPoint.lat + "&" + mPoint.lng);
//					} else {
//						document.getElementById("map_result").innerHTML = "<lable style='color: darkgreen;font-weight: 900;'>我从</lable> " + currentStreet + " <lable style='color: darkgreen;font-weight: 900;'>上车</lable>";
//						plus.storage.setItem("start_postion", currentStreet + "&" + mPoint.lat + "&" + mPoint.lng);
//					}
					currentStreet=rsp.result.pois[3].addr+rsp.result.pois[3].name;
					document.getElementById("map_result").innerHTML = "<lable style='color: darkgreen;font-weight: 900;'>我从</lable> " + currentStreet + " <lable style='color: darkgreen;font-weight: 900;'>上车</lable>";
					//document.getElementById("start_address").value=currentStreet;
					plus.storage.setItem("start_address", currentStreet);
					plus.storage.setItem("start_postion", currentStreet + "&" + mPoint.lat + "&" + mPoint.lng);
					map.centerAndZoom(mPoint, map.getZoom()); // 初始化地图，设置中心点坐标和地图级别
//					document.getElementById("map_result").addEventListener("click", function() {
//						islogin = plus.storage.getItem('islogin');
//						/*判空操作*/
//						if (islogin == null) {
//							plus.storage.setItem('islogin', 0);
//						}
//						if ((islogin != 1) || (islogin != "1")) {
//							mui.openWindow({
//								id: "login",
//								url: "login/login.html"
//							});
//						} else {
//							plus.storage.setItem('date_type', "1");
//							mui.openWindow({
//								id: "yuyue",
//								url: "yuyue.html"
//							})
//						}
//					});
				}
			});
		}
		// 通过百度定位模块获取位置信息
		function getPosBaidu() {
			plus.geolocation.getCurrentPosition(geoInf, function(e) {
				console.log("info----" + e.message);
			}, {
				provider: 'baidu'
			});
		}
		/*增加首页默认滑动事件*/
		function defaultShowSlide() {
				
			var gallery = mui("#slider");
			gallery.slider({
				interval: 3000
			});
		};
		/*回到当前位置点击事件 */
		var back_current_position = document.getElementById("back_current_position");
		back_current_position.addEventListener("tap", function() {
			plus.geolocation.getCurrentPosition(geoInf, function(e) {
				console.log("info----" + e.message);
			}, {
				provider: 'baidu'
			});
		});
		function confirm_data(str_distance,str_costtime) {
			var user_pk = plus.storage.getItem('user_pk');
			var url_server = request_url + "save_order";
			mui.ajax(url_server, {
				data: {
					"user_pk": user_pk,
					"user_name": plus.storage.getItem('student_real_name'),
					"user_tel": plus.storage.getItem('student_phone'),
					"user_sms": "0",
					"order_type": 0, //立即预约
					"order_datetime": getCurrentDate(),
					"start_address": plus.storage.getItem("start_postion").split('&')[0],
					"start_lon": plus.storage.getItem("start_postion").split('&')[2],
					"start_lat": plus.storage.getItem("start_postion").split('&')[1],
					"end_address": plus.storage.getItem("end_postion").split('&')[0],
					"end_lon": plus.storage.getItem("end_postion").split('&')[2],
					"end_lat": plus.storage.getItem("end_postion").split('&')[1],
					"order_away": str_distance,
					"order_time": str_costtime,
					"Car": "",
					"order_rem": ""
				},
				dataType: 'json', //服务器返回json格式数据
				type: 'post', //HTTP请求类型
				timeout: 5000, //超时时间设置为10秒；
				success: function(response) {
				
					if(response!=null)
					{
						mui.toast("提交成功!");
						get_user_order_info();				
					}
					else
					{
						mui.toast("叫车失败，请稍后重试!");
					}
				},
				error: function(xhr, type, errorThrown) {
					//异常处理；
					console.log("\n失败$$$$$" + xhr.status + "$$$" + type + "$$$" + errorThrown);
				}
			});			
		}
		//计算路程时间
		function GetAwayAndTime()
		{
			var map_t = new BMap.Map("allmap");
			map_t.centerAndZoom(new BMap.Point(116.404, 39.915), 12);			
			var searchComplete = function(results) {
				if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
					return;
				}
				var plan = results.getPlan(0);			
				str_distance = plan.getDistance(false);
				str_costtime = plan.getDuration(false);
				console.log("str_distance==" + str_distance);
				console.log("str_costtime==" + str_costtime);
				if(str_distance<=1000)
					mui.toast("路程太短，暂无服务!");
				else
					confirm_data(str_distance,str_costtime);					
			};
			var transit = new BMap.DrivingRoute(map_t, {renderOptions: {map: map_t}, 
				onSearchComplete: searchComplete,
				onPolylinesSet: function() {}
			});		
			console.log(plus.storage.getItem("start_postion"))
			console.log(plus.storage.getItem("end_postion"))
			transit.search(new BMap.Point(plus.storage.getItem("start_postion").split('&')[2],plus.storage.getItem("start_postion").split('&')[1]), new BMap.Point(plus.storage.getItem("end_postion").split('&')[2],plus.storage.getItem("end_postion").split('&')[1]));
		}
		//订单付款
		function pay_order(order_pk) {
			var user_pk =plus.storage.getItem('user_pk');
			console.log(user_pk);
			if(order_pk == "" || order_pk == undefined){
				order_pk = plus.storage.getItem('unpay_order');
			}
			console.log(order_pk)
			var url = request_url + "get_pay_info&order_pk=" + order_pk;		
			var btnArray = [{
				title: '余额支付'
			}, {
				title: descriptions[0]
			}];
			plus.nativeUI.actionSheet({
				title: "选择支付方式",
				cancel: "取消",
				buttons: btnArray
			}, function(e) {
				var index = e.index;
				switch (index) {
					case 0:
						break;					
					case 1:		
						console.log('余额支付'+ids[0]); 
						userpay(user_pk,order_pk);
						//pay(ids[0], order_pk);
						break;
					case 2:
						pay(ids[1], order_pk);
						break;
				}
			});
					
			
		}
		var pays = {};
		var descriptions = {};
		var ids = {};
		
		//余额支付
		function userpay(user_pk,order_pk){
			var url = request_url + "balance_pay";
						mui.ajax(url, {
							data: {							
								"order_pk": order_pk,	
								"user_pk": user_pk
							},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 5000, //超时时间设置为10秒；
							success: function(response) {	
								console.log(response.result);
								if(parseInt(response.result)==100) 
							{
								plus.nativeUI.alert("支付成功!", function() {
									updateOrder(order_pk,4);//更新订单
									has_unpay_ed();
									get_user_order_info();//刷新页面 
									
								}, "支付");
							}else if(parseInt(response.result)==-99){
								plus.nativeUI.alert("余额不足！", null, "支付");
							}
							},
							error: function(xhr, type, errorThrown) {
								//异常处理；
								console.log("\n失败$$$$$" + xhr.status + "$$$" + type + "$$$" + errorThrown);
							}
						});	
		}
		function plusReady() {
			// 获取支付通道
			plus.payment.getChannels(function(channels) {
				for (var i in channels) {
					var channel = channels[i];
					pays[channel.id] = channel;
					ids[i] = channel.id;
					descriptions[i] = channel.description + "支付";;
					checkServices(channel);
				}
				//				info.innerText = txt;
			}, function(e) {
				outLine("获取支付通道失败：" + e.message);
			});
		}
		document.addEventListener('plusready', plusReady, false);
		// 检测是否安装支付服务
		function checkServices(pc) {
			// if (!pc.serviceReady) {
			// 	var txt = null;
			// 	switch (pc.id) {
			// 		case "alipay":
			// 			txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
			// 			break;
			// 		default:
			// 			txt = "系统未安装“" + pc.description + "”服务，无法完成支付，是否立即安装？";
			// 			break;
			// 	}
			// 	plus.nativeUI.confirm(txt, function(e) {
			// 		if (e.index == 0) {
			// 			pc.installService();
			// 		}
			// 	}, pc.description);
			// }
		}
		var w = null;
		
		//更新订单
		function updateOrder(order_pk,status){
				var url = request_url + "update_order2";
						mui.ajax(url, {
							data: {							
								"order_pk": order_pk,		
								"status": status
							},
							dataType: 'json', //服务器返回json格式数据
							type: 'post', //HTTP请求类型
							timeout: 5000, //超时时间设置为10秒；
							success: function(response) {	
								
							},
							error: function(xhr, type, errorThrown) {
								//异常处理；
								console.log("\n失败$$$$$" + xhr.status + "$$$" + type + "$$$" + errorThrown);
							}
						});	
			}
		
		function pay(id, order_pk) {
			var user_pk = plus.storage.getItem('user_pk');
			var PAYSERVER = request_url + "get_wx_pay_info&order_state=6&user_pk="+user_pk+"&order_pk=" + order_pk + "&rechange_money=" + document.getElementById("order_money").value +"&payid=";
			if (w) {
				return;
			} //检查是否请求订单中
			if (id === 'wxpay') {
				  PAYSERVER = request_url + "get_wx_pay_info&order_state=6&user_pk="+user_pk+"&order_pk=" + order_pk + "&rechange_money=" + document.getElementById("order_money").value +"&payid=";
			}
			console.log("----- 请求支付 -----");
			var url = PAYSERVER;
			if (id == 'alipay' || id == 'wxpay') {
				url += id;
			} else {
				plus.nativeUI.alert("不支持此支付通道！", null, "支付");
				return;
			}
			var appid = plus.runtime.appid;
			if (navigator.userAgent.indexOf('StreamApp') >= 0) {
				appid = 'Stream';
			}
			//			url += '&appid=' + appid + '&total=';
			w = plus.nativeUI.showWaiting();
			// 请求支付订单
			//			var amount = 20;
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				switch (xhr.readyState) {
					case 4:
						w.close();
						w = null;
						if (xhr.status == 200) {
							console.log("----- 请求订单成功 -----");						
							var order =xhr.responseText;
							//order='{"appid":"wx4179af8e0ea8a387","partnerid":"1297903501","prepayid":"wx20160108164422009f788d7d0948060121","package":"Sign =WXpay","noncestr":"cd3a1b1ef4184484b9a776b58bb4ad3e","timestamp": "1452242565","sign":"7E9A6857BC581BF563891A424E9F8400"}';
							plus.payment.request(pays[id], order, function(result) {
								console.log("----- 支付成功 -----");								
								plus.nativeUI.alert("支付成功!", function() {
									
									updateOrder(order_pk,4);//更新订单
									get_user_order_info();//刷新页面 
									
									document.getElementById("order_div_1").style.display="block";
									document.getElementById("order_div_2").style.display="none";
									document.getElementById("order_div_3").style.display="none";
									document.getElementById("order_div_4").style.display="none";
									document.getElementById("order_div_5").style.display="none"; 
								}, "支付");
							}, function(e) {
								console.log("----- 支付失败 -----");
								console.log("[" + e.code + "]：" + e.message);
								plus.nativeUI.alert("支付失败！", null,"提示"); 
							});
						} else {
							console.log("----- 请求订单失败 -----");
							console.log(xhr.status);
							plus.nativeUI.alert("获取订单信息失败！", null, "支付");
						}
						break;
					default:
						break;
				}
			}
			xhr.open('GET', url);
			console.log("请求支付订单：" + url);
			xhr.send();
		}