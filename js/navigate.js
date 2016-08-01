/********************************************************************
    navigate.js 处理导航页面跳转
   *********************************************************************/
window.onload = function() {
	// 顺风车点击事件
	//freeride_fun();
	// 附近点击事件 
	//nearby_fun();
	//tab_nearby_fun();
	//长租车点击事件
	//longdriver_fun();
	// 自驾点击事件
	//selfdriver_fun();
	// 门店点击事件
	//subarea_fun();

	// 导航点击事件
	//navigate_fun();
	// 个人中心点击事件
	//personcenter_fun();

	// 左上角个人中心点击事件
	//navigate_personcenter_fun();

	// 右上角分享点击事件
	//	navigate_share_fun()
}

// 顺风车点击事件 
function freeride_fun() {
	var tb_freeride = document.getElementById("tb_freeride");
	tb_freeride.addEventListener("tap", function() {
		mui.openWindow({
			url: "navigate/freeride.html"
		});
	});
}
// 代驾点击事件
function selfdriver_fun() {
	var tb_selfdriver = document.getElementById("tb_selfdriver");
	tb_selfdriver.addEventListener("tap", function() {
		mui.openWindow({
				url: "index.html"
		});
	});
}
// 专车点击事件 
function nearby_fun() {
	var tb_nearby = document.getElementById("tb_nearby");
	tb_nearby.addEventListener("tap", function() {
		mui.openWindow({
			url: "index.html"
		});
	});
}

// tab附近点击事件 
function tab_nearby_fun() {
	var tab_nearby = document.getElementById("tab_nearby");
	tab_nearby.addEventListener("tap", function() {
		mui.openWindow({
			url: "index.html"
		});
	});
}
// 出租车点击事件
function longdriver_fun() {
	var tb_longdriver = document.getElementById("tb_longdriver");
	tb_longdriver.addEventListener("tap", function() {
		mui.openWindow({
//			url: "navigate/longdriver.html"
			url: "index.html"
		});
	});
}



// 门店点击事件
function subarea_fun() {
	var tb_subarea = document.getElementById("tb_subarea");
	tb_subarea.addEventListener("tap", function() {
		mui.openWindow({
			url: "navigate/subarea.html"
		});
	});
}

// 导航点击事件
function navigate_fun() {
	var tb_navigate = document.getElementById("tb_navigate");
	tb_navigate.addEventListener("tap", function() {
		mui.openWindow({
			url: "index.html"
		});
	});
}

// 个人中心点击事件
function personcenter_fun() {
	var tab_person = document.getElementById("tab_person");
	tab_person.addEventListener("tap", function() {
		var islogin = plus.storage.getItem('islogin');
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
}

// 左上角个人中心点击事件
function navigate_personcenter_fun() {
	var navigate_personcenter = document.getElementById("navigate_personcenter");
	navigate_personcenter.addEventListener("tap", function() {
		var islogin = plus.storage.getItem('islogin');

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
}

// 右上角分享点击事件
function navigate_share_fun() {
	var navigate_share = document.getElementById("navigate_share");
	navigate_share.addEventListener("tap", function() {
		mui.openWindow({
			url: "usercenter/visitfriend.html"
		});
	});
}
var shares=null,bhref=false;
var Intent=null,File=null,Uri=null,main=null;

// H5 plus事件处理
function plusReady(){
	updateSerivces();
	if(plus.os.name=="Android"){
		Intent = plus.android.importClass("android.content.Intent");
		File = plus.android.importClass("java.io.File");
		Uri = plus.android.importClass("android.net.Uri");
		main = plus.android.runtimeMainActivity();
	}
}
if(window.plus){
	plusReady();
}else{
	document.addEventListener("plusready",plusReady,false);
}
/**
 * 更新分享服务
 */
function updateSerivces(){
	plus.share.getServices( function(s){
		shares={};
		for(var i in s){
			var t=s[i];
			shares[t.id]=t;
		}
	}, function(e){
		
		console.log("获取分享服务列表失败："+e.message );
	} );
}
// 打开分享
function shareShow(){
	bhref=true;
	var ids=[{id:"weixin",ex:"WXSceneSession"},{id:"weixin",ex:"WXSceneTimeline"},{id:"sinaweibo"},{id:"tencentweibo"}],
	bts=[{title:"发送给微信好友"},{title:"分享到微信朋友圈"},{title:"分享到新浪微博"},{title:"分享到腾讯微博"}];
//	if(plus.os.name=="iOS"){
//		ids.push({id:"qq"});
//		bts.push({title:"分享到QQ"});
//	}
	plus.nativeUI.actionSheet({cancel:"取消",buttons:bts},
		function(e){
			var i=e.index;
			if(i>0){
				shareAction(ids[i-1].id,ids[i-1].ex);
			}
		}
	);
}
/**
   * 分享操作
   * @param {String} id
   */
function shareAction(id,ex) {
	var s=null;
//	outSet( "分享操作：" );
	if(!id||!(s=shares[id])){
		mui.toast( "无效的分享服务！" );
		return;
	}
	if ( s.authenticated ) {
		console.log( "---已授权---" );
		shareMessage(s,ex);
	} else {
		console.log( "---未授权---" );
		s.authorize( function(){
				shareMessage(s,ex);
			},function(e){
				var msgs = e.message.split("http")[0];
			mui.toast( "认证授权失败："+msgs);
		});
	}
}
var sharehref="http://dede.vlldoo.com/down.aspx";
var sharecontent="我正在使用起点专车客户端,使用租车服务特别方便，赶紧跟我一起来体验！";
var sharehrefTitle="起点专车客户端";
var sharehrefDes="我正在使用起点专车客户端,使用租车服务特别方便，赶紧跟我一起来体验！";
/**
   * 发送分享消息
   * @param {plus.share.ShareService} 
   */
function shareMessage(s,ex){
	var msg={content:sharecontent,extra:{scene:ex}};
	if(bhref){
		msg.href=sharehref;
		if(sharehrefTitle!=""){
			msg.title=sharehrefTitle;
		}
		if(sharehrefDes!=""){
			msg.content=sharehrefDes;
		}
		msg.thumbs=["_www/logo.png"];
		msg.pictures=["_www/logo.png"];
	}else{
		if(pic&&pic.realUrl){
			msg.pictures=[pic.realUrl];
		}
	}
	console.log(JSON.stringify(msg));
	s.send( msg, function(){
		mui.toast( "分享到\""+s.description+"\"成功！ " );
	}, function(e){
		var msgs = e.message.split("http")[0];
		mui.toast("分享到\"" + s.description + "\"失败:"+msgs);
	} );
}