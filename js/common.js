/*获取当前时间 格式为 2015-10-16 15:25*/
function getCurrentDate() {
	var dateVal = new Date();
	var dateTmp = dateVal.getFullYear() + "-" + (dateVal.getMonth() + 1) + "-" + dateVal.getDate() + " " + dateVal.getHours() + ":" + dateVal.getMinutes();
	return dateTmp;
}

Date.prototype.format = function(format) {
		var o = {
			"M+": this.getMonth() + 1, //month 
			"d+": this.getDate(), //day 
			"h+": this.getHours(), //hour 
			"m+": this.getMinutes(), //minute 
			"s+": this.getSeconds(), //second 
			"q+": Math.floor((this.getMonth() + 3) / 3), //quarter 
			"S": this.getMilliseconds() //millisecond 
		}

		if (/(y+)/.test(format)) {
			format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
		}

		for (var k in o) {
			if (new RegExp("(" + k + ")").test(format)) {
				format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return format;
	}
	/*特殊字符转换*/
function textdecode1(str) {
	str = str.replace(/&amp;/gi, '&');
	str = str.replace(/&lt;/gi, '<');
	str = str.replace(/&gt;/gi, '>');
	str = str.replace(/&nbsp;/gi, ' ');
	str = str.replace(/''/gi, '"');
	str = str.replace(/<brbr>/gi, '<br />');
	str = str.replace(/"/g, "''");
	str = str.replace(/'/g, '"');
	return str;
}

/*特殊字符转换*/
function textdecode2(str) {
	str = str.replace(/&amp;/gi, '&');
	str = str.replace(/&lt;/gi, '<');
	str = str.replace(/&gt;/gi, '>');
	str = str.replace(/&nbsp;/gi, ' ');
	str = str.replace(/''/gi, '"');
	str = str.replace(/<brbr>/gi, '');
	str = str.replace(/"/g, "''");
	str = str.replace(/'/g, '"');
	return str;
}