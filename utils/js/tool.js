const info = require('../../utils/js/info.js').info;

var tool = {
	//验证邮件格式
	verifyEmail(value) {
		var result = new RegExp("^([a-z0-9A-Z]+[-|_\\.]?)+[a-z0-9A-Z]@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-zA-Z]{2,}$")
		if(!value) {
			return {
				flag: false,
				message: '邮箱不能为空'
			};
		} else if(result.test(value)) {
			return {
				flag: true,
				message: '验证成功'
			};
		} else {
			return {
				flag: false,
				message: '邮箱格式不正确'
			};
		}
	},

	//验证手机号
	verifyMobile(value) {
		if(!value) {
			return {
				flag: false,
				message: '手机号不能为空'
			};
		} else if(/^[1][34578]\d{9}$/.test(value)) {
			return {
				flag: true,
				message: '验证成功'
			};
		} else {
			return {
				flag: false,
				message: '手机号格式不正确'
			};
		}

	},
	
	//验证网址格式
	verifyWebsite(value) {
		var regExp = /^((https?|http|ftp|news):\/\/)+([a-z]([a-z0-9\-]*[\.。])+([a-z]{2}|aero|arpa|biz|com|coop|edu|gov|info|int|jobs|mil|museum|name|nato|net|org|pro|travel)|(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))(\/[a-z0-9_\-\.~]+)*(\/([a-z0-9_\-\.]*)(\?[a-z0-9+_\-\.%=&]*)?)?(#[a-z][a-z0-9_]*)?$/;
		if(regExp.test(value)) {
			return {
				flag: true,
				message: '验证成功'
			};
		} else {
			return {
				flag: false,
				message: '网址格式不正确'
			};
		}
	},

	//6位验证手机验证码
	verifyMobileCode(value) {
		if(value.length !== 6) {
			return {
				flag: false,
				message: '请填写6位数字的手机验证码'
			};
		} else if(!/[0-9]{6}/.test(value)) {
			return {
				flag: false,
				message: '验证码不正确'
			};
		} else {
			return {
				flag: true,
				message: '验证成功'
			};
		}
	},

	//验证密码格式
	verifyPwd(value) {
		if(value.length < 6 || value.length > 16) {
			return {
				flag: false,
				message: '请填写6-16位密码'
			};
		} else if(!/^[0-9A-Za-z_]{6,16}$/.test(value)) {
			return {
				flag: false,
				message: '密码只能是字母、数字、下划线'
			};
		} else {
			return {
				flag: true,
				message: '验证成功'
			};
		}
	},

	//验证两个字符是否一致
	verifySame(value1, value2) {
		if(value1 == value2) {
			return {
				flag: true,
				message: '验证成功'
			};
		} else {
			return {
				flag: false,
				message: '两次输入不一致'
			};
		}
	},

	//验证图形验证码
	verifyImgCode(value) {
		if(!value) {
			return {
				flag: false,
				message: '验证码不能为空'
			};
		} else if(!/^[0-9A-Za-z_]{4}$/.test(value)) {
			return {
				flag: false,
				message: '验证码只能是数字或字母'
			};
		} else {
			return {
				flag: true,
				message: '验证成功'
			};
		}
	},

	/* 倒计时*/
	countTime(eleId, sec, initFn, callbackFn) {
		var time = sec;
		obj = document.getElementById(eleId);
		obj.classList.add('fd-btn-disabled');
		document.getElementById(eleId).innerHTML = sec + '秒后可重试';
		initFn();

		var handle = setInterval(function() {
			time--;
			obj.innerHTML = time + '秒后可重试';
			if(time < 1) {
				clearInterval(handle);
				obj.innerHTML = '获取验证码';
				obj.classList.remove('fd-btn-disabled');
				if(typeof callbackFn == "function") {
					callbackFn();
				}
			}
		}, 1000);
	},

	/*查询当前值是否在数组中*/
	findInArr(arr, value) {
		for(var index in arr) {
			if(arr[index] == value) {
				return true;
				break;
			}
		}
		return false;
	},

	/*查询当前值在数组中的索引*/
	findIndexInArr(arr, value) {
		for(var index in arr) {
			if(arr[index] == value) {
				return index;
				break;
			}
		}
		return false;
	},

	/*删除数组的指定索引元素*/
	removFromArr(arr, index, callbackFn) {
		arr.splice(index, 1); //删除指定位置的元素
		if(typeof callbackFn == "function") {
			callbackFn();
		}
	},

	/*是否按下键盘的数字键*/
	isNumKey() {
		var keyCode = event.keyCode;
		if((keyCode >= 48 && keyCode <= 57)) {
			event.returnValue = true;
		} else {
			event.returnValue = false;
		}
	},

	//日期转换格式转换----函数
	formatDate(date, format) {
		if(typeof date == "string") date = new Date(date);
		var o = {
			"M+": date.getMonth() + 1, //month
			"d+": date.getDate(), //day
			"h+": date.getHours(), //hour
			"m+": date.getMinutes(), //minute
			"s+": date.getSeconds(), //second
			"q+": Math.floor((date.getMonth() + 3) / 3), //quarter
			"S": date.getMilliseconds() //millisecond
		}
		if(/(y+)/.test(format)) format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		for(var k in o)
			if(new RegExp("(" + k + ")").test(format))
				format = format.replace(RegExp.$1,
					RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		return format;
	},
	
	//ajax请求
	ajax(param) {
		var config = {
			url: param.url, //请求url
			data: param.data || {}, //请求参数
			type: param.type || 'POST', //请求方式，默认为post
			loading: param.loading, //是否需要loading动画，默认为true
			success: param.success, //请求成功回调函数
			error: param.error //请求失败回调函数
		}
		if(!config.url) {
			alert('url required');
			return
		}
		if(config.loading === undefined) config.loading = true;
		if(config.loading) tool.loading(true);
		let objData = []
		for(var i in config.data) {
			if(config.data[i] === '' || config.data[i] === null || config.data[i] === undefined) {
				delete config.data[i];
				continue;
			}
		}
		
		if(!config.data.rd_session){
			config.data.rd_session = wx.getStorageSync('rd_session')||''
		}
		
		wx.request({
			url: config.url, 
			data: config.data,
			method: config.type,
			header:{
				'content-type': config.type=='POST'?'application/x-www-form-urlencoded':'application/json',
			},
			success(res) {
				if(res.data.code == 444) {
//					window.location.href = "/login/login?backUrl=" + encodeURIComponent(window.location.href);
					config.success(res.data);
				} else if(res.data.code == 301){
                  	const app = getApp();
                  	let loginSatus = app.data.loginStatus;
                  	if(loginSatus){
                  		app.data.loginStatus = false
					}
                  wx.clearStorageSync();
                  config.success(res.data);
                  if(config.loading) tool.loading(false);
				}else if(typeof config.success == "function") {
					config.success(res.data);
					if(config.loading) tool.loading(false);
				};
			},
			fail(error) {
				if(config.loading) tool.loading(false);
				if(typeof config.error == "function") {
					config.error(error);
				}
				console.error(error + ' on ' + config.url);
			}
		})
		
	},
	/*加载动画*/
	loading(state) {
		if(!!state) {
			wx.showToast({
				title: "loading",
				icon: 'loading',
				duration: 100000
			})
		}else{
			wx.hideToast()
		}
	},
	/*打印提示*/
	showToastText(title,type){
		setTimeout(()=>{
			wx.showToast({
				title: title,
				icon: type?"success":"none",
			})
		},15)
	},
	/*id匹配文案或索引*/
	_match(status, id, getIndex) {
		if(id===undefined||id===null) return
		var dataList = [];
		var value = [];
		let dataType = false;
		switch (status){
			case 'sex':
				dataList = info.getGender(); //性别
				dataType = true;
				break;
			case 'edu':
				dataList = info.getEducation(); //学历
				break;
			case 'salary':
				dataList = info.getSalary(); //学历
				break;
			case 'workType':
				dataList = info.getWorkType(); //求职状态
//				id--
//				dataType = true;
				break;
			case 'master':
				dataList = info.getProficiency(); //求职状态
				id--
				dataType = true;
				break;
			case 'compProperty':
				dataList = info.getComProperty(); //求职状态
				break;
			case 'compSize':
				dataList = info.getCompSize(); //求职状态
				break;
			default:
				break;
		}
		if(dataType){
			value.push(!getIndex?dataList[id].value:id);
		}else{
			id = id.toString().split(',');
			for(var i = 0; i < id.length; i++) {
				for(var j = 0; j < dataList.length; j++) {
					if(dataList[j].id == id[i]) {
						value[i] = !getIndex?dataList[j].value:j;
						break;
					}
				}
			}
		}
		return value.join('，');
	}
};

module.exports = {
	tool: tool
}