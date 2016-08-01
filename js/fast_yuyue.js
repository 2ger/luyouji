	mui.init();
		(function($) {
			$.init();
			var result = $('#result')[0];
			var btns = $('.btn');
			var pickers = {};
			btns.each(function(i, btn) {
				btn.addEventListener('tap', function() {
					var optionsJson = this.getAttribute('data-options') || '{}';
					var options = JSON.parse(optionsJson);
					var id = this.getAttribute('id'); 
					/*
					 * 首次显示时实例化组件
					 * 示例为了简洁，将 options 放在了按钮的 dom 上
					 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
					 */
					pickers[id] = pickers[id] || new $.DtPicker(options);
					pickers[id].show(function(rs) {
						/*
						 * rs.value 拼合后的 value
						 * rs.text 拼合后的 text
						 * rs.y 年，可以通过 rs.y.value 和 rs.y.text 获取值和文本
						 * rs.m 月，用法同年
						 * rs.d 日，用法同年
						 * rs.h 时，用法同年
						 * rs.i 分（minutes 的第二个字母），用法同年
						 */
						result.innerText = rs.text;
					});
				}, false);
			});
		})(mui);
		var dateType = 0; //选择租期，用于判断计算费用公里数
		var carType = 2; //选择车型，用于判断计算费用公里数
		var return_result = "";
		/*获取经纬度信息*/
		var start_lon = "";
		var start_lat = "";
		var end_lon = "";
		var end_lat = "";
		var str_distance = "";
		var str_costtime = "";
		/* 获取选择车类型后，显示公里数、花费以及车型 */
		var distance_span = document.getElementById("distance_span");
		//var cost_span = document.getElementById("cost_span");
		var cartype_span = document.getElementById("cartype_span");
		var package_price = document.getElementById("package_price");
		mui.plusReady(function() {						
			//获取车型
			var url = request_url + "get_car";
			mui.getJSON(url, function(rsp) {
				console.log(JSON.stringify(rsp));
				return_result = rsp;
				car_pk= return_result.Table[2].car_pk;
				/* 设置专车 名字、图片、车类型 套餐价 */
				init_carinfo();
			});
			//设置图像
			var set_pic = plus.storage.getItem('set_pic');
			if (set_pic != null) {
				var setpic_img = document.getElementById("setpic");
				setpic_img.src = set_pic;
			}
			/*初始化时间，获取当前事件*/
			var dateTmp = getCurrentDate();
			document.getElementById("result").textContent = dateTmp;
			
				
			/*获取上下车地址*/
			var startPosition = document.getElementById("startPosition");
			var endPosition = document.getElementById("endPosition");
			var start_postion = plus.storage.getItem("start_postion");
			var end_postion = plus.storage.getItem("end_postion");
			
			/*收货人信息*/
			var receiveMan = document.getElementById("receiveMan");
			var receiveTel = document.getElementById("receiveTel");
			var receive_man = plus.storage.getItem("receive_man");
			var receive_tel = plus.storage.getItem("receive_tel");
			if (receive_man != '') {
				receiveMan.value = receive_man;
			}
			if (receive_tel != '') {
				receiveTel.value = receive_tel;
			}
			
			/*承保信息*/
			var receiveBao = document.getElementById("receiveBao");
			var receiveMoney = document.getElementById("receiveMoney");
			
			console.log(start_postion);
			console.log(end_postion);
			
			console.log(dateTmp);
			
		
				
			/*获取用户信息*/
			setPersonInfo();
			/*选择上下车位置*/
			
			startPosition.value = start_postion.split('&')[0];
			start_lon = start_postion.split('&')[2];
			start_lat = start_postion.split('&')[1];
			startPosition.addEventListener("tap", function() {
				plus.storage.setItem('date_type',"2");	
				mui.openWindow({
					url: "choose_position.html",
				})
			});
			endPosition.value=end_postion.split('&')[0];
			end_lon = end_postion.split('&')[2];
			end_lat = end_postion.split('&')[1];
			endPosition.addEventListener("tap", function() {
				plus.storage.setItem('date_type',"2");	
				mui.openWindow({
					url: "choose_endposition.html"
				})
			});
			GetAwayAndTime();
			confirm_data();
		});
		var car_pk = 0;
		/* 判断选择车型 */
		function choose_carType() {
			//获得 单选选按钮name集合   
			var radios = document.getElementsByName("choose_taxi");
			//根据 name集合长度 遍历name集合   
			for (var i = 0; i < radios.length; i++) {
				//判断那个单选按钮为选中状态   
				if (radios[i].checked) {					
					//单选按钮的值   
					if (("0" == radios[i].value)) {
						carType = 0;
						init_packageinfo(3);
						far_costmoney(3);
						//电动车
						car_pk = return_result.Table[3].car_pk;
					} else if ("1" == radios[i].value) {
						carType = 1;
						init_packageinfo(2);
						far_costmoney(2);
						//三轮车
						car_pk = return_result.Table[2].car_pk;
					} else if ("2" == radios[i].value) {
						carType = 2;
						init_packageinfo(1);
						far_costmoney(1); 
						//出租车
						car_pk = return_result.Table[1].car_pk;
					}else if ("3" == radios[i].value) {
						carType = 3;
						init_packageinfo(0);
						far_costmoney(0); 
						//货车
						car_pk = return_result.Table[0].car_pk;
					}
					console.log(car_pk);

				}
			}
		}
		// 初始化套餐信息
		function init_packageinfo(indx) {			
			distance_span.textContent =  "￥"+return_result.Table[indx].car_start_price + "(含"+ return_result.Table[indx].car_meal_away.replace(".00","") +"公里)+" + return_result.Table[indx].car_away_price + "/公里" + "+" + return_result.Table[indx].car_time_price + "/分钟";
			//cost_span.textContent = "超出按￥" + return_result.Table[indx].car_go_time_price + "/分钟+￥" + return_result.Table[indx].car_go_away_price + "/公里计费";
			//cartype_span.textContent = textdecode1(return_result.Table[indx].car_rem);
		} 
		//计算超出费用的价格
		//计算超出费用的价格
		function far_costmoney(indx) {
			var strdistance = parseFloat((parseFloat(str_distance)/1000).toFixed(3)); //公里数
			
			var strcosttime =  parseInt(parseInt(str_costtime)/60);
			var car_start_price=parseFloat(return_result.Table[indx].car_start_price);//起租价
			var car_meal_away=parseFloat(return_result.Table[indx].car_meal_away);//起租价包含公里
			var order_away_fee=0;//里程费
			var order_time_fee=0;//时长费
			var order_far_away_fee=0;//远途费 
			var car_far_away=parseFloat(return_result.Table[indx].car_far_away);//远途标准
			
			if(strdistance>0)
			{
				if(strdistance>car_meal_away)
				{
					var strdistance1=strdistance-car_meal_away;//多出公里
					order_away_fee=strdistance1*parseFloat(return_result.Table[indx].car_away_price);//里程*里程价
					
				}
				else
				{
					order_away_fee=0;
				}
			}
			if(strcosttime>0) order_time_fee=strcosttime*parseFloat(return_result.Table[indx].car_time_price);//时长*时长价
			if(strdistance>0 && strdistance>car_far_away) order_far_away_fee=(strdistance-car_far_away)*parseFloat(return_result.Table[indx].car_far_price);//（里程-远途标准）*远途价
			
			var order_fee=car_start_price+order_away_fee+order_time_fee+order_far_away_fee;
			package_price.textContent = "￥" + order_fee.toFixed(2);
			
		}
		var strClientInfo = "";
		//获取用户填写信息
		function setPersonInfo() {
			strClientInfo = plus.storage.getItem("fast_person_info");
			console.log("strClientInfo===" + strClientInfo);
			if (strClientInfo != null) {
				document.getElementById("person_info").textContent = strClientInfo.split('&')[0] + " " + strClientInfo.split('&')[1] + " " + strClientInfo.split('&')[2];
			} else {
				var student_real_name = plus.storage.getItem('student_real_name');
				var student_phone = plus.storage.getItem('student_phone');
				document.getElementById("person_info").textContent = student_real_name + " " + student_phone;
			}
		}
		/*init_carinfo() 初始化专车信息*/
		function init_carinfo() {
			var tr_carname = document.getElementById("tr_carname");
			var tr_carimg = document.getElementById("tr_carimg");
			var result_len = return_result.Table.length;
			var str_carname = "";
			var str_carimg = "";
			//循环读取返回结果
			for (var i = result_len - 1; i >= 0; i--) {
				str_carname += "<td><label>" + return_result.Table[i].car_name + "</label></td>"
				str_carimg += "<td ><img  width='70px' src='" + request_img_url + return_result.Table[i].car_img + "'/></td>"
			}
			tr_carname.innerHTML = str_carname; 
			tr_carimg.innerHTML = str_carimg;
			var strdistance = parseFloat((parseFloat(str_distance)/1000).toFixed(3));
			document.getElementById("cartype_span").textContent = textdecode1(return_result.Table[2].car_rem) ;
			package_price.textContent = "￥" + return_result.Table[2].car_start_price;
			document.getElementById("distance_span").textContent =  "￥"+return_result.Table[2].car_start_price + "(含"+ return_result.Table[2].car_meal_away.replace(".00","") +"公里)+" + return_result.Table[2].car_away_price + "/公里" + "+" + return_result.Table[2].car_time_price + "/分钟";
			document.getElementById("cost_span").textContent = "超出按￥" + return_result.Table[2].car_go_time_price + "/分钟+￥" + return_result.Table[2].car_go_away_price + "/公里计费";
		}
		/* 接收来自子页面传递的值 */
		window.addEventListener('id', function(event) {
			var strTmp = event.detail.id;		
			if(strTmp.split('&').length==3){
				startPosition.value = strTmp.split('&')[0];
				start_lon = strTmp.split('&')[2];
				start_lat = strTmp.split('&')[1];
				GetAwayAndTime();
			}
		});
		window.addEventListener('id_endarea', function(event) {
			var strTmp = event.detail.id_endarea;		
			if(strTmp.split('&').length==3){
				endPosition.value = strTmp.split('&')[0];
				end_lon = strTmp.split('&')[2];
				end_lat = strTmp.split('&')[1];
				GetAwayAndTime();
			}
		});
		function GetAwayAndTime()
		{
			var map = new BMap.Map("allmap");
			map.centerAndZoom(new BMap.Point(116.404, 39.915), 12);			
			var searchComplete = function(results) {
				if (transit.getStatus() != BMAP_STATUS_SUCCESS) {
					return;
				}
				var plan = results.getPlan(0);
			
				str_distance = plan.getDistance(false);
				str_costtime = plan.getDuration(false);
				console.log("str_distance==" + str_distance);
				console.log("str_costtime==" + str_costtime);
				init_packageinfo(carType);
				far_costmoney(carType);
				console.log(carType);
				
					var province1 = plus.storage.getItem('province1');
				var city1 = plus.storage.getItem('city1');
				var district1 = plus.storage.getItem('district1');
				console.log(province1+city1+district1);
				console.log('ddd');
			};
			var transit = new BMap.DrivingRoute(map, {renderOptions: {map: map}, 
				onSearchComplete: searchComplete,
				onPolylinesSet: function() {}
			});
			transit.search(new BMap.Point(start_lon,start_lat), new BMap.Point(end_lon,end_lat));
		}
		/*计算两点之间的距离和时间*/
		// 百度地图API功能
		/********************************************************************
         *   user_pk 用户标示
			 user_name 乘车人姓名
			 user_tel 乘车人电话
			 user_sms 是否电话通知 1通知  0不通知
			 order_type 订单类型 0立即叫车 1预约 2半日租 3日租 // 车型
			 order_datetime 乘车日期时间
			 start_address 上车点
			 start_lon 上车点经度
			 start_lat 上车点纬度度
			 end_address 下车点
			 end_lon 下车点经度
			 end_lat  下车点纬度   
			 order_away 里程
			 order_time  时长   
			 Car 车型标示，见获取车型接口中的car_pk，多个用逗号分隔   
			 order_rem 备注给司机留言
         ********************************************************************/
		/*预约 向服务器提交数据*/
		function confirm_data() {
			var confirm_oper = document.getElementById("confirm_oper");
			confirm_oper.addEventListener("tap", function() {
				if(startPosition.value=="")
				{
					mui.toast("请选择发货地址!");
					return false;
				}
				if(endPosition.value=="")
				{
					mui.toast("请选择收货地址!");
					return false;
				}
				if(receiveMan.value=="")
				{
					
					mui.toast("请选择收货人姓名!");
					return false;
				}else{
					plus.storage.setItem('receive_man',receiveMan.value);
				}
				if(receiveTel.value=="")
				{
					mui.toast("请输入收货人电话!");
					return false;
				}else{
					plus.storage.setItem('receive_tel',receiveTel.value);
				}
				
console.log("carType:"+carType);

				var province1 = plus.storage.getItem('province1');
				var city1 = plus.storage.getItem('city1');
				var district1 = plus.storage.getItem('district1');
				console.log(province1+city1+district1);
				
				var user_pk = plus.storage.getItem('user_pk');
				var url_server = request_url + "save_order";
				mui.ajax(url_server, {
					data: {
						"user_pk": user_pk,
						"user_name": document.getElementById("person_info").textContent.split(" ")[0],
						"user_tel": document.getElementById("person_info").textContent.split(" ")[1],
						"user_sms": "0",
						"order_type": carType, //1 立即预约 => 车型
						"order_datetime": document.getElementById("result").textContent,
						"start_address": startPosition.value,
						"start_lon": start_lon,
						"start_lat": start_lat,
						"province": province1,
						"city": city1,
						"district": district1,
						"end_address": endPosition.value,
						"receive_man": receiveMan.value,//收货人
						"receive_tel": receiveTel.value,//收货人电话
						"receive_bao": receiveBao.value,//承保
						"receive_money": receiveMoney.value,//价值
						"end_lon": end_lon,
						"end_lat": end_lat,
						"order_away": str_distance,
						"order_time": str_costtime,
						"Car": car_pk,
						"order_rem": document.getElementById("person_info").textContent.split(" ")[2]
					},
					dataType: 'json', //服务器返回json格式数据
					type: 'post', //HTTP请求类型
					timeout: 5000, //超时时间设置为10秒；
					success: function(response) {
					
						if(response!=null)
						{
							mui.toast("提交成功!");
							plus.webview.currentWebview().opener().reload();
							mui.fire(plus.webview.getWebviewById('HBuilder'), 'reload');
							console.log(JSON.stringify(response));
							console.log(response.result);
							//mui.back();
							mui.openWindow({
								id: response.result,
								url: "usercenter/ordermanager.html"
							})
						}
						else
						{
							mui.toast("叫车失败，请稍后重试!");
							console.log(receiveMan.value);
						}
					},
					error: function(xhr, type, errorThrown) {
						//异常处理；
						console.log("\n失败$$$$$" + xhr.status + "$$$" + type + "$$$" + errorThrown);
					}
				});
			})
		}
		/*跳转到价格明细页面*/
		var strParam = "";
		var price_detail = document.getElementById("price_detail");
		price_detail.addEventListener("tap", function() {
			//strParam = carType + "&" + cartype_span.textContent + "&" + distance_span.textContent + "&" + cost_span.textContent + "&" + package_price.textContent;					
			strParam = carType + "&" + cartype_span.textContent + "&" + str_distance + "&" + str_costtime+"&"+return_result.Table[carType].car_start_price+"&"+return_result.Table[carType].car_away_price+"&"+return_result.Table[carType].car_time_price+"&"+return_result.Table[carType].car_far_away+"&"+return_result.Table[carType].car_far_price+"&"+return_result.Table[carType].car_meal_away;
			mui.openWindow({
				id: "price_detail",
				url: "pricedetail.html",
				extras: {
					param: strParam
				}
			})
		});